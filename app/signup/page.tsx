import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupForm from '@/components/auth/signup-form'
import { Box, ChevronRight } from 'lucide-react'

export default async function SignupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-6 selection:bg-emerald-500/30">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-2 shadow-2xl group transition-all hover:border-white/10">
            <Box className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-zinc-200" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Create Account</h1>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Join us today</p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] -rotate-12 pointer-events-none">
            <Box className="h-32 w-32 text-white" />
          </div>
          <SignupForm />
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all"
          >
            Log in to existing account
            <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
