'use client'

import { useState, useMemo } from 'react'
import { Users, Shield, ArrowLeft, BarChart3, Activity, Mail, Calendar, Search } from 'lucide-react'
import Link from 'next/link'
import { UserActions } from '@/components/admin/user-actions'
import { useRealtime } from '@/hooks/use-realtime'

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
  initialUsers: JoinedUser[]
  totalUserCount: number
}

export function AdminDashboardUI({ initialUsers, totalUserCount }: AdminDashboardUIProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { onlineUsers } = useRealtime()

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, initialUsers])

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight">
                  Admin Central
                </h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  Live Now: {onlineUsers.length}
                </div>
              </div>
              <p className="text-zinc-500 mt-1.5 font-medium ml-1">Command center for your growing community</p>
            </div>
          </div>

          <div className="relative group max-w-md w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all placeholder:text-zinc-600 font-medium"
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/10 transition-colors shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Total Community</h2>
              <div className="p-2 rounded-lg bg-white/5">
                <Users className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
            <p className="text-5xl font-black tracking-tighter relative z-10">{totalUserCount}</p>
          </div>

          <div className="group relative p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/10 transition-colors shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Active Pulse</h2>
              <div className="p-2 rounded-lg bg-emerald-500/5">
                <Activity className="h-5 w-5 text-emerald-500/70" />
              </div>
            </div>
            <p className="text-5xl font-black tracking-tighter text-emerald-400 relative z-10">
              {onlineUsers.length} <span className="text-sm text-zinc-600 font-bold uppercase tracking-widest ml-1">Live</span>
            </p>
          </div>

          <div className="group relative p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/10 transition-colors shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">System State</h2>
              <div className="p-2 rounded-lg bg-blue-500/5">
                <BarChart3 className="h-5 w-5 text-blue-500/70" />
              </div>
            </div>
            <p className="text-5xl font-black tracking-tighter text-blue-400 relative z-10">CORE</p>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 md:p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Shield className="h-64 w-64 rotate-12" />
          </div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <Users className="h-6 w-6 text-emerald-500" />
              User Directory
            </h2>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Live Data
            </div>
          </div>
          
          <div className="overflow-x-auto relative z-10">
            {filteredUsers.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <th className="pb-6 pr-4">Member</th>
                    <th className="pb-6 px-4">Role</th>
                    <th className="pb-6 px-4">Joined</th>
                    <th className="pb-6 px-4 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="group/row hover:bg-white/[0.01] transition-all duration-300">
                      <td className="py-6 pr-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-black text-lg text-zinc-400 group-hover/row:border-emerald-500/30 group-hover/row:text-emerald-400 transition-all shadow-lg">
                              {(u.full_name || u.email || '?')[0].toUpperCase()}
                            </div>
                            {onlineUsers.includes(u.id) && (
                              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-zinc-950 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-100 group-hover/row:text-white transition-colors leading-none">
                              {u.full_name || u.email?.split('@')[0] || 'Member'}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                <Mail className="h-3 w-3" />
                                <span className="max-w-[150px] truncate">{u.email}</span>
                              </div>
                              {u.username && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-zinc-500 uppercase tracking-tighter">
                                  @{u.username}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                          u.role === 'admin' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                          <Calendar className="h-3.5 w-3.5 opacity-50" />
                          {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <div className="inline-block transform group-hover/row:scale-105 transition-transform">
                          <UserActions 
                            userId={u.id} 
                            currentRole={u.role} 
                            userEmail={u.email} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-600 space-y-4">
                <Search className="h-12 w-12 opacity-20" />
                <p className="text-lg font-medium tracking-tight">No members found matching your search</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-emerald-500 hover:text-emerald-400 text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
