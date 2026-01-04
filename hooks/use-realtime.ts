'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function useRealtime() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    // 1. Presence: Track online users
    const channel = supabase.channel('room_1', {
      config: {
        presence: {
          key: 'user_id',
        },
      },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const userIds = Object.keys(state)
        setOnlineUsers(userIds)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // Optional: Notify when someone joins
        console.log('Join:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Leave:', key, leftPresences)
      })

    // 2. Postgres Changes: Notify Admin of new signups/updates
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
      },
      (payload) => {
        interface RealtimeProfile {
          id: string;
          email?: string;
          full_name?: string;
          role?: string;
        }

        const newUser = payload.new as RealtimeProfile
        const oldUser = payload.old as Partial<RealtimeProfile>
        
        // Dynamic name fallback
        const name = newUser.full_name || newUser.email || `Member (${newUser.id?.slice(0, 5)})`

        if (payload.eventType === 'INSERT') {
          toast.success('New Member Joined!', {
            description: `${name} just signed up.`,
            duration: 5000,
          })
        } else if (payload.eventType === 'UPDATE') {
          const oldRole = oldUser?.role
          const newRole = newUser?.role
          
          // Only show Role Updated if we have the old role and it's actually different
          // (Requires REPLICA IDENTITY FULL on the table)
          if (oldRole && oldRole !== newRole) {
             toast.info('Role Updated', {
              description: `${name} is now ${newRole}.`,
            })
          } else {
            toast('Profile Updated', {
              description: `${name} updated their settings.`,
            })
          }
        }
      }
    )

    // Subscribe to everything
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const user = (await supabase.auth.getUser()).data.user
        if (user) {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { onlineUsers }
}
