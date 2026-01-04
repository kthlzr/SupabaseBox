'use client'

import { Activity, Clock, User, Shield, Trash2, Edit3 } from 'lucide-react'

interface AuditLog {
  id: string
  created_at: string
  action: string
  actor_email: string | null
  target_user_id: string | null
  target_user_email: string | null
  metadata: any
}

interface AuditLogListProps {
  logs: AuditLog[]
}

export function AuditLogList({ logs }: AuditLogListProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'DELETE_USER': return <Trash2 className="h-3 w-3 text-red-500/70" />
      case 'UPDATE_ROLE': return <Shield className="h-3 w-3 text-emerald-500/70" />
      default: return <Edit3 className="h-3 w-3 text-zinc-500" />
    }
  }

  const formatMetadata = (log: AuditLog) => {
    if (log.action === 'UPDATE_ROLE') {
      const from = log.metadata.old_role || 'none'
      const to = log.metadata.new_role
      return `Role: ${from} → ${to}`
    }
    return null
  }

  const getUserIdentifier = (log: AuditLog) => {
    const meta = log.metadata || {}
    const username = meta.username || '?'
    const fullName = meta.full_name ? ` (${meta.full_name})` : ''
    const shortId = ` (${log.target_user_id?.slice(0, 5)})`
    
    return (
      <span className="truncate">
        <span className="text-zinc-300 font-bold">{username}</span>
        <span className="text-zinc-500 font-medium">{fullName}</span>
        <span className="text-zinc-600 font-medium tracking-tighter ml-1">{shortId}</span>
      </span>
    )
  }

  return (
    <section className="rounded-3xl border border-white/5 bg-white/[0.01] p-5 backdrop-blur-3xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-sm font-black flex items-center gap-2 tracking-tighter text-zinc-400 uppercase">
          <Activity className="h-4 w-4 text-emerald-500/60" />
          Audit Trail
        </h2>
        <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
          Recent
        </div>
      </div>

      <div className="space-y-1.5 relative z-10">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="group/item flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/[0.01] transition-all">
              <div className="p-1 rounded bg-zinc-950 border border-white/5 group-hover/item:border-emerald-500/10 transition-colors">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                <div className="min-w-0 flex flex-col">
                  <div className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5 leading-none">
                    <span className="uppercase text-[9px] text-zinc-600 font-black min-w-[70px]">{log.action.replace('_', ' ')}</span>
                    <span className="text-zinc-800">•</span>
                    {getUserIdentifier(log)}
                  </div>
                  <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight mt-0.5 ml-[85.5px]">
                    {formatMetadata(log) || 'System recorded action'}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[8px] font-black text-zinc-700 whitespace-nowrap uppercase tracking-tighter">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <span className="mx-1 opacity-50">•</span>
                  <span className="text-zinc-500">by: {log.actor_email || 'System'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-zinc-700">
            <p className="text-[10px] font-black tracking-widest uppercase opacity-30 italic">No history available</p>
          </div>
        )}
      </div>
    </section>
  )
}
