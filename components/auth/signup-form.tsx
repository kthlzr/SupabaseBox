'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { SocialAuth } from './social-auth'

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

interface SignupFormProps {
  showSocialAuth?: boolean
  providers?: ('google' | 'github')[]
}

export default function SignupForm({
  showSocialAuth = true,
  providers = ['google', 'github'],
}: SignupFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)
    setError(null)

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
      setError('A user with this email already exists. Try logging in instead.')
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-emerald-500/5 p-6 text-center border border-emerald-500/10 space-y-3">
        <h3 className="text-sm font-black text-emerald-500 uppercase tracking-tighter italic">Check your email</h3>
        <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest leading-relaxed">
          A confirmation link has been sent to your email address. Please click it to activate your
          account.
        </p>
      </div>
    )
  }

  return (
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
        {errors.email && <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest" htmlFor="password">
          Password
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/10 focus:bg-white/[0.05] transition-all"
        />
        {errors.password && <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/10 focus:bg-white/[0.05] transition-all"
        />
        {errors.confirmPassword && (
          <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && <div className="rounded-xl bg-red-500/5 p-3 border border-red-500/10 text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{error}</div>}

      <button
        disabled={isLoading}
        type="submit"
        className="flex w-full items-center justify-center rounded-xl bg-white py-3 text-[10px] font-black text-black uppercase tracking-widest transition-all hover:bg-zinc-200 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign Up'}
      </button>

      <div className="pt-2">
        <SocialAuth show={showSocialAuth} providers={providers} />
      </div>
    </form>
  )
}
