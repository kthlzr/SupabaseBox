import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/auth/login-form'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-white/[0.07]">
        <div className="text-center">
          <h1 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-zinc-400">Log in to your account to continue</p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-zinc-500">Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
