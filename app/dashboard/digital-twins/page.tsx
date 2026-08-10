"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Cpu, Layers, Box, Calendar, 
  ExternalLink, Sparkles, PhoneCall, 
  CheckCircle2, CloudRain, Radio, ArrowRight, X, Building,
  Lock, Unlock, Play
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DigitalTwinsHubPage() {
  const [user, setUser] = useState<any>(null)
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false)
  const [consultSubmitted, setConsultSubmitted] = useState(false)

  // Video Modal State
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null)
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>("")

  // Consultation Form State

  // Consultation Form State
  const [facilityName, setFacilityName] = useState("")
  const [industrySector, setIndustrySector] = useState("Power & Utilities")
  const [hasCadData, setHasCadData] = useState("Yes - BIM / Revit / CAD")
  const [projectTimeline, setProjectTimeline] = useState("Immediate (1-3 months)")
  

  useEffect(() => {
    const fetchFreshUser = async () => {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return

      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      try {
        const res = await fetch(`/api/user/profile?email=${encodeURIComponent(parsedUser.email)}&t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        if (data.user) {
          const updatedUser = { ...parsedUser, ...data.user }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      } catch (err) {
        console.error("Failed to fetch fresh user progress", err)
      }
    }

    fetchFreshUser()
  }, [])

  // Close all modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideoUrl(null)
        setIsConsultModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Parse subscription state

  // Parse subscription state
  const activePlansRaw = user?.organization?.activePlans || user?.activePlans || "[]";
  let activePlansArr: any[] = [];
  try {
    activePlansArr = typeof activePlansRaw === 'string' ? JSON.parse(activePlansRaw) : activePlansRaw;
  } catch (e) {}

  const hasDigitalTwins = activePlansArr.some((p: any) => p.name === "Digital Twins Services" || p === "Digital Twins Services");

// Showcase Demos (Proof of Capability)
  const capabilityDemos = [
    // --- GRID DEMOS ---
    {
      id: "demo-g1",
      name: "Autonomous Grid Copilot",
      sector: "Power Grid",
      tech: "AI Mitigation Matrix",
      description: "Transition from reactive alerts to autonomous action. The Grid Copilot instantly generates an executable mitigation matrix to isolate burning nodes, shed load, and halt cascading failures.",
      videoUrl: "/demo5-copilot.webm",
    },
    {
      id: "demo-g2",
      name: "Multi-Spectrum Thermal Vision",
      sector: "Power Grid",
      tech: "FLIR + Thermal Infrared",
      description: "Go beyond standard optical feeds with real-time FLIR and thermal infrared drone ingestion. The AI vision engine continuously scans for intense heat anomalies—detecting overheating transformers and invisible structural fires to trigger immediate Copilot isolation.",
      videoUrl: "/demo7-thermal.webm",
    },
    {
      id: "demo-g3",
      name: "Physics-Informed Prediction Engine",
      sector: "Power Grid",
      tech: "Physics-Informed ML + GNN",
      description: "Stay ahead of catastrophe. Our predictive AI engine utilizes physics-informed machine learning to forecast node failures and map cascading blackouts before physical infrastructure is actually compromised.",
      videoUrl: "/demo8-prediction.webm",
    },
    // --- PIPELINE DEMOS ---
    {
      id: "demo-p1",
      name: "Multi-Modal Topology & Telemetry",
      sector: "Oil & Gas Pipeline",
      tech: "3D Topology + Live SCADA",
      description: "Seamlessly transition between 2D geographic reality and 3D logical topologies. Inspect live SCADA telemetry, pressure, and flow dynamics across individual pipeline segments.",
      videoUrl: "/cap1.webm",
    },
    {
      id: "demo-p2",
      name: "Environmental Hazard Fusion",
      sector: "Oil & Gas Pipeline",
      tech: "Meteorological API + GIS",
      description: "Overlay live meteorological data directly onto the pipeline corridor. Monitor severe weather fronts, active flood zones, storm tracks, and tornado risks to defend vulnerable assets.",
      videoUrl: "/cap3.webm",
    },
    {
      id: "demo-p3",
      name: "Autonomous AI Copilot Isolation",
      sector: "Oil & Gas Pipeline",
      tech: "AI Copilot + Valve Automation",
      description: "Transition from manual monitoring to AI-assisted defense. The Pipeline Copilot instantly generates and executes an action plan to isolate compromised wildfire nodes and prevent systemic failure.",
      videoUrl: "/cap6.webm",
    }
  ]

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'Digital Twins Scoping',
          userEmail: user?.email,
          details: { 
            "Facility": facilityName, 
            "Industry": industrySector, 
            "CAD Status": hasCadData, 
            "Timeline": projectTimeline 
          }
        })
      });

      setConsultSubmitted(true)
      setTimeout(() => {
        setIsConsultModalOpen(false)
        setConsultSubmitted(false)
        setFacilityName("")
      }, 2500)
    } catch (error) {
      console.error("Consult submission error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-200 font-sans pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" /> Digital Twins Services
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Custom 3D spatial modeling, IoT telemetry binding, and environmental fusion</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsConsultModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-md shadow-blue-900/20"
        >
          <PhoneCall className="w-4 h-4 mr-2" /> Book Scoping Consultation
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Value Proposition Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-slate-900/40 border border-blue-200 dark:border-blue-500/30 rounded-3xl p-8 relative overflow-hidden shadow-xl transition-colors">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-3 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Tailored Enterprise Engineering
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Transform Your Physical Infrastructure Into an Intelligent Digital Twin
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Every facility is unique. We partner directly with utility operators, pipeline engineers, and asset managers to model, integrate, and deploy custom digital twins tailored to your exact operational requirements.
            </p>
            <Button 
              onClick={() => setIsConsultModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-11 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/40"
            >
              Start Your Digital Transformation <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Capability Showcase Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" /> Interactive Capability Benchmarks
              </h2>
              <p className="text-xs text-slate-500">Explore interactive demonstration models built for our enterprise infrastructure clients</p>
            </div>
            <Badge className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 text-xs w-fit">
              Reference Demos
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {capabilityDemos.map((demo) => (
              <div 
                key={demo.id}
                className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                      {demo.sector}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">3D DEMO</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-blue-500 transition-colors">
                    {demo.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {demo.description}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-100 dark:border-white/5 text-xs mb-6">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Integrated Tech:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">{demo.tech}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedVideoUrl(demo.videoUrl)
                    setSelectedVideoTitle(demo.name)
                  }}
                  className="w-full bg-slate-100 hover:bg-blue-600 dark:bg-white/5 dark:hover:bg-blue-600 text-slate-900 dark:text-white hover:text-white font-semibold h-10 rounded-xl text-xs transition-all border border-slate-200 dark:border-white/10 hover:border-blue-600"
                >
                  Watch Video Demo <Play className="w-3.5 h-3.5 ml-2 fill-current" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Solution Process Steps */}
        <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Our Digital Transformation Process</h2>
          <p className="text-xs text-slate-500 mb-8">How Kraftgene AI collaborates with your engineering team from initial assessment to live deployment</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-blue-500/30 mb-2 block">01</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Scoping & Discovery</h4>
              <p className="text-xs text-slate-500">Review your asset CAD/BIM files, GIS topologies, and existing sensor telemetry.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-blue-500/30 mb-2 block">02</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Spatial 3D Modeling</h4>
              <p className="text-xs text-slate-500">Construct high-fidelity 3D meshes using LiDAR, photogrammetry, or vector blueprints.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-blue-500/30 mb-2 block">03</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Telemetry & AI Binding</h4>
              <p className="text-xs text-slate-500">Connect SCADA/IoT data streams and activate predictive GNN anomaly models.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-blue-500/30 mb-2 block">04</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Deployment & Training</h4>
              <p className="text-xs text-slate-500">Deliver authorized portal access, ongoing model maintenance, and team training.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
            <Button 
              onClick={() => setIsConsultModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-11 px-8 rounded-xl shadow-md shadow-blue-900/20"
            >
              Discuss Your Facility Requirements
            </Button>
          </div>
        </section>

        {/* Subscription Status & Progress Section */}
        {hasDigitalTwins ? (
          <section className="bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 mt-12 relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Unlock className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" /> Digital Twins Module Active
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-2xl">
              Your enterprise subscription is successfully activated. Our spatial engineering team has been notified and is currently initiating the discovery phase for your infrastructure.
            </p>
            
            {/* Dynamic Deployment Progress Bar from Database */}
            {(() => {
              let parsedProgress: Record<string, any> = {}
              try {
                parsedProgress = typeof user?.serviceProgress === 'string' 
                  ? JSON.parse(user.serviceProgress) 
                  : (user?.serviceProgress || {})
              } catch (e) {}

              const twinServiceData = parsedProgress["Digital Twins"] || {}
              const liveProgress = twinServiceData.progress ?? 15
              const livePhase = twinServiceData.phaseName ?? "01 - Scoping & Discovery"

              return (
                <div className="max-w-2xl bg-slate-900/50 p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                    <span>Project Deployment Status</span>
                    <span className="text-emerald-400">{liveProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden border border-slate-700">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full relative overflow-hidden transition-all duration-700 ease-out" 
                      style={{ width: `${liveProgress}%` }}
                    >
                       <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full"></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-right font-mono mt-2">Current Phase: {livePhase}</p>
                </div>
              )
            })()}
          </section>
        ) : (
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 text-center mt-12 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500/20 p-2 rounded-full">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Initiate Your Digital Twin?</h2>
            <p className="text-sm text-slate-300 mb-6 max-w-xl mx-auto">Purchase the Enterprise module add-on to officially start your digital transformation project and assign an engineering team.</p>
            <Link href="/dashboard/settings/plans#digital-twins">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8">View Plans & Pricing</Button>
            </Link>
          </section>
        )}

      </main>

      {/* Modal: Schedule Scoping Consultation */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            
            <button 
              onClick={() => setIsConsultModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Request Custom Digital Twin Scoping
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-6">
              Connect directly with our security and spatial modeling engineers to discuss your facility's digital transformation roadmap.
            </p>

            {consultSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-8 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="font-bold text-lg text-white">Consultation Request Received</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you! Our engineering team will review your parameters and reach out to <span className="font-semibold text-blue-400">{user?.email}</span> within 1 business day to schedule your scoping call.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Facility / Asset Name or Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pacific Coast Compressor Substation"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Industry Sector</label>
                    <select 
                      value={industrySector}
                      onChange={(e) => setIndustrySector(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Power & Utilities">Power & Utilities</option>
                      <option value="Oil & Gas Pipeline">Oil & Gas Pipeline</option>
                      <option value="Renewable Infrastructure">Renewable Infrastructure</option>
                      <option value="Industrial Facility">Industrial Facility</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Current CAD/GIS Status</label>
                    <select 
                      value={hasCadData}
                      onChange={(e) => setHasCadData(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Yes - BIM / Revit / CAD">Yes - Have BIM / CAD files</option>
                      <option value="LiDAR / Drone Scans Available">Have Drone / LiDAR Scans</option>
                      <option value="Need Full Site Capture">Need Kraftgene Site Capture</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Deployment Timeline</label>
                  <select 
                    value={projectTimeline}
                    onChange={(e) => setProjectTimeline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Immediate (1-3 months)">Immediate (1-3 months)</option>
                    <option value="Q3/Q4 Planning">Q3/Q4 Planning</option>
                    <option value="Exploratory Evaluation">Exploratory Evaluation</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsConsultModalOpen(false)}
                    className="border-slate-200 dark:border-white/10 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 shadow-md shadow-blue-900/30"
                  >
                    Submit Scoping Request
                  </Button>
                </div>
              </form>
            )}

</div>
        </div>
      )}

      {/* Video Demo Player Modal */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-4xl p-6 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-500 fill-current" /> {selectedVideoTitle}
              </h3>
              <button 
                onClick={() => setSelectedVideoUrl(null)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Element */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5">
              <video 
                src={selectedVideoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => setSelectedVideoUrl(null)}
                variant="outline"
                className="border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Close Demo
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}