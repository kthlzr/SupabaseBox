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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10 hover:bg-white/[0.05] shadow-2xl"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Settings</h1>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] leading-none">Manage your profile</p>
            </div>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-white/[0.02] border border-white/5 shadow-2xl">
            <Settings className="h-6 w-6 text-zinc-500 animate-[spin_8s_linear_infinite]" />
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 pointer-events-none">
            <Settings className="h-32 w-32 text-white" />
          </div>
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}
