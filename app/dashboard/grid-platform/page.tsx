"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Zap, ShieldAlert, Activity, 
  CloudRain, ArrowUpRight, Lock, Unlock, 
  CheckCircle2, ArrowRight, X, PhoneCall, Network
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function GridPlatformPage() {
  const [user, setUser] = useState<any>(null)
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false)
  const [consultSubmitted, setConsultSubmitted] = useState(false)

  // Consult Form State
  const [networkSize, setNetworkSize] = useState("Under 50 Substations")
  const [focusArea, setFocusArea] = useState("Predictive Cascade Failure")
  const [scadaIntegration, setScadaIntegration] = useState("Yes, we have live SCADA")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  // 1. Subscription Checking Logic
  const activePlansRaw = user?.organization?.activePlans || user?.activePlans || "[]";
  let activePlansArr: any[] = [];
  try {
    activePlansArr = typeof activePlansRaw === 'string' ? JSON.parse(activePlansRaw) : activePlansRaw;
  } catch (e) {}

  const hasGridPlan = activePlansArr.some((p: any) => p.name === "Utility Grid Twin" || p === "Utility Grid Twin");
  const hasEnterprisePlan = activePlansArr.some((p: any) => p.name === "Enterprise Convergence" || p === "Enterprise Convergence");
  const isGeneralActive = user?.subscriptionStatus === 'active' || user?.organization?.subscriptionStatus === 'active' || (user?.organization?.planName && user?.organization?.planName !== 'Free');
  
  const isGridSubscribed = hasGridPlan || hasEnterprisePlan || isGeneralActive;

  // 2. Auth Token Retrieval for Live Engine
  const getRobustToken = () => {
    let token = localStorage.getItem("kraftgene_token");
    if (token) return token;
    if (user?.token) return user.token;
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

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'Grid Platform Evaluation',
          userEmail: user?.email,
          details: { "Network Size": networkSize, "Primary Focus": focusArea, "SCADA Readiness": scadaIntegration }
        })
      });

      setConsultSubmitted(true)
      setTimeout(() => {
        setIsConsultModalOpen(false)
        setConsultSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-200 font-sans pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] sticky top-0 z-40 px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" /> EnergyEminence™ - G
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Power Grid Digital Twin & Predictive Cascade Intelligence</p>
          </div>
        </div>
        
        {!isGridSubscribed && (
          <Button onClick={() => setIsConsultModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-md shadow-emerald-900/20">
            <PhoneCall className="w-4 h-4 mr-2" /> Talk to an Engineer
          </Button>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Adaptive Contrast Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-slate-900/40 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl transition-colors">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Core Platform
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Predict and Prevent Grid Failures Before They Happen
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-8">
              Simulate real-time grid topology, inject high-stress weather variables, and let our Graph Neural Network (GNN) instantly identify cascade failure vulnerabilities across your entire transmission network.
            </p>
            
            {isGridSubscribed ? (
              <Button onClick={handleLaunchGrid} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-emerald-900/40">
                Launch Live Engine <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard/settings/plans#grid">
                  <Button className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold h-12 px-8 rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200">
                    <Lock className="w-4 h-4 mr-2" /> Unlock Platform
                  </Button>
                </Link>
                <Button onClick={() => setIsConsultModalOpen(true)} variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl border-slate-300 dark:border-white/20 dark:text-white">
                  Request Trial / Demo
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Interactive Topology</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dynamically manipulate node connections, disable substations, and visualize live voltage drops across your digital replica.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">GNN Cascade Prediction</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Proprietary Graph Neural Networks instantly calculate the N-k contingency impact of isolated asset failures across the grid.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <CloudRain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Weather & Thermal Fusion</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Inject live NOAA weather feeds and thermal stress parameters directly into load flow equations to anticipate peak demand failures.
            </p>
          </div>
        </section>

        {/* Subscription Status & Progress Section */}
        {isGridSubscribed ? (
          <section className="bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 mt-12 relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Unlock className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" /> Platform Access Granted
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-2xl">
              Your enterprise subscription is active. Your encrypted session token is verified, and the live simulation engine is ready for operation.
            </p>
            <Button onClick={handleLaunchGrid} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-900/40">
              Open EnergyEminence - G <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </section>
        ) : (
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 text-center mt-12 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-500/20 p-2 rounded-full">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Launch the Grid Platform?</h2>
            <p className="text-sm text-slate-300 mb-6 max-w-xl mx-auto">Purchase a core platform subscription to securely authenticate and launch the interactive simulation engine.</p>
            <Link href="/dashboard/settings/plans#grid">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-8 rounded-xl shadow-lg">
                View Enterprise Plans <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </section>
        )}

      </main>

      {/* Consult Modal */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setIsConsultModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Request Platform Evaluation</h3>
            <p className="text-xs text-slate-500 mb-6">Our solutions architects will review your infrastructure parameters and arrange a guided technical demo.</p>

            {consultSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-500 p-8 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="font-bold">Request Received</h4>
                <p className="text-xs">An engineer will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Network Size</label>
                  <select value={networkSize} onChange={(e) => setNetworkSize(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm">
                    <option>Under 50 Substations</option>
                    <option>50 - 200 Substations</option>
                    <option>200+ Enterprise Grid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary Focus Area</label>
                  <select value={focusArea} onChange={(e) => setFocusArea(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm">
                    <option>Predictive Cascade Failure</option>
                    <option>Weather & Load Stress Testing</option>
                    <option>SCADA Anomaly Detection</option>
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsConsultModalOpen(false)} className="mr-3 text-xs border-slate-200 dark:border-white/10">Cancel</Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6">Submit Request</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}