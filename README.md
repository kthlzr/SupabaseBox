<div align="center">
  <h1>SupabaseBox</h1>
  <p>A production-ready, minimalist full-stack starter built with Supabase and Next.js, featuring authentication, database, and premium UI</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  </p>

  <br />
</div>

---

## ✨ Features

- ⚡ **Next.js 16** with App Router and Turbopack support
- 🔐 **Complete Authentication** - Sign up with email confirmation, login, and password reset flow
- 💾 **Supabase Integration** - Secure database access with `@supabase/ssr`
- 🎨 **Tailwind CSS 4** - Modern CSS-first styling with custom theme variables
- 🛡️ **Rate Limiting** - Built-in security middleware for API protection
- 👤 **User Profiles** - Dedicated profiles table linked to Auth users
- 🖼️ **Avatar Management** - Profile picture uploads via Supabase Storage
- 🛡️ **Admin Dashboard** - Minimalist, compact "terminal" UI with real-time stats and management
- 📜 **Audit Logging** - Full traceability of admin actions with detailed user identifiers and actor accountability
- ✅ **Type-Safe Validation** - Powered by **Zod 4.x** and React Hook Form
- 🎯 **Developer Experience** - ESLint, Prettier, and TypeScript pre-configured
- 📱 **Premium UI** - Responsive glassmorphism design with sleek animations

## 📋 Prerequisites

