import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'
import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-sm text-zinc-400">Manage your profile and account settings</p>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
            <Settings className="h-6 w-6 text-zinc-400" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-3xl shadow-2xl">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}
