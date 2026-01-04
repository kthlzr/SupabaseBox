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
      <div className="rounded-lg bg-emerald-400/10 p-6 text-center text-sm text-emerald-400 border border-emerald-400/20">
        <h3 className="font-semibold text-lg mb-2">Check your email</h3>
        <p>
          A confirmation link has been sent to your email address. Please click it to activate your
          account.
        </p>
      </div>
    )
  }

  return (
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
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="password">
          Password
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-white/20 focus:ring-1 focus:ring-white/20"
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-white/20 focus:ring-1 focus:ring-white/20"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && <div className="rounded-lg bg-red-400/10 p-3 text-sm text-red-400">{error}</div>}

      <button
        disabled={isLoading}
        type="submit"
        className="flex w-full items-center justify-center rounded-lg bg-white p-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign Up'}
      </button>

      <SocialAuth show={showSocialAuth} providers={providers} />
    </form>
  )
}