- Node.js 18.18+
- A [Supabase](https://supabase.com) project

## 🛠️ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/kthlzr/SupabaseBox.git
cd SupabaseBox
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

## 🔐 Environment Configuration

Create a `.env.local` file in the root directory. Below are the required variables:

| Variable | Description | Location in Supabase |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your project's API URL | Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for client-side use | Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key for administrative tasks | Project Settings > API (KEEP SECRET) |

> [!CAUTION]
> **Never** expose the `SUPABASE_SERVICE_ROLE_KEY` on the client side. It is used exclusively in server components and server actions to manage users and bypass RLS.

## 📁 Project Structure

```
├── app/                  # Next.js App Router
│   ├── admin/            # Admin Dashboard (Protected)
│   ├── auth/callback/    # Supabase auth callback route
│   ├── dashboard/        # Protected user dashboard
│   │   └── settings/     # Profile settings page
│   ├── login/ / signup/  # Auth entry points
│   ├── reset-password/   # Password reset flows
│   ├── globals.css       # Tailwind 4 theme & styles
│   └── layout.tsx        # Root layout & providers
├── components/           # UI Components
│   ├── admin/            # Admin UI, Actions, and Audit list
│   ├── auth/             # Login, Signup, and Social forms
│   └── profile/          # Profile and Avatar management
├── hooks/                # Custom React hooks
│   └── use-realtime.ts   # Realtime Presence & Notifications
├── lib/                  # Utility functions
│   ├── supabase/         # Client, Server, and Admin logic
│   │   ├── admin-actions.ts # Admin-only server actions
│   │   ├── service-role.ts # Service Role client (Master)
│   │   └── middleware.ts # Session & Protected routes logic
│   └── rate-limit.ts     # In-memory rate limiting protection
├── supabase/             # Database & Schema
│   └── schema.sql        # Idempotent DB setup script
├── proxy.ts              # Next.js 16 Middleware proxy
└── package.json          # Deployment & build scripts
```

## 🧰 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run type-check` - Run TypeScript compiler checks
- `npm run eslint:fix` - Lint and auto-fix code style
- `npm run format` - Format code with Prettier
- `npm run clean` - Deep clean build artifacts and modules

## 🔐 Authentication Flows

The boilerplate comes with "batteries-included" authentication:
- **Middleware Protected**: Automatic redirection for private routes.
- **Email Confirmation**: Verified signups via Supabase Auth.
- **Identity Check**: Smart signup feedback if an email is already registered.
- **Password Reset**: End-to-end flow for forgotten passwords.

### Protected Routes

Add authentication to any server-side page by using the server client:

```tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return <div>Protected content for {user.email}</div>;
}
```

## 🗄️ Database

Use the Supabase client to interact with your database:

```tsx
import { createClient } from '@/lib/supabase/server';

export async function getData() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('your_table')
    .select('*');
    
  return { data, error };
}
```

## 🌍 Social Authentication

The boilerplate includes a pre-built `SocialAuth` component for Google and GitHub.

### 1. Manual Setup in Supabase
To enable OAuth providers, you must configure them in your Supabase Dashboard:
1. Go to **Authentication** -> **Providers**.
2. **GitHub**: Create a GitHub OAuth App and copy the Client ID/Secret.
3. **Google**: Create a Google Cloud Project with OAuth 2.0 credentials and copy the Client ID/Secret.
4. Add the **Redirect URL** provided by Supabase to your provider's settings.

### 2. Usage & UI Control

The `SocialAuth` component can be customized or hidden entirely:

```tsx
import { SocialAuth } from '@/components/auth/social-auth';

// Default: Show all providers
<SocialAuth />

// Only show GitHub
<SocialAuth providers={['github']} />

// Hide the entire social auth section
<SocialAuth show={false} />
```

## 👤 User Profiles & Avatars

The boilerplate includes a complete profile management system:
- **Automatic Creation**: A Supabase trigger creates a profile record on every new signup.
- **Avatar Uploads**: Integrated with Supabase Storage (`avatars` bucket).
- **Settings Page**: Pre-built UI at `/dashboard/settings` for users to update their info (Username, Full Name, Avatar).

### Database Setup
Run the SQL found in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor. The script is idempotent and includes:
- `profiles` table with automatic row-sync.
- `audit_logs` table for administrative tracking.
- `handle_new_user` trigger for instant profile creation.
- `avatars` storage bucket and RLS policies.

## 🛡️ Admin Dashboard (Terminal UI)

The boilerplate includes a secure, minimalist Admin Dashboard at `/admin` designed for high-density management and real-time oversight.

### Key Features
- **🗜️ Minimalist Terminal**: A compact, dark-themed UI designed for efficiency and scanning large user bases.
- **👑 Advanced RBAC**: Access restricted to `admin` roles, managed via server actions and the Service Role master client.
- **🤴 User Management**: promote/demote or delete users directly from the directory with instant feedback.
- **🛰️ Live Presence**: Real-time "Active Pulse" indicator showing exactly who is online.

### 📜 Audit Trail & Accountability
Every administrative action is permanently recorded for security and oversight:
- **Detailed Tracking**: Logs use the format `username (fullname) (id)` for unambiguous identification.
- **Actor Accountability**: Every log entry explicitly identifies who performed the action (e.g., `by: admin@example.com`).
- **Informative Metadata**: Captures old/new roles and user details even if the target user is later deleted.

### ⚡ Realtime Features
- **Presence**: Real-time stats for currently online users.
- **Toasts**: Instant `sonner` notifications for new signups and role changes.

#### Enable Realtime (Required)
To see live updates and accurate role change notifications, you must configure your `profiles` table:
1. Go to **Database** > **Publication** in Supabase.
2. Under **supabase_realtime**, click **Tables**.
3. Toggle the switch for the `profiles` table to **ON**.

### Security Implementation
- **Server Actions**: All administrative actions are implemented via Next.js Server Actions with secondary admin validation.
- **Service Role**: Utilizes the `SUPABASE_SERVICE_ROLE_KEY` on the server to bypass RLS for master administrative control.

## 🚀 Deployment Guide

Follow these steps to deploy your boilerplate to production.

### 1. Supabase Preparation
1.  **Project Creation**: Create a new project at [supabase.com](https://supabase.com).
2.  **Database Setup**: Copy the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it in the **SQL Editor**.
3.  **Storage**: Ensure the `avatars` bucket exists (automatically created by the script) and is marked as **Public**.

### 2. Vercel Deployment
1.  **Connect Repo**: Import your GitHub repository to [Vercel](https://vercel.com).
2.  **Environment Variables**: Add the following keys:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your project's `anon` public key.
    - `SUPABASE_SERVICE_ROLE_KEY`: Your project's `service_role` secret key (Mandatory for Admin Panel).
3.  **Deploy**: Hit deploy! Next.js 16 will automatically optimize your build.

### 3. Post-Deployment Checklist
- [ ] **Auth Signups**: Test a real signup to ensure the email trigger works.
- [ ] **Admin Access**: Manually promote your first user to 'admin' in the Supabase SQL editor to unlock the dashboard.
- [ ] **Avatars**: Test an image upload to verify Storage bucket permissions.
- [ ] **Rate Limiting**: Verify middleware is active by checking the X-RateLimit headers.

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/)
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `chore:` for maintenance tasks
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with a clear description

## 💬 Support

- 🐛 [Report Bug](https://github.com/kthlzr/nextjs-supabase-boilerplate/issues)
- 💡 [Request Feature](https://github.com/kthlzr/nextjs-supabase-boilerplate/issues)
- 💬 [Discussions](https://github.com/kthlzr/nextjs-supabase-boilerplate/discussions)

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star on GitHub!

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built for high-performance SaaS development</p>
  <p>
    <a href="https://github.com/kthlzr">GitHub Profile</a>
  </p>
</div>
