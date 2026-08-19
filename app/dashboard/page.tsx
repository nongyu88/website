"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, Zap, Droplet, ArrowUpRight, Settings,
  LogOut, Activity, Lock, Building2, User,
  Sun, Moon, AlertTriangle, ServerCrash, Bell, Check
} from "lucide-react"
import { getNotifications, markNotificationsAsRead, AppNotification, clearNotifications } from "@/lib/notifications"
import OnboardingWizard from "@/components/OnboardingWizard"
// import SubscriptionPlans from "@/components/SubscriptionPlans" // <-- ADD THIS
import { useTheme } from "next-themes";
import { Cpu, Briefcase, Database, ArrowRight} from "lucide-react";

interface UserData {
  id: string
  email: string
  company?: string
  lastLoginAt?: string | Date // <-- Added for security timestamp tracking
  hasCompletedOnboarding?: boolean
  industry?: string // 'grid' | 'pipeline' | 'both'
  planTier?: string
  subscriptionStatus?: string
  activePlans?: string // <-- Added to fix TypeScript error
  token?: string

  organization?: {
    planName?: string
    subscriptionStatus?: string
    activePlans?: string // <-- Added to fix TypeScript error
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // --- DYNAMIC NOTIFICATION STATE ---
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const { theme, setTheme } = useTheme();

  // Close notifications popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications])

  useEffect(() => {
    if (user?.email) {
      // Load real notifications from localStorage
      const userNotifs = getNotifications(user.email)
      setNotifications(userNotifs)
    }
  }, [user?.email])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleOpenNotifications = () => {
    const nextState = !showNotifications
    setShowNotifications(nextState)
    if (user?.email && nextState) {
      markNotificationsAsRead(user.email)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

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
          // Grab token from API response, fallback to parsed user, or existing local storage
          const sessionToken = data.token || data.user.token || parsedUser.token || localStorage.getItem("kraftgene_token") || "";

          const updatedUser = {
            ...parsedUser,
            ...data.user,
            token: sessionToken, // Sync to user state
            hasCompletedOnboarding: data.user.hasCompletedOnboarding ?? parsedUser.hasCompletedOnboarding ?? true
          }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))

          if (sessionToken) {
            localStorage.setItem("kraftgene_token", sessionToken)
          }
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

  // Parse active plans array first
  const activePlansRaw = user?.organization?.activePlans || user?.activePlans || "[]";
  let activePlansArr: any[] = [];
  try {
    activePlansArr = typeof activePlansRaw === 'string' ? JSON.parse(activePlansRaw) : activePlansRaw;
  } catch (e) {}

  // Check Add-on Services
  const hasDigitalTwins = activePlansArr.some((p: any) => p.name === "Digital Twins Services" || p === "Digital Twins Services");
  const hasProfessional = activePlansArr.some((p: any) => p.name === "Professional Services" || p === "Professional Services");
  const hasData = activePlansArr.some((p: any) => p.name === "Data Services" || p === "Data Services");

  // Check Core Platform Subscriptions directly inside activePlans array
  const hasGridPlan = activePlansArr.some((p: any) => p.name === "Utility Grid Twin" || p === "Utility Grid Twin");
  const hasDistributionPlan = activePlansArr.some((p: any) => p.name === "Grid Distribution Twin" || p === "Grid Distribution Twin");
  const hasPipelinePlan = activePlansArr.some((p: any) => p.name === "Pipeline Twin" || p === "Pipeline Twin");

  // General active status check fallback
  const isGeneralActive = 
    user?.subscriptionStatus === 'active' || 
    user?.organization?.subscriptionStatus === 'active' || 
    (user?.organization?.planName && user?.organization?.planName !== 'Free');

  // Specific unlock permissions for Grid platforms
  const isGridSubscribed = hasGridPlan ||  isGeneralActive;
  const isDistributionSubscribed = hasDistributionPlan ||  isGeneralActive;
  const isPipelineSubscribed = hasPipelinePlan ||  isGeneralActive;

  const handleLogout = () => {
      localStorage.removeItem("user")
      localStorage.removeItem("kraftgene_token")
      window.location.href = "/login"
    }

  const getIndustryLabel = (ind?: string) => {
    if (ind === 'grid_distribution') return 'GRID - DISTRIBUTION'
    if (ind === 'grid') return 'GRID - TRANSMISSION'
    if (ind === 'pipeline') return 'PIPELINE'
    return ind ? ind.toUpperCase() : 'GRID - TRANSMISSION'
  }

    // (Static array removed in favor of dynamic localStorage state)

  // Helper to guarantee we find the token
  const getRobustToken = () => {
    let token = localStorage.getItem("kraftgene_token");
    if (token) return token;

    if (user?.token) return user.token;

    // Fallback: Check if it was stored as a cookie during login
    const cookieMatch = document.cookie.match(new RegExp('(^| )kraftgene_token=([^;]+)'));
    if (cookieMatch) return cookieMatch[2];

    return "";
  };

  const handleLaunchGrid = () => {
    const token = getRobustToken();
    if (!token) {
      alert("Authentication token missing. Please sign out and log back in to generate a secure session.");
      return;
    }
    window.open(`https://www.energyeminence.online/?auth_token=${encodeURIComponent(token)}`, '_blank')
  }

  const handleLaunchPipeline = () => {
    const token = getRobustToken();
    if (!token) {
      alert("Authentication token missing. Please sign out and log back in to generate a secure session.");
      return;
    }
    
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

            {/* --- Settings Link --- */}
            <Link href="/dashboard/settings" className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <Settings className="w-4 h-4" />
            </Link>

            {/* ── DYNAMIC NOTIFICATION ICON & DROPDOWN ── */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleOpenNotifications}
                className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-black animate-pulse" />
                )}
              </button>

