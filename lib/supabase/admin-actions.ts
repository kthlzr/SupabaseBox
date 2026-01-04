'use server'

import { createServiceRoleClient } from './service-role'
import { isAdmin } from './admin'
import { revalidatePath } from 'next/cache'

export async function deleteUser(userId: string) {
  // 1. Security check: Only admins can delete users
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new Error('Unauthorized')
  }

  const adminClient = createServiceRoleClient()

  // 2. Delete from auth.users (cascades to profiles)
  const { error } = await adminClient.auth.admin.deleteUser(userId)

  if (error) {
    throw new Error(error.message)
  }

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

  // 2. Update profiles table (Upsert to handle missing rows)
  const { error: profileError } = await adminClient
    .from('profiles')
    .upsert({ 
      id: userId, 
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

  revalidatePath('/admin')
  return { success: true }
}
