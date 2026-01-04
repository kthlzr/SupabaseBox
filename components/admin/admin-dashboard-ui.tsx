'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Search, Mail, Shield, Users, Activity, BarChart3, Clock } from 'lucide-react'
import Link from 'next/link'
import { UserActions } from '@/components/admin/user-actions'
import { useRealtime } from '@/hooks/use-realtime'
import { AuditLogList } from './audit-log-list'

interface JoinedUser {
  id: string
  email: string
  last_sign_in: string | null
  created_at: string
  full_name: string | null
  username: string | null
  role: string
  avatar_url: string | null
}

interface AdminDashboardUIProps {
  initialUsers: any[]
  totalUserCount: number
  logs: any[]
}

export function AdminDashboardUI({ initialUsers, totalUserCount, logs }: AdminDashboardUIProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { onlineUsers } = useRealtime()

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, initialUsers])

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Compact Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">Control</h1>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mt-0.5">Terminal • v1.0.4</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">
                Active: {onlineUsers.length}
             </div>
             <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Total: {totalUserCount}
             </div>
          </div>
        </header>

        {/* Minimalist Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Network Size</p>
              <p className="text-2xl font-black text-white tracking-tighter">{totalUserCount}</p>
            </div>
            <Users className="h-4 w-4 text-zinc-700" />
          </div>
          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Live Pulse</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-emerald-500 tracking-tighter">{onlineUsers.length}</p>
                <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[8px] font-black text-emerald-500/80 uppercase tracking-tighter">Live</div>
              </div>
            </div>
            <Activity className="h-4 w-4 text-emerald-500/30" />
          </div>
          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">System State</p>
              <p className="text-2xl font-black text-zinc-300 tracking-tighter uppercase italic">Stable</p>
            </div>
            <Shield className="h-4 w-4 text-zinc-700" />
          </div>
        </div>

        {/* Compact Table Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Identity Registry</h2>
            <div className="relative group max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 group-focus-within:text-emerald-500/50 transition-colors" />
              <input 
                type="text" 
                placeholder="Find identity..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:bg-white/[0.05] transition-all"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden backdrop-blur-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Profile</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest hidden md:table-cell">Identity</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest hidden lg:table-cell">Access</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Command</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="group/row hover:bg-white/[0.01] transition-all">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-[11px] text-zinc-500 group-hover/row:border-emerald-500/20 group-hover/row:text-emerald-500/70 transition-all">
                                {(u.full_name || u.email || '?')[0].toUpperCase()}
                              </div>
                              {onlineUsers.includes(u.id) && (
                                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#050505] flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-zinc-200 truncate leading-none mb-1">{u.full_name || 'Anonymous'}</p>
                              <p className="text-[10px] font-bold text-zinc-600 truncate uppercase tracking-tighter">@{u.username || 'unknown'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
                             <Mail className="h-3 w-3 opacity-30" />
                             {u.email}
                          </div>
                        </td>
                        <td className="px-6 py-3 hidden lg:table-cell">
                          <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                            u.role === 'admin' 
                            ? 'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/10' 
                            : 'bg-zinc-500/10 text-zinc-500 border border-white/5'
                          }`}>
                            {u.role || 'user'}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <UserActions userId={u.id} currentRole={u.role as 'user' | 'admin'} userEmail={u.email || ''} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-800">
                        <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Identity not found in registry</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Audit Log Trail */}
        <AuditLogList logs={logs} />
      </div>
    </div>
  )
}