              {/* Notification Popover Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50 transition-all text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-3">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Customer Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => {
                          if (user?.email) {
                            clearNotifications(user.email)
                            setNotifications([])
                          }
                        }}
                        className="text-[11px] font-semibold text-red-500 hover:text-red-400 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 italic">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-start space-x-2.5">
                          <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900 dark:text-white">{n.title}</span>
                              <span className="text-[10px] text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 mt-3 text-center">
                    <Link href="/dashboard/settings/communications" onClick={() => setShowNotifications(false)} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                      Manage Notification Preferences →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* --- Industry Standard Security Audit: Last Active Timestamp --- */}
            <div className="hidden xl:flex flex-col text-right mr-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                {user?.lastLoginAt ? (
                  <>Last Active: <span className="text-slate-700 dark:text-slate-300 font-semibold">{new Date(user.lastLoginAt).toLocaleString()}</span></>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Initial Session Active</span>
                )}
              </span>
            </div>

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
                {getIndustryLabel(user?.industry)}
              </Link>.
            </p>
          </div>
        </div>

        <div className="mb-12">
  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Available Enterprise Services</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    {/* Digital Twins Services */}
    <div className={`bg-white dark:bg-[#111113] border rounded-2xl p-6 flex flex-col relative overflow-hidden group transition-colors ${hasDigitalTwins ? 'border-blue-500/50 dark:border-blue-500/30' : 'border-slate-200 dark:border-white/10 hover:border-blue-500/50'}`}>
      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
        <Cpu className="w-6 h-6 text-blue-500" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Digital Twins Services</h3>
        {hasDigitalTwins && <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">ACTIVE</Badge>}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
        Advanced physical asset modeling and custom environmental integration for your specific infrastructure.
      </p>
      <Link href="/dashboard/digital-twins" className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center group-hover:text-blue-500 transition-colors">
        {hasDigitalTwins ? "Launch Digital Twins" : "Explore Digital Twins"} <ArrowUpRight className="w-4 h-4 ml-1" />
      </Link>
    </div>

    {/* Professional Services */}
    <div className={`bg-white dark:bg-[#111113] border rounded-2xl p-6 flex flex-col relative overflow-hidden group transition-colors ${hasProfessional ? 'border-purple-500/50 dark:border-purple-500/30' : 'border-slate-200 dark:border-white/10 hover:border-purple-500/50'}`}>
      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
        <Briefcase className="w-6 h-6 text-purple-500" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Professional Services</h3>
        {hasProfessional && <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]">ACTIVE</Badge>}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
        Dedicated client training, seamless system API integration, and full digital transformation consulting.
      </p>
      <Link href="/dashboard/professional-services" className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center group-hover:text-purple-500 transition-colors">
        {hasProfessional ? "Access Pro Services" : "Explore Pro Services"} <ArrowUpRight className="w-4 h-4 ml-1" />
      </Link>
    </div>

    {/* Data Services */}
    <div className={`bg-white dark:bg-[#111113] border rounded-2xl p-6 flex flex-col relative overflow-hidden group transition-colors ${hasData ? 'border-amber-500/50 dark:border-amber-500/30' : 'border-slate-200 dark:border-white/10 hover:border-amber-500/50'}`}>
      <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
        <Database className="w-6 h-6 text-amber-500" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Data Services</h3>
        {hasData && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">ACTIVE</Badge>}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
        Real-time robotic data acquisition, live UAV drone feeds, and continuous asset health telemetry.
      </p>
      <Link href="/dashboard/data-services" className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center group-hover:text-amber-500 transition-colors">
        {hasData ? "Open Data Console" : "Explore Data Services"} <ArrowUpRight className="w-4 h-4 ml-1" />
      </Link>
    </div>

  </div>
        </div>

        {/* Dynamic Platform Launchers based on User Industry Preference */}
        <div className={`grid grid-cols-1 ${user?.industry === 'both' ? 'md:grid-cols-2 lg:grid-cols-3' : 'max-w-xl mx-auto'} gap-8 mb-12`}>
          
          {/* Card 1: Power Grid (Transmission) MVP */}
          {(!user?.industry || user.industry === 'grid' || user.industry === 'both') && (
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <Zap className="w-6 h-6 text-emerald-500" />
                  </div>
                  <Badge className={`text-[10px] uppercase font-bold border transition-colors ${
                    isGridSubscribed 
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10"
                  }`}>
                    {isGridSubscribed ? "Active | Enterprise" : "Preview Mode"}
                  </Badge>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  EnergyEminence™ - G
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Power Grid Digital Twin MVP. Real-time topology simulation, GNN cascade failure prediction, weather fusion, and autonomous Copilot mitigation.
                </p>
              </div>

              <Link href="/dashboard/grid-platform" className="w-full">
                <Button className="w-full bg-slate-900 dark:bg-white/10 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-bold h-11 rounded-xl transition-all flex justify-center items-center text-xs">
                  Explore Grid Platform <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {/* Card 2: Power Grid (Distribution) MVP */}
          {(user?.industry === 'grid_distribution' || user?.industry === 'both') && (
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                    <Zap className="w-6 h-6 text-amber-500" />
                  </div>
                  <Badge className={`text-[10px] uppercase font-bold border transition-colors ${
                    isDistributionSubscribed 
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10"
                  }`}>
                    {isDistributionSubscribed ? "Active | Enterprise" : "Preview Mode"}
                  </Badge>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  EnergyEminence™ - Grid (Distribution)
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  118-Bus feeder simulation, live PV/Solar DER tracking, EV charging load modeling, battery state-of-charge tracking, and autonomous voltage tap optimization.
                </p>
              </div>

              <Link href="/dashboard/grid-distribution-platform" className="w-full">
                <Button className="w-full bg-slate-900 dark:bg-white/10 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-slate-950 text-white font-bold h-11 rounded-xl transition-all flex justify-center items-center text-xs">
                  Explore Grid Distribution Platform <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {/* Card 2: Oil & Gas Pipeline MVP */}
          {(!user?.industry || user.industry === 'pipeline' || user.industry === 'both') && (
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <Droplet className="w-6 h-6 text-blue-500" />
                  </div>
                  <Badge className={`text-[10px] uppercase font-bold border transition-colors ${
                    isPipelineSubscribed 
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10"
                  }`}>
                    {isPipelineSubscribed ? "Active | Enterprise" : "Preview Mode"}
                  </Badge>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  EnergyEminence™ - P
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Oil & Gas Pipeline Digital Twin MVP. Interactive fluid dynamics, pressure telemetry monitoring, UAV multi-stream ingestion, and thermal fire isolation.
                </p>
              </div>

              <Link href="/dashboard/pipeline-platform" className="w-full">
                <Button className="w-full bg-slate-900 dark:bg-white/10 hover:bg-blue-600 dark:hover:bg-blue-600 text-white font-bold h-11 rounded-xl transition-all flex justify-center items-center text-xs">
                  Explore Pipeline Platform <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
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