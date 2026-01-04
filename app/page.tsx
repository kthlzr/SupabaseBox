import Link from 'next/link'
import { ArrowRight, Box, Shield, Zap, Database, CheckCircle2, ChevronRight, Fingerprint } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-zinc-500/[0.03] rounded-full blur-[120px] -z-10" />

      {/* Navigation */}
      <nav className="flex items-center justify-between p-8 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-white/10 transition-all duration-500 shadow-2xl">
            <Box className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tighter uppercase italic">SupabaseBox</span>
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.3em] leading-none">Complete Starter Kit</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all italic"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-[10px] font-black bg-white text-black px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] uppercase tracking-[0.2em]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-24 pb-32 relative z-10">
        {/* Hero Section */}
        <section className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            Ready to Build
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] italic uppercase">
              <span className="text-white block">Build</span>
              <span className="text-zinc-800 block">Faster.</span>
            </h1>

            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium tracking-tight">
              The ultimate toolkit for modern SaaS development. 
              <span className="text-zinc-300"> Secure, fast, and beautiful </span> 
              foundation for your next project.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link
              href="/signup"
              className="group w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-white text-black font-black text-base hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] uppercase tracking-widest"
            >
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://github.com"
              className="w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 text-zinc-400 font-black text-base hover:bg-white/[0.05] hover:text-white hover:border-white/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              Documentation
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Secure Login"
            description="Full authentication suite with social login, secure recovery, and member permissions."
            tag="Safety"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Real-time Ready"
            description="Database updates and presence tracking out of the box. Scale your app with confidence."
            tag="Speed"
          />
          <FeatureCard
            icon={<Fingerprint className="w-6 h-6" />}
            title="Clean Architecture"
            description="Zero-bloat design built for speed. Type-safe code and premium minimalist aesthetics."
            tag="Modern"
          />
        </section>
      </main>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  tag
}: {
  icon: React.ReactNode
  title: string
  description: string
  tag: string
}) {
  return (
    <div className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
        <div className="scale-[3]">{icon}</div>
      </div>
      
      <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] inline-block mb-8 group-hover:text-zinc-400 transition-colors">
        {tag}
      </div>

      <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-white/10 transition-all duration-500 shadow-xl text-zinc-500 group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm font-medium tracking-tight mb-8 group-hover:text-zinc-400 transition-colors">
        {description}
      </p>

      <div className="flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-200 transition-all">
        View Specs <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  )
}
