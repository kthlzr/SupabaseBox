'use server'

import { createServiceRoleClient } from './service-role'
import { isAdmin } from './admin'
import { revalidatePath } from 'next/cache'
import { createClient } from './server'

async function createAuditLog(action: string, targetUserId?: string, targetUserEmail?: string, metadata: any = {}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const adminClient = createServiceRoleClient()
  await adminClient.from('audit_logs').insert({
    actor_id: user.id,
    actor_email: user.email,
    action,
    target_user_id: targetUserId,
    target_user_email: targetUserEmail,
    metadata
  })
}

export async function deleteUser(userId: string) {
  // 1. Security check: Only admins can delete users
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new Error('Unauthorized')
  }

  const adminClient = createServiceRoleClient()

  // Get user info and profile for detailed logging before deletion
  const { data: { user: targetUser } } = await adminClient.auth.admin.getUserById(userId)
  const { data: targetProfile } = await adminClient
    .from('profiles')
    .select('username, full_name')
    .eq('id', userId)
    .maybeSingle()

  // 2. Delete from auth.users (cascades to profiles)
  const { error } = await adminClient.auth.admin.deleteUser(userId)

  if (error) {
    throw new Error(error.message)
  }

  // 3. Log the action with detailed metadata
  await createAuditLog('DELETE_USER', userId, targetUser?.email, {
    username: targetProfile?.username,
    full_name: targetProfile?.full_name
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function updateUserRole(userId: string, newRole: 'user' | 'admin') {
  // 1. Security check
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new Error('Unauthorized')
  }

  const adminClient = createServiceRoleClient()

  // Get current user info and profile to ensure we have full details
  const { data: { user: targetUser } } = await adminClient.auth.admin.getUserById(userId)

  // Get old profile for logging
  const { data: oldProfile } = await adminClient
    .from('profiles')
    .select('role, email, username, full_name')
    .eq('id', userId)
    .maybeSingle()

  // 2. Update profiles table (Upsert to handle missing rows)
  const { error: profileError } = await adminClient
    .from('profiles')
    .upsert({ 
      id: userId, 
      email: targetUser?.email || oldProfile?.email, 
      role: newRole,
      updated_at: new Date().toISOString()
    })

  if (profileError) {
    throw new Error(profileError.message)
  }

  // 3. Sync with auth.users metadata for consistency
  const { error: authError } = await adminClient.auth.admin.updateUserById(
    userId,
    { user_metadata: { role: newRole } }
  )

  if (authError) {
    console.error('Failed to sync role to auth metadata:', authError.message)
  }

  // 4. Log the action with detailed metadata
  await createAuditLog('UPDATE_ROLE', userId, targetUser?.email || oldProfile?.email, {
    old_role: oldProfile?.role || 'user',
    new_role: newRole,
    username: oldProfile?.username,
    full_name: oldProfile?.full_name
  })

  revalidatePath('/admin')
  return { success: true }
}
