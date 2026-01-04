'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ArrowLeft } from 'lucide-react'
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Reset Password
          </h1>
          <p className="mt-2 text-zinc-400">
            Enter your email to receive a reset link
          </p>
        </div>

        {success ? (
          <div className="rounded-lg bg-emerald-400/10 p-6 text-center text-sm text-emerald-400 border border-emerald-400/20">
            <p>Check your email for a password reset link.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-white/20 focus:ring-1 focus:ring-white/20"
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-400/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-white p-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
