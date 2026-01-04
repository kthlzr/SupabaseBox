'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

const updateSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type UpdateFormValues = z.infer<typeof updateSchema>

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  })

  async function onSubmit(data: UpdateFormValues) {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            New Password
          </h1>
          <p className="mt-2 text-zinc-400">
            Set a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              New Password
            </label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="confirmPassword">
              Confirm New Password
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
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
