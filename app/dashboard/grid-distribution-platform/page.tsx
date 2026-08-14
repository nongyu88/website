"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Zap, Sun, BatteryCharging, 
  Activity, ArrowUpRight, Lock, Unlock, 
  CheckCircle2, ArrowRight, X, PhoneCall, Network,
  Sliders, Cpu, ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function GridDistributionPlatformPage() {
  const [user, setUser] = useState<any>(null)
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false)
  const [consultSubmitted, setConsultSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Consult Form State
  const [feederScale, setFeederScale] = useState("118-Bus / Medium Voltage")
  const [focusArea, setFocusArea] = useState("Autonomous Voltage Tap Optimization")
  const [telemetryIntegration, setTelemetryIntegration] = useState("Live MQTT / Azure IoT Hub")

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          const res = await fetch(`/api/user/profile?email=${parsed.email}&t=${Date.now()}`, { cache: "no-store" })
          const data = await res.json()
          setUser(data.user || parsed)
        } catch (e) {
          setUser(JSON.parse(storedUser))
        }
      }
    }
    fetchProfile()
  }, [])

  // Close evaluation modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsConsultModalOpen(false) 
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 1. Check Active Plans for Distribution Platform (Strict Single-Plan Check)
  const activePlansRaw = user?.organization?.activePlans || user?.activePlans || "[]";
  let activePlansArr: any[] = [];
  try {
    activePlansArr = typeof activePlansRaw === 'string' ? JSON.parse(activePlansRaw) : activePlansRaw;
  } catch (e) {}

  // Strictly check ONLY for the Grid Distribution Twin plan
  const isDistributionSubscribed = activePlansArr.some(
    (p: any) => (typeof p === 'string' ? p : p.name) === "Grid Distribution Twin"
  );

  // 2. JWT Token Logic for Distribution Platform Launch
  const getRobustToken = () => {
    let token = localStorage.getItem("kraftgene_token");
    if (token) return token;
    if (user?.token) return user.token;
    const cookieMatch = document.cookie.match(new RegExp('(^| )kraftgene_token=([^;]+)'));
    if (cookieMatch) return cookieMatch[2];
    return "";
  };

  const handleLaunchDistribution = () => {
    const token = getRobustToken();
    if (!token) {
      alert("Authentication token missing. Please sign out and log back in to generate a secure session.");
      return;
    }
    window.open(`https://gdn.energyeminence.online/?auth_token=${encodeURIComponent(token)}`, '_blank')
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
          serviceType: 'Grid Distribution Platform Evaluation',
          userEmail: user?.email,
          details: { "Feeder Scale": feederScale, "Primary Focus": focusArea, "Telemetry Readiness": telemetryIntegration }
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
              <Zap className="w-5 h-5 text-amber-500" /> EnergyEminence™ - Grid (Distribution)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Low & Medium Voltage Feeder Intelligence & DER Management</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsConsultModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs h-10 px-4 rounded-xl shadow-md shadow-amber-900/20"
        >
          <PhoneCall className="w-4 h-4 mr-2 text-slate-950" /> Discuss Distribution Requirements
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-white dark:from-amber-950/30 dark:via-orange-950/20 dark:to-slate-900/40 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-8 relative overflow-hidden shadow-xl transition-colors">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-3 bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Distribution Engine
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              118-Bus Distribution Grid Digital Twin
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Real-time physics simulation and telemetry ingestion platform for low and medium voltage feeder lines. Supports live PV/Solar DER tracking, EV charging load modeling, battery state-of-charge tracking, and autonomous voltage tap optimization.
            </p>
            <Button 
              onClick={() => setIsConsultModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-11 px-6 rounded-xl transition-all shadow-lg shadow-amber-900/40"
            >
              Discuss Your Distribution Requirements <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Platform Pillars */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Distribution Pillars
              </h2>
              <p className="text-xs text-slate-500">Real-time simulation modules tailored for distribution network operators (DNOs) & microgrid managers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-500/20">
                <Network className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">3D React Digital Twin UI</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Interactive node topology visualization and voltage heatmaps across low and medium voltage distribution feeder lines.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-500/20">
                <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Live PV & Solar DER Tracking</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Real-time monitoring and forecasting of distributed energy resources (DERs), behind-the-meter PV generation, and reverse power flows.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-500/20">
                <BatteryCharging className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">EV Load & Battery SOC Modeling</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Simulate high-density EV charging infrastructure load profiles alongside energy storage system state-of-charge (SOC) dynamics.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-500/20">
                <Sliders className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Autonomous Voltage Tap Optimization</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Automated reactive power control and step voltage regulator tap switching to maintain stable voltage profiles across all feeder buses.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Engagement Process */}
        <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Engagement Process</h2>
          <p className="text-xs text-slate-500 mb-8">How we onboard your distribution feeder network into EnergyEminence™</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-amber-500/30 mb-2 block">01</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Feeder Mapping</h4>
              <p className="text-xs text-slate-500">Import GIS feeder layouts, step-down transformer parameters, and 118-Bus topology single-line diagrams.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-amber-500/30 mb-2 block">02</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">MQTT Telemetry Stream</h4>
              <p className="text-xs text-slate-500">Connect live smart meter and feeder sensor telemetry streams via Azure IoT Hub integration.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-amber-500/30 mb-2 block">03</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">DER & EV Calibration</h4>
              <p className="text-xs text-slate-500">Configure solar PV profiles, battery storage capacities, and EV charger peak demand thresholds.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-amber-500/30 mb-2 block">04</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Digital Twin Launch</h4>
              <p className="text-xs text-slate-500">Authorize operator access with secure JWT token authentication and launch live 3D feeder monitoring.</p>
            </div>
          </div>
        </section>

        {/* Subscription / Unlocked Engine Section */}
        {isDistributionSubscribed ? (
          <section className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-8 mt-12 relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 bg-amber-500/10 p-2 rounded-full border border-amber-500/20">
              <Unlock className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-amber-500 mr-2" /> Distribution Grid Platform Active
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-2xl">
              Your subscription is active and verified. Click below to launch the live EnergyEminence™ Grid Distribution simulation environment.
            </p>
            
            <Button 
              onClick={handleLaunchDistribution}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12 px-8 rounded-xl shadow-lg shadow-amber-950/40 text-sm flex items-center"
            >
              Launch Grid (Distribution) Environment <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </section>
        ) : (
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 text-center mt-12 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-500/20 p-2 rounded-full border border-amber-500/30">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Launch the Distribution Platform?</h2>
            <p className="text-sm text-slate-300 mb-6 max-w-xl mx-auto">
              Purchase a platform subscription to securely authenticate and launch the interactive 118-Bus distribution simulation engine.
            </p>
            <Link href="/dashboard/settings/plans#grid_distribution">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 h-11 rounded-xl shadow-lg">
                View Enterprise Plans
              </Button>
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

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Request Distribution Platform Evaluation</h3>
            <p className="text-xs text-slate-500 mb-6">Our distribution grid engineering team will contact you within 24 hours to schedule a technical demonstration.</p>

            {consultSubmitted ? (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 p-8 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Evaluation Request Received</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">An engineer will contact <span className="font-semibold text-amber-500">{user?.email}</span> to schedule a discovery call.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <fieldset disabled={isSubmitting} className="space-y-4 disabled:opacity-50 transition-opacity">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Feeder Scale</label>
                    <select value={feederScale} onChange={(e) => setFeederScale(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 disabled:cursor-not-allowed">
                      <option>118-Bus / Medium Voltage</option>
                      <option>50 - 200 Sub-feeders</option>
                      <option>200+ Enterprise Microgrid Network</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary Focus Area</label>
                    <select value={focusArea} onChange={(e) => setFocusArea(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 disabled:cursor-not-allowed">
                      <option>Autonomous Voltage Tap Optimization</option>
                      <option>Solar PV & DER Reverse Flow Management</option>
                      <option>EV Charging Load & Battery SOC Modeling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Telemetry Integration</label>
                    <select value={telemetryIntegration} onChange={(e) => setTelemetryIntegration(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 disabled:cursor-not-allowed">
                      <option>Live MQTT / Azure IoT Hub</option>
                      <option>Modbus / DNP3 Gateways</option>
                      <option>Simulated Feeder Data</option>
                    </select>
                  </div>
                </fieldset>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setIsConsultModalOpen(false)} className="border-slate-200 dark:border-white/10 text-xs disabled:opacity-50">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {isSubmitting ? (
                      <span className="flex items-center"><span className="animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full mr-2"></span> Submitting...</span>
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