'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Avatar } from './avatar'

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(1, 'Full name is required'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm({ user }: { user: any }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    getProfile()
  }, [user])

  async function getProfile() {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, full_name, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setValue('username', data.username || '')
        setValue('full_name', data.full_name || '')
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.log('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(data: ProfileFormValues, newAvatarUrl?: string) {
    try {
      setUpdating(true)
      setSaved(false)
      
      // Convert empty strings to null to avoid database constraint violations
      const cleanData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
      )

      const updates = {
        id: user.id,
        ...cleanData,
        avatar_url: newAvatarUrl || avatarUrl,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      alert(error.message || 'Error updating the data!')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Avatar
        uid={user.id}
        url={avatarUrl}
        size={100}
        onUpload={(url) => {
          setAvatarUrl(url)
          // Get current form values to save along with the new avatar
          const currentValues = {
            username: (document.getElementById('username') as HTMLInputElement)?.value || '',
            full_name: (document.getElementById('full_name') as HTMLInputElement)?.value || '',
          }
          updateProfile(currentValues as ProfileFormValues, url)
        }}
      />

      <form onSubmit={handleSubmit((data) => updateProfile(data))} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              value={user.email}
              disabled
              className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-zinc-700 outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest" htmlFor="username">
              Username
            </label>
            <input
              {...register('username')}
              id="username"
              type="text"
              placeholder="johndoe"
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/10 focus:bg-white/[0.05] transition-all"
            />
            {errors.username && (
              <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{errors.username.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest" htmlFor="full_name">
            Full Name
          </label>
          <input
            {...register('full_name')}
            id="full_name"
            type="text"
            placeholder="John Doe"
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white/10 focus:bg-white/[0.05] transition-all"
          />
          {errors.full_name && (
            <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{errors.full_name.message}</p>
          )}
        </div>

        <div className="flex items-center gap-6 pt-4">
          <button
            disabled={updating}
            type="submit"
            className="flex flex-1 items-center justify-center rounded-xl bg-white py-3 text-[10px] font-black text-black uppercase tracking-widest transition-all hover:bg-zinc-200 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-500 transition-all animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="h-4 w-4 shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Saved</span>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
