"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, Zap, Droplet, ArrowUpRight, 
  LogOut, Activity, Lock, Building2, User,
  Sun, Moon, AlertTriangle, ServerCrash
} from "lucide-react"
import OnboardingWizard from "@/components/OnboardingWizard"
import SubscriptionPlans from "@/components/SubscriptionPlans" // <-- ADD THIS

interface UserData {
  id: string
  email: string
  company?: string
  hasCompletedOnboarding?: boolean
  industry?: string // 'grid' | 'pipeline' | 'both'
  planTier?: string             // <-- ADD THIS
  subscriptionStatus?: string   // <-- ADD THIS
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])
  
  const toggleTheme = () => setIsDark(!isDark)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      window.location.href = "/login"
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    } catch {
      window.location.href = "/login"
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("kraftgene_token")
    window.location.href = "/login"
  }

  const handleLaunchGrid = () => {
    const token = localStorage.getItem("kraftgene_token") || ""
    window.open(`https://www.energyeminence.online/?auth_token=${encodeURIComponent(token)}`, '_blank')
  }

  const handleLaunchPipeline = () => {
    const token = localStorage.getItem("kraftgene_token") || ""
    
    window.open(`https://www.energyeminence.xyz/?auth_token=${encodeURIComponent(token)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-emerald-500 animate-ping"></div>
          <span>Authenticating Enterprise Session...</span>
        </div>
      </div>
    )
  }

// --- REPLACE YOUR EXISTING GATE WITH THIS ---
  // GATE: If user has not completed onboarding, show the wizard first!
  if (user && !user.hasCompletedOnboarding) {
    return <OnboardingWizard />
  }
  // --------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 selection:bg-emerald-500/30">
      
      {/* Top Portal Header */}
      <nav className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 relative rounded overflow-hidden">
              <Image src="/images/new_logo.PNG" alt="Kraftgene AI" width={36} height={36} className="object-cover" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white block leading-none">Kraftgene AI</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Enterprise Portal</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{user?.email}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 h-9 text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
            </Button>
          </div>

        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-100 via-slate-100 to-blue-100 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40 border border-slate-200 dark:border-white/10 rounded-3xl p-8 mb-12 relative overflow-hidden shadow-xl dark:shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 px-3 py-1 text-xs uppercase tracking-widest">
              Authorized Enterprise Environment
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome back{user?.company ? `, ${user.company}` : ""}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              Your dashboard is tailored to your primary focus: <span className="font-bold uppercase text-emerald-400">{user?.industry || 'General'}</span>.
            </p>
          </div>
        </div>

        {/* --- INSERT THIS NEW AI BRIEFING ROW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Copilot Intelligence Brief */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-32 h-32 text-blue-500" />
            </div>
            <div className="relative z-10">
              <Badge className="mb-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest text-[10px]">
                AI Copilot Briefing
              </Badge>
              <h2 className="text-2xl font-bold text-white mb-2">System Nominal. Monitoring Active.</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-4">
                Kraftgene AI Agent is actively ingesting telemetry for <span className="text-white font-semibold">{user?.company || 'your organization'}</span>. Network topology optimized for {user?.industry || 'enterprise'} infrastructure.
              </p>
              <div className="flex space-x-4 text-xs font-mono text-slate-500">
                <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" /> Auto-Mitigation Enabled</span>
                <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-blue-400" /> Live Threat Intel</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health Vitals */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Network Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Active Warnings</span>
                  <span className="font-bold text-white bg-amber-500/20 px-2 py-0.5 rounded text-xs border border-amber-500/30">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center"><ServerCrash className="w-4 h-4 mr-2 text-emerald-500" /> System Uptime</span>
                  <span className="font-bold text-slate-900 dark:text-white">99.99%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center"><Zap className="w-4 h-4 mr-2 text-blue-500" /> Ingestion Latency</span>
                  <span className="font-bold text-slate-900 dark:text-white">12ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --------------------------------------- */}

        {/* Dynamic Platform Launchers based on User Industry Preference */}
        <div className={`grid grid-cols-1 ${user?.industry === 'both' ? 'md:grid-cols-2' : 'max-w-xl mx-auto'} gap-8 mb-12`}>
          
          {/* Card 1: Power Grid MVP (Shown if industry is 'grid' or 'both') */}
          {(!user?.industry || user.industry === 'grid' || user.industry === 'both') && (
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-lg dark:shadow-xl group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
                    <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 text-[10px] uppercase font-bold">
                    Active | Enterprise
                  </Badge>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  EnergyEminence™ - G
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Power Grid Digital Twin MVP. Real-time topology simulation, GNN cascade failure prediction, weather fusion, and autonomous Copilot mitigation.
                </p>
              </div>

              <Button 
                onClick={handleLaunchGrid}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-emerald-900/30"
              >
                Launch Grid Platform <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Card 2: Oil & Gas Pipeline MVP (Shown if industry is 'pipeline' or 'both') */}
          {(!user?.industry || user.industry === 'pipeline' || user.industry === 'both') && (
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-lg dark:shadow-xl group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                    <Droplet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 text-[10px] uppercase font-bold">
                    Active | Enterprise
                  </Badge>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  EnergyEminence™ - P
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Oil & Gas Pipeline Digital Twin MVP. Interactive fluid dynamics, pressure telemetry monitoring, UAV multi-stream ingestion, and thermal fire isolation.
                </p>
              </div>

              <Button 
                onClick={handleLaunchPipeline}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-blue-900/30"
              >
                Launch Pipeline Platform <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

        </div>

        {/* Session Security Card */}
        <div className="bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-4">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Encrypted SSL Session | SSO Handshake Token Enabled</span>
          </div>
          <div>
            Need technical assistance? Contact <a href="mailto:customer@kraftgeneai.ca" className="text-emerald-600 dark:text-emerald-400 hover:underline">customer@kraftgeneai.ca</a>
          </div>
        </div>
{/* Only show the upgrade UI if their plan is 'none' or 'inactive' */}
{(!user?.planTier || user?.planTier === 'none' || user?.subscriptionStatus !== 'active') && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
             <SubscriptionPlans userEmail={user?.email} />
          </div>
        )}
      </main>

    </div>
  )
}