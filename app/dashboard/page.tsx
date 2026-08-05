"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, Zap, Droplet, ArrowUpRight, Settings,
  LogOut, Activity, Lock, Building2, User,
  Sun, Moon, AlertTriangle, ServerCrash
} from "lucide-react"
import OnboardingWizard from "@/components/OnboardingWizard"
// import SubscriptionPlans from "@/components/SubscriptionPlans" // <-- ADD THIS
import { useTheme } from "next-themes";
import { Cpu, Briefcase, Database, ArrowRight} from "lucide-react";

interface UserData {
  id: string
  email: string
  company?: string
  hasCompletedOnboarding?: boolean
  industry?: string // 'grid' | 'pipeline' | 'both'
  planTier?: string             // <-- ADD THIS
  subscriptionStatus?: string   // <-- ADD THIS

  organization?: {
    planName?: string
    subscriptionStatus?: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const fetchFreshData = async () => {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        window.location.href = "/login"
        return
      }

      try {
        const parsedUser = JSON.parse(storedUser)
        // Fetch fresh data from DB to get the latest industry & subscription status
        const res = await fetch(`/api/user/profile?email=${parsedUser.email}&t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        
        if (data.user) {
          const updatedUser = {
            ...parsedUser,
            ...data.user,
            hasCompletedOnboarding: data.user.hasCompletedOnboarding ?? parsedUser.hasCompletedOnboarding ?? true
          }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        } else {
          setUser(parsedUser)
        }
      } catch {
        // Fallback to local storage if fetch fails
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } finally {
        setLoading(false)
      }
    }

    fetchFreshData()
  }, [])

// Check both the root user object and the organization object for active status
const isSubscribed = 
user?.subscriptionStatus === 'active' || 
user?.organization?.subscriptionStatus === 'active' || 
(user?.organization?.planName && user?.organization?.planName !== 'Free');

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

  // GATE: Only show wizard if explicitly set to false
  if (user && user.hasCompletedOnboarding === false) {
    return <OnboardingWizard />
  }

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
              {theme === "dark" ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* --- NEW: Settings Link --- */}
            <Link href="/dashboard/settings" className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <Settings className="w-4 h-4" />
            </Link>

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
              Your dashboard is tailored to your primary focus:&nbsp;
              <Link 
                href="/dashboard/settings/business" 
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 underline decoration-emerald-500/30 underline-offset-4 transition-all"
              >
                {user?.industry === 'both' ? 'ENTERPRISE CONVERGENCE' : (user?.industry?.toUpperCase() || "PIPELINE")}
              </Link>.
            </p>
          </div>
        </div>

        <div className="mb-12">
  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Available Enterprise Services</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    {/* Digital Twins Services */}
    <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-colors">
      <div className="absolute top-4 right-4 bg-slate-100 dark:bg-white/5 p-2 rounded-full">
        <Lock className="w-4 h-4 text-slate-400" />
      </div>
      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
        <Cpu className="w-6 h-6 text-blue-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Digital Twins Services</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
        Advanced physical asset modeling and custom environmental integration for your specific infrastructure.
      </p>
      <Link href="/dashboard/settings/plans" className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center group-hover:text-blue-500 transition-colors">
        Upgrade to Pro <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </div>

    {/* Professional Services */}
    <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
      <div className="absolute top-4 right-4 bg-slate-100 dark:bg-white/5 p-2 rounded-full">
        <Lock className="w-4 h-4 text-slate-400" />
      </div>
      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
        <Briefcase className="w-6 h-6 text-purple-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Professional Services</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
        Dedicated client training, seamless system API integration, and full digital transformation consulting.
      </p>
      <Link href="/dashboard/settings/plans" className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center group-hover:text-purple-500 transition-colors">
        View Enterprise Plans <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </div>

    {/* Data Services */}
    <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-amber-500/50 transition-colors">
      <div className="absolute top-4 right-4 bg-slate-100 dark:bg-white/5 p-2 rounded-full">
        <Lock className="w-4 h-4 text-slate-400" />
      </div>
      <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
        <Database className="w-6 h-6 text-amber-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Data Services</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
        Real-time robotic data acquisition, live UAV drone feeds, and continuous asset health telemetry.
      </p>
      <button onClick={() => alert("Contact Sales Triggered")} className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center group-hover:text-amber-500 transition-colors text-left">
        Contact Sales <ArrowRight className="w-4 h-4 ml-1" />
      </button>
    </div>

  </div>
        </div>

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
                  <Badge className={`text-[10px] uppercase font-bold border transition-colors ${
                    isSubscribed 
                      ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/70 border-emerald-300 dark:border-emerald-700/50" 
                      : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-sm"
                  }`}>
                    {isSubscribed ? "Active | Enterprise" : "Locked"}
                  </Badge>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  EnergyEminence™ - G
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Power Grid Digital Twin MVP. Real-time topology simulation, GNN cascade failure prediction, weather fusion, and autonomous Copilot mitigation.
                </p>
              </div>

              {isSubscribed ? (
                <Button 
                  onClick={handleLaunchGrid}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-emerald-900/30"
                >
                  Launch Grid Platform <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Link href="/dashboard/settings/plans" className="w-full block">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 rounded-xl transition-all flex justify-center items-center">
                    <Lock className="w-4 h-4 mr-2" /> Upgrade to Launch
                  </Button>
                </Link>
              )}
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
                  <Badge className={`text-[10px] uppercase font-bold border transition-colors ${
                    isSubscribed 
                      ? "bg-blue-100 text-blue-900 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70 border-blue-300 dark:border-blue-700/50" 
                      : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-sm"
                  }`}>
                    {isSubscribed ? "Active | Enterprise" : "Locked"}
                  </Badge>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  EnergyEminence™ - P
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Oil & Gas Pipeline Digital Twin MVP. Interactive fluid dynamics, pressure telemetry monitoring, UAV multi-stream ingestion, and thermal fire isolation.
                </p>
              </div>

              {isSubscribed ? (
                <Button 
                  onClick={handleLaunchPipeline}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-blue-900/30"
                >
                  Launch Pipeline Platform <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Link href="/dashboard/settings/plans" className="w-full block">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 rounded-xl transition-all flex justify-center items-center">
                    <Lock className="w-4 h-4 mr-2" /> Upgrade to Launch
                  </Button>
                </Link>
              )}
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
      </main>

    </div>
  )
}