import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/supabase/admin'
import { 
  User as UserIcon, 
  Shield, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ExternalLink,
  Code2,
  Box,
  Fingerprint
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const isUserAdmin = await isAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user.id)
    .single()

  let avatarUrl = null
  if (profile?.avatar_url) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url)
    avatarUrl = data.publicUrl
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-12">
        
        {/* Friendly Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.03]">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-16 w-16 rounded-2xl object-cover border border-white/5 group-hover:border-white/10 transition-all shadow-2xl"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center font-black text-xl text-zinc-600 transition-all group-hover:text-zinc-400">
                  {(profile?.full_name || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#050505] flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Account</h1>
                <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded leading-none">v1.0.4</span>
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
                Welcome back, {profile?.full_name || user.email?.split('@')[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isUserAdmin && (
              <Link
                href="/admin"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all text-[10px] font-black text-emerald-500/80 uppercase tracking-widest"
              >
                <Shield className="h-3 w-3" />
                Admin Panel
                <ChevronRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black text-zinc-400 uppercase tracking-widest"
            >
              <Settings className="h-3 w-3" />
              Settings
            </Link>
            <form action={handleSignOut}>
              <button className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <LogOut className="h-3 w-3" />
                Sign Out
              </button>
            </form>
          </div>
        </header>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-8 rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-3xl group hover:bg-white/[0.02] transition-all">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <Fingerprint className="h-4 w-4 text-emerald-500/50" />
              </div>
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">My Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1.5">Full Name</p>
                <p className="text-lg font-black text-zinc-200 tracking-tight leading-tight">
                  {profile?.full_name || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1.5">Username</p>
                <p className="text-lg font-black text-zinc-200 tracking-tight leading-tight italic">
                  @{profile?.username || 'none'}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1.5">Email Address</p>
                <div className="flex items-center gap-2 group/email">
                  <p className="text-lg font-black text-emerald-500/70 tracking-tight leading-tight">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-3xl group hover:bg-white/[0.02] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <Shield className="h-4 w-4 text-zinc-600" />
                </div>
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Security</h2>
              </div>
              <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide leading-relaxed mb-6">
                Your account is secure and your data is protected by industry-standard encryption.
              </p>
            </div>
            <Link 
              href="/update-password" 
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all group/btn"
            >
              Update Password
              <ChevronRight className="h-3 w-3 text-zinc-700 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Welcome Area */}
        <section className="relative overflow-hidden p-12 md:p-20 rounded-[3rem] border border-white/[0.03] bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] animate-pulse">
            <Code2 className="h-64 w-64 text-white" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/10 text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-6">
              <Box className="h-3 w-3" />
              Everything is ready
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
              START YOUR <br/><span className="italic text-zinc-700">PROJECT.</span>
            </h2>
            <p className="text-sm md:text-lg font-bold text-zinc-500 leading-relaxed mb-10 max-w-lg">
              Your production-ready environment is set up. Start building your next big project using our pre-built resources.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://supabase.com/docs"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Learn More
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://nextjs.org/docs"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-xs font-black text-white uppercase tracking-widest"
              >
                Help Center
                <ExternalLink className="h-3.5 w-3.5 text-zinc-600" />
              </Link>
            </div>
          </div>
        </section>

        {/* Site Footer */}
        <footer className="pt-12 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">
          <p>© 2026 SUPABASEBOX. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link href="https://github.com/kthlzr" className="hover:text-zinc-500 transition-colors">GitHub Repository</Link>
            <div className="h-1 w-1 rounded-full bg-zinc-800" />
            <span className="text-emerald-500/50">STATUS: ONLINE</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
