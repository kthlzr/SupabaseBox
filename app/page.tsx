import Link from 'next/link'
import SignupForm from '@/components/auth/signup-form'
import { ArrowRight, Box, Shield, Zap, Database, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10 overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/10 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-[128px] -z-10" />

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Box className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight">SupabaseBox</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            V1.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Build Faster with{' '}
            <span className="bg-gradient-to-br from-white via-white to-zinc-600 bg-clip-text text-transparent">
              Supabase & Next.js
            </span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The ultimate boilerplate to jumpstart your next SaaS project. Auth, Database, RLS, and a
            stunning UI included out of the box.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              Deploy to Vercel
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Secure Auth"
            description="Full authentication suite with email confirmation, password reset, and middleware protection."
          />
          <FeatureCard
            icon={<Database className="w-6 h-6" />}
            title="Real-time DB"
            description="PostgreSQL database with Supabase. Real-time subscriptions and Row Level Security."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Type-Safe"
            description="End-to-end type safety with TypeScript, Zod validation, and generated database types."
          />
        </section>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-white/10 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
        <div className="scale-150 rotate-12">{icon}</div>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
    </div>
  )
}
