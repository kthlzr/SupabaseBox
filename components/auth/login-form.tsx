'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.refresh()
    router.push('/dashboard')
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300" htmlFor="password">
            Password
          </label>
          <Link
            href="/reset-password"
            className="text-xs text-zinc-500 hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <input
          {...register('password')}
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-white/20 focus:ring-1 focus:ring-white/20"
        />
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {error && <div className="rounded-lg bg-red-400/10 p-3 text-sm text-red-400">{error}</div>}

      <button
        disabled={isLoading}
        type="submit"
        className="flex w-full items-center justify-center rounded-lg bg-white p-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
      </button>
    </form>
  )
}
