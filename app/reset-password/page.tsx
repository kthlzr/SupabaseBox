'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ArrowLeft, Box, Mail } from 'lucide-react'
import Link from 'next/link'

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  async function onSubmit(data: ResetFormValues) {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-6 selection:bg-emerald-500/30">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-2 shadow-2xl group transition-all hover:border-white/10">
            <Mail className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-zinc-200" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Reset Password</h1>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Enter your email to get back in</p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] -rotate-12 pointer-events-none">
            <Box className="h-32 w-32 text-white" />
          </div>

          {success ? (
            <div className="rounded-2xl bg-emerald-500/5 p-6 text-center border border-emerald-500/10 space-y-3">
              <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest leading-relaxed">
                Check your email for a password reset link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest" htmlFor="email">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/10 focus:bg-white/[0.05] transition-all"
                />
                {errors.email && (
                  <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{errors.email.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/5 p-3 border border-red-500/10 text-[10px] font-bold text-red-500/80 uppercase tracking-tight">
                  {error}
                </div>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-white py-3 text-[10px] font-black text-black uppercase tracking-widest transition-all hover:bg-zinc-200 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
