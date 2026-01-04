<div align="center">
  <h1>Next.js + Supabase Boilerplate</h1>
  <p>A production-ready, modern full-stack starter with authentication, database, and beautiful UI</p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#scripts">Scripts</a> •
    <a href="#deployment">Deployment</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  </p>
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
- ✅ **Type-Safe Validation** - Powered by **Zod 4.x** and React Hook Form
- 🎯 **Developer Experience** - ESLint, Prettier, and TypeScript pre-configured
- 📱 **Premium UI** - Responsive glassmorphism design with sleek animations

## 📋 Prerequisites

- Node.js 18.18+
- A [Supabase](https://supabase.com) project

## 🛠️ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/kthlzr/nextjs-supabase-boilerplate.git
cd nextjs-supabase-boilerplate
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
├── app/                  # Next.js App Router
│   ├── auth/callback/    # Supabase auth callback route
│   ├── dashboard/        # Protected dashboard
│   │   └── settings/     # Profile settings page
│   ├── login/            # Login page logic
│   ├── signup/           # Signup page logic
│   ├── reset-password/   # Password reset request
│   ├── update-password/  # Password reset completion
│   ├── globals.css       # Tailwind 4 theme & styles
│   └── layout.tsx        # Root layout & providers
├── components/           # UI Components
│   ├── auth/             # Login and Signup forms
│   └── profile/          # Profile and Avatar components
├── lib/                  # Utility functions
│   ├── supabase/         # Client, Server, and Middleware setup
│   └── rate-limit.ts     # In-memory rate limiting
├── proxy.ts              # Next.js 16 Middleware proxy
├── package.json          # Scripts and dependencies
└── tsconfig.json         # TypeScript configuration
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
Run the SQL found in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor to set up the:
- `profiles` table.
- `handle_new_user` trigger.
- `avatars` storage bucket and RLS policies.

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository.
2. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
3. Deploy!

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
