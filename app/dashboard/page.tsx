import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/supabase/admin'

export default async function DashboardPage() {
  const supabase = await createClient()
  const isUserAdmin = await isAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user.id)
    .single()

  let avatarUrl = null
  if (profile?.avatar_url) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url)
    avatarUrl = data.publicUrl
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-12 w-12 rounded-xl object-cover border border-white/10"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-zinc-500 font-bold">
                  {(profile?.full_name || user.email || '?')[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-zinc-400 mt-1">
                Welcome back, {profile?.full_name || user.email?.split('@')[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isUserAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-sm font-medium text-emerald-400"
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Settings
            </Link>
            <form action={handleSignOut}>
              <button className="px-4 py-2 rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-200">User Profile</h2>
            <div className="space-y-4">
              {profile?.full_name && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Full Name</p>
                  <p className="text-white mt-1">{profile.full_name}</p>
                </div>
              )}
              {profile?.username && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Username</p>
                  <p className="text-white mt-1">@{profile.username}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                  Email Address
                </p>
                <p className="text-white mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-200">Security</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Your account is protected with Supabase Row Level Security.
            </p>
            <Link href="/reset-password" className="text-white hover:underline text-sm font-medium">
              Update Password
            </Link>
          </div>
        </section>

        <section className="p-12 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to build?</h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8">
            This boilerplate is ready for your next big idea. Start adding your own Server Actions,
            API routes, and components.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="https://supabase.com/docs"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all"
            >
              Supabase Docs
            </Link>
            <Link
              href="https://nextjs.org/docs"
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold"
            >
              Next.js Docs
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
