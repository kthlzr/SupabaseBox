-- Create a table for public profiles (Idempotent)
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  username text unique,
  full_name text,
  email text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),

  -- Use a check constraint to ensure username is at least 3 characters if set
  constraint username_length check (username is null or char_length(username) >= 3)
);

-- Ensure columns exist if table was created earlier
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='email') then
    alter table public.profiles add column email text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='role') then
    alter table public.profiles add column role text default 'user' check (role in ('user', 'admin'));
  end if;
end $$;

-- Set up Row Level Security
alter table profiles enable row level security;
alter table profiles replica identity full;

-- Policies (Drop and recreate to be idempotent)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile." on profiles;
create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow rerunning the script
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Set up Storage for avatars (ON CONFLICT DO NOTHING for idempotency)
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

-- Set up storage policies (Drop and recreate)
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Anyone can upload an avatar." on storage.objects;
create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "Anyone can update their own avatar." on storage.objects;
create policy "Anyone can update their own avatar." on storage.objects
  for update with check (auth.uid() = owner and bucket_id = 'avatars');

-- Audit Logs table for tracking administrative actions
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  actor_id uuid references auth.users not null,
  actor_email text,
  action text not null,
  target_user_id uuid,
  target_user_email text,
  metadata jsonb default '{}'::jsonb
);

-- Ensure actor_email exists if table was created earlier
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='audit_logs' and column_name='actor_email') then
    alter table public.audit_logs add column actor_email text;
  end if;
end $$;

-- RLS for audit_logs
alter table audit_logs enable row level security;

-- Only admins can see audit logs
drop policy if exists "Admins can view all audit logs" on audit_logs;
create policy "Admins can view all audit logs" on audit_logs
  for select using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );
