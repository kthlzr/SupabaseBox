import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { redirect } from 'next/navigation'
import { AdminDashboardUI } from '@/components/admin/admin-dashboard-ui'

export default async function AdminDashboardPage() {
  const isUserAdmin = await isAdmin()

  if (!isUserAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  const adminClient = createServiceRoleClient()

  // 1. Fetch all users from Supabase Auth (Auth list)
  const { data: { users: authUsers }, error: authError } = await adminClient.auth.admin.listUsers()

  if (authError) {
    console.error('Failed to fetch auth users:', authError.message)
    return <div>Failed to load users</div>
  }

  // 2. Fetch all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')

  // 3. Merge data: Profiles + Auth users
  const joinedUsers = authUsers.map(authUser => {
    const profile = profiles?.find(p => p.id === authUser.id)
    return {
      id: authUser.id,
      email: authUser.email || '',
      last_sign_in: authUser.last_sign_in_at || null,
      created_at: authUser.created_at,
      full_name: profile?.full_name || null,
      username: profile?.username || null,
      role: profile?.role || 'user',
      avatar_url: profile?.avatar_url || null
    }
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return <AdminDashboardUI initialUsers={joinedUsers} totalUserCount={authUsers.length} />
}
