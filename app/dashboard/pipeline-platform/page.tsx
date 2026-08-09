"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Droplet, Flame, Waves, 
  Activity, ArrowUpRight, Lock, Unlock, 
  CheckCircle2, ArrowRight, X, PhoneCall, Thermometer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PipelinePlatformPage() {
  const [user, setUser] = useState<any>(null)
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false)
  const [consultSubmitted, setConsultSubmitted] = useState(false)

  // Consult Form State
  const [pipelineLength, setPipelineLength] = useState("Under 100 km")
  const [fluidType, setFluidType] = useState("Crude Oil / Liquid")
  const [sensorStatus, setSensorStatus] = useState("Existing Pressure/Flow Sensors")

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

  const hasPipelinePlan = activePlansArr.some((p: any) => p.name === "Pipeline Twin" || p === "Pipeline Twin");
  const hasEnterprisePlan = activePlansArr.some((p: any) => p.name === "Enterprise Convergence" || p === "Enterprise Convergence");
  const isGeneralActive = user?.subscriptionStatus === 'active' || user?.organization?.subscriptionStatus === 'active' || (user?.organization?.planName && user?.organization?.planName !== 'Free');
  
  const isPipelineSubscribed = hasPipelinePlan || hasEnterprisePlan || isGeneralActive;

  // 2. Auth Token Retrieval for Live Engine
  const getRobustToken = () => {
    let token = localStorage.getItem("kraftgene_token");
    if (token) return token;
    if (user?.token) return user.token;
    const cookieMatch = document.cookie.match(new RegExp('(^| )kraftgene_token=([^;]+)'));
    if (cookieMatch) return cookieMatch[2];
    return "";
  };

  const handleLaunchPipeline = () => {
    const token = getRobustToken();
    if (!token) {
      alert("Authentication token missing. Please sign out and log back in to generate a secure session.");
      return;
    }
    window.open(`https://www.energyeminence.xyz/?auth_token=${encodeURIComponent(token)}`, '_blank')
  }

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'Pipeline Platform Evaluation',
          userEmail: user?.email,
          details: { "Pipeline Length": pipelineLength, "Fluid Type": fluidType, "Sensor Status": sensorStatus }
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
              <Droplet className="w-5 h-5 text-blue-500" /> EnergyEminence™ - P
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Oil & Gas Pipeline Twin & Multi-Phase Fluid Simulation</p>
          </div>
        </div>
        
        {!isPipelineSubscribed && (
          <Button onClick={() => setIsConsultModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-md shadow-blue-900/20">
            <PhoneCall className="w-4 h-4 mr-2" /> Talk to an Engineer
          </Button>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Adaptive Contrast Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-white dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-slate-900/40 border border-blue-200 dark:border-blue-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl transition-colors">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-3 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Core Platform
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Monitor, Simulate, and Secure Critical Pipeline Assets
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-8">
              Gain unparalleled visibility into your midstream infrastructure. Run interactive fluid dynamics, monitor real-time pressure telemetry, and isolate thermal anomalies using integrated UAV data feeds.
            </p>
            
            {isPipelineSubscribed ? (
              <Button onClick={handleLaunchPipeline} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-900/40">
                Launch Live Engine <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard/settings/plans#pipeline">
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
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <Waves className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Fluid Dynamics Sim</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visualize multi-phase flow characteristics and anticipate friction-induced pressure drops across complex topographies.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Pressure Telemetry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bind live SCADA sensor feeds directly to 3D pipeline nodes to instantly flag leaks or compressor station failures.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Thermal Fire Isolation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ingest UAV thermal scans to map flare stack intensity, vegetation encroachment, and automate emergency valve isolation.
            </p>
          </div>
        </section>

        {/* Subscription Status & Progress Section */}
        {isPipelineSubscribed ? (
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
            <Button onClick={handleLaunchPipeline} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-blue-900/40">
              Open EnergyEminence - P <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </section>
        ) : (
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 text-center mt-12 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500/20 p-2 rounded-full">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Launch the Pipeline Platform?</h2>
            <p className="text-sm text-slate-300 mb-6 max-w-xl mx-auto">Purchase a core platform subscription to securely authenticate and launch the interactive simulation engine.</p>
            <Link href="/dashboard/settings/plans#pipeline">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-8 rounded-xl shadow-lg">
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
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Network Scale</label>
                  <select value={pipelineLength} onChange={(e) => setPipelineLength(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm">
                    <option>Under 100 km</option>
                    <option>100 - 500 km</option>
                    <option>500+ km Interstate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Transport Fluid Type</label>
                  <select value={fluidType} onChange={(e) => setFluidType(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm">
                    <option>Crude Oil / Liquid</option>
                    <option>Natural Gas</option>
                    <option>Multi-Phase Mix</option>
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsConsultModalOpen(false)} className="mr-3 text-xs border-slate-200 dark:border-white/10">Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6">Submit Request</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}