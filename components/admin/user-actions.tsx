'use client'

import { useState } from 'react'
import { Trash2, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react'
import { deleteUser, updateUserRole } from '@/lib/supabase/admin-actions'
import { useRouter } from 'next/navigation'

interface UserActionsProps {
  userId: string
  currentRole: string
  userEmail: string
}

export function UserActions({ userId, currentRole, userEmail }: UserActionsProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteUser(userId)
      router.refresh()
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete user'}`)
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  const handleToggleRole = async () => {
    try {
      setLoading(true)
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      await updateUserRole(userId, newRole)
      router.refresh()
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update role'}`)
    } finally {
      setLoading(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-red-400 font-medium">Permanently delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="p-1 hover:bg-white/10 text-zinc-400 rounded transition-colors"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleRole}
        disabled={loading}
        title={currentRole === 'admin' ? 'Remove Admin Role' : 'Make Admin'}
        className={`p-2 rounded-lg border transition-colors ${
          currentRole === 'admin' 
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
            : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
        }`}
      >
        {currentRole === 'admin' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
      </button>

      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        title="Delete Account"
        className="p-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all shadow-lg"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
