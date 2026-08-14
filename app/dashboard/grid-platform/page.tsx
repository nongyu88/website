"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Zap, ShieldAlert, Activity, 
  CloudRain, ArrowUpRight, Lock, Unlock, 
  CheckCircle2, ArrowRight, X, PhoneCall, Network,
  Bot
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function GridPlatformPage() {
  const [user, setUser] = useState<any>(null)
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false)
  const [consultSubmitted, setConsultSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Consult Form State
  const [networkSize, setNetworkSize] = useState("Under 50 Substations")
  const [focusArea, setFocusArea] = useState("Predictive Cascade Failure")
  const [scadaIntegration, setScadaIntegration] = useState("Yes, we have live SCADA")

  const isEvaluationModalOpen = isConsultModalOpen
  const setIsEvaluationModalOpen = setIsConsultModalOpen

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  // Close evaluation modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Change this state variable to match whatever you named it in those files!
        setIsEvaluationModalOpen(false) 
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 1. Check Active Plans
  const activePlansRaw = user?.organization?.activePlans || user?.activePlans || "[]";
  let activePlansArr: any[] = [];
  try {
    activePlansArr = typeof activePlansRaw === 'string' ? JSON.parse(activePlansRaw) : activePlansRaw;
  } catch (e) {}

  const hasGridPlan = activePlansArr.some((p: any) => p.name === "Utility Grid Twin" || p === "Utility Grid Twin");
  const isGeneralActive = user?.subscriptionStatus === 'active' || user?.organization?.subscriptionStatus === 'active' || (user?.organization?.planName && user?.organization?.planName !== 'Free');
  
  const isGridSubscribed = hasGridPlan ||  isGeneralActive;

  // 2. JWT Token Logic for Copilot Engine Launch
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
    if (isSubmitting) return
    setIsSubmitting(true)

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
      }, 2500)
    } catch (error) {
      console.error("Consultation Submission Error:", error)
    } finally {
      setIsSubmitting(false)
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

        <Button 
          onClick={() => setIsConsultModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-md shadow-emerald-900/20"
        >
          <PhoneCall className="w-4 h-4 mr-2" /> Discuss Grid Requirements
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-slate-900/40 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden shadow-xl transition-colors">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Core Platform
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Predict and Prevent Grid Failures Before They Happen
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Simulate real-time grid topology, inject high-stress weather variables, and let our Graph Neural Network (GNN) instantly identify cascade failure vulnerabilities across your entire transmission network.
            </p>
            <Button 
              onClick={() => setIsConsultModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-11 px-6 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
            >
              Discuss Your Grid Requirements <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Platform Pillars */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" /> Platform Pillars
              </h2>
              <p className="text-xs text-slate-500">Real-time simulation modules tailored for transmission and distribution operators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/20">
                <Network className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Interactive Topology Engine</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Dynamically manipulate node connections, isolate substation transformers, and simulate live load flow drops across high-voltage transmission lines.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/20">
                <ShieldAlert className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">GNN Cascade Failure Prediction</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Proprietary Graph Neural Networks continuously compute N-k contingency matrices to anticipate systemic blackout risks before they occur.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/20">
                <CloudRain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Weather & Thermal Stress Fusion</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Inject live NOAA radar data, ambient heat stress vectors, and wind dynamics directly into physical power flow calculations.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/20">
                <Bot className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Autonomous Copilot Mitigation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  AI-driven mitigation agent providing real-time operator recommendations for automated load-shedding and rerouting during emergencies.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Engagement Process */}
        <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Engagement Process</h2>
          <p className="text-xs text-slate-500 mb-8">How we onboard your utility grid network into Kraftgene AI</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-emerald-500/30 mb-2 block">01</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Topology Audit</h4>
              <p className="text-xs text-slate-500">Import substation single-line diagrams (SLD) and transmission node matrices.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-emerald-500/30 mb-2 block">02</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">SCADA Data Binding</h4>
              <p className="text-xs text-slate-500">Connect live telemetry streams via secure IEEE 1815 (DNP3) or IEC 61850 protocols.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-emerald-500/30 mb-2 block">03</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">GNN Calibration</h4>
              <p className="text-xs text-slate-500">Train predictive GNN models against your historical fault logs and seasonal peak loads.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-emerald-500/30 mb-2 block">04</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Copilot Launch</h4>
              <p className="text-xs text-slate-500">Authorize control room operator access with secure JWT token authentication.</p>
            </div>
          </div>
        </section>

        {/* Subscription / Unlocked Engine Section */}
        {isGridSubscribed ? (
          <section className="bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 mt-12 relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Unlock className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" /> Utility Grid Platform Active
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-2xl">
              Your subscription is active and verified. Click below to launch the live EnergyEminence™ Grid Copilot simulation engine.
            </p>
            
            <Button 
              onClick={handleLaunchGrid}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-emerald-900/40 text-sm"
            >
              Launch Grid (Transmission) Platform <ArrowUpRight className="w-4 h-4 ml-2" />
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
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 h-11">View Enterprise Plans</Button>
            </Link>
          </section>
        )}

      </main>

      {/* Modal: Consultation */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setIsConsultModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Request Grid Platform Evaluation</h3>
            <p className="text-xs text-slate-500 mb-6">Our power grid engineering team will contact you within 24 hours to schedule a technical demonstration.</p>

            {consultSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-500 p-8 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Evaluation Request Received</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">An engineer will contact <span className="font-semibold text-emerald-500">{user?.email}</span> to schedule a discovery call.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <fieldset disabled={isSubmitting} className="space-y-4 disabled:opacity-50 transition-opacity">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Network Scale</label>
                    <select value={networkSize} onChange={(e) => setNetworkSize(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:cursor-not-allowed">
                      <option>Under 50 Substations</option>
                      <option>50 - 200 Substations</option>
                      <option>200+ Enterprise Grid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary Focus Area</label>
                    <select value={focusArea} onChange={(e) => setFocusArea(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:cursor-not-allowed">
                      <option>Predictive Cascade Failure</option>
                      <option>Weather & Load Stress Testing</option>
                      <option>SCADA Anomaly Detection</option>
                    </select>
                  </div>
                </fieldset>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setIsConsultModalOpen(false)} className="border-slate-200 dark:border-white/10 text-xs disabled:opacity-50">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {isSubmitting ? (
                      <span className="flex items-center"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Submitting...</span>
                    ) : "Submit Request"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}