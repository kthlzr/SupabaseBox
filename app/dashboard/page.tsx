import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">Manage your account and view your data</p>
          </div>
          <form action={handleSignOut}>
            <button className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
              Sign Out
            </button>
          </form>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-200">User Profile</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                  Email Address
                </p>
                <p className="text-white mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                  Account ID
                </p>
                <p className="text-white mt-1 font-mono text-xs">{user.id}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-200">Security</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Your account is protected with Supabase Row Level Security.
            </p>
            <Link href="/reset-password" className="text-white hover:underline text-sm font-medium">
              Update Password
            </Link>
          </div>
        </section>

        <section className="p-12 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to build?</h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8">
            This boilerplate is ready for your next big idea. Start adding your own Server Actions,
            API routes, and components.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="https://supabase.com/docs"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all"
            >
              Supabase Docs
            </Link>
            <Link
              href="https://nextjs.org/docs"
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold"
            >
              Next.js Docs
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
