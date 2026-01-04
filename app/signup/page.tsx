import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupForm from '@/components/auth/signup-form'

export default async function SignupPage() {
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
            Create an Account
          </h1>
          <p className="mt-2 text-zinc-400">Enter your details to get started</p>
        </div>

        <SignupForm />

        <div className="text-center text-sm">
          <span className="text-zinc-500">Already have an account? </span>
          <Link href="/login" className="font-medium text-white underline-offset-4 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
