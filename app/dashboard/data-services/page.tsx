"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Database, Flame, Activity, 
  FileText, Download, Rocket, ShieldAlert, 
  ArrowRight, X, CheckCircle2, Radar, Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DataServicesPage() {
  const [user, setUser] = useState<any>(null)
  
  // Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isReportGenerating, setIsReportGenerating] = useState(false)
  
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false)
  const [hardwareSubmitted, setHardwareSubmitted] = useState(false)

  // Hardware Form State
  const [hardwareType, setHardwareType] = useState("UAV Drone Fleet (Thermal/LiDAR)")
  const [missionType, setMissionType] = useState("Hazardous Asset Inspection")
  const [trainingRequired, setTrainingRequired] = useState("Yes, include operator training")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  // Mock Automated Reports
  const recentReports = [
    { id: "REP-091", title: "Wildfire Risk Proximity Assessment", date: "Today, 08:30 AM", type: "Automated API", status: "Ready" },
    { id: "REP-090", title: "Pipeline Structural Health Summary", date: "Yesterday, 14:15 PM", type: "Sensor Telemetry", status: "Ready" },
    { id: "REP-089", title: "Thermal Anomaly Detection Log", date: "Aug 06, 2026", type: "UAV Data Upload", status: "Ready" },
  ]

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault()
    setIsReportGenerating(true)
    setTimeout(() => {
      setIsReportGenerating(false)
      setIsReportModalOpen(false)
      alert("Report successfully generated and downloaded to your device.")
    }, 2000)
  }

  const handleHardwareSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHardwareSubmitted(true)
    setTimeout(() => {
      setIsHardwareModalOpen(false)
      setHardwareSubmitted(false)
    }, 2500)
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
              <Database className="w-5 h-5 text-amber-500" /> Data Services Console
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Automated analytics & physical robotic data acquisition</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Adaptive Contrast Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-white dark:from-amber-900/30 dark:via-orange-900/20 dark:to-slate-900/40 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-8 relative overflow-hidden shadow-xl transition-colors">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-3 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Hybrid Intelligence Platform
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Actionable Telemetry from Sky to Screen
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Generate instant predictive reports using our real-time external APIs (wildfire & environmental tracking), or deploy our specialized robotic fleet for hands-on, high-risk asset inspections.
            </p>
          </div>
        </div>

        {/* SECTION 1: AUTOMATED SERVICES (Self-Serve) */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" /> Automated Intelligence & Reporting
              </h2>
              <p className="text-xs text-slate-500">Self-serve data aggregation, environmental API feeds, and structural health analysis</p>
            </div>
            <Button 
              onClick={() => setIsReportModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-md shadow-amber-900/20"
            >
              <FileText className="w-4 h-4 mr-2" /> Generate New Report
            </Button>
          </div>

          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-[#1A1A1D] border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Report ID</th>
                  <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Analysis Subject</th>
                  <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Source</th>
                  <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Generated</th>
                  <th className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-6 text-xs font-mono text-slate-500">{report.id}</td>
                    <td className="py-3 px-6 font-semibold text-slate-900 dark:text-white">{report.title}</td>
                    <td className="py-3 px-6 text-xs text-slate-500">{report.type}</td>
                    <td className="py-3 px-6 text-xs text-slate-500">{report.date}</td>
                    <td className="py-3 px-6 text-right">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 dark:border-white/10 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/30">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: HARDWARE ACQUISITION (Lead Gen / Consultative) */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radar className="w-5 h-5 text-amber-500" /> Robotic Data Acquisition
              </h2>
              <p className="text-xs text-slate-500">Specialized hardware deployment for hazardous environments and high-fidelity asset scanning</p>
            </div>
            <Badge className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 text-xs w-fit">
              Custom Deployments
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* UAV Drones */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-amber-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-200 dark:border-amber-500/20 mb-4">
                  <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">UAV Drone Fleet (Thermal / LiDAR)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Deploy enterprise-grade unmanned aerial vehicles for overhead pipeline inspections, vegetation encroachment analysis, and hazardous flare stack monitoring. Available with operator training.
                </p>
              </div>
              <Button 
                onClick={() => setIsHardwareModalOpen(true)}
                className="w-full bg-slate-100 hover:bg-amber-600 dark:bg-white/5 dark:hover:bg-amber-600 text-slate-900 dark:text-white hover:text-white font-semibold h-10 rounded-xl text-xs transition-all border border-slate-200 dark:border-white/10 hover:border-amber-600"
              >
                Request UAV Deployment
              </Button>
            </div>

            {/* Ground Robots */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-amber-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-200 dark:border-amber-500/20 mb-4">
                  <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Autonomous Ground Rovers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Navigate high-voltage substations and confined industrial spaces safely. Equipped with acoustic anomaly sensors, gas leak detectors, and high-res structural mapping.
                </p>
              </div>
              <Button 
                onClick={() => setIsHardwareModalOpen(true)}
                className="w-full bg-slate-100 hover:bg-amber-600 dark:bg-white/5 dark:hover:bg-amber-600 text-slate-900 dark:text-white hover:text-white font-semibold h-10 rounded-xl text-xs transition-all border border-slate-200 dark:border-white/10 hover:border-amber-600"
              >
                Request Rover Deployment
              </Button>
            </div>

          </div>
        </section>

      </main>

      {/* --- MODALS --- */}

      {/* 1. Modal: Automated Report Generator */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            
            <button onClick={() => setIsReportModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
              <FileText className="w-5 h-5 text-amber-500 mr-2" /> Data Report Generator
            </h3>
            <p className="text-xs text-slate-500 mb-6">Compile recent telemetry and external API feeds into an actionable PDF report.</p>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Analysis Target</label>
                <select className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500">
                  <option>Regional Wildfire Risk Proximity</option>
                  <option>Substation Structural Health Analysis</option>
                  <option>UAV Thermal Scan Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Date Range</label>
                <select className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500">
                  <option>Past 7 Days</option>
                  <option>Past 30 Days</option>
                  <option>Year to Date</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsReportModalOpen(false)} className="border-slate-200 dark:border-white/10 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={isReportGenerating} className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6">
                  {isReportGenerating ? "Compiling..." : "Generate PDF"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Request Hardware / Robotic Deployment */}
      {isHardwareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            
            <button onClick={() => setIsHardwareModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Request Robotics Deployment
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-6">
              Schedule enterprise hardware rentals or full-service data acquisition missions. Our field operations team will contact you to confirm logistics.
            </p>

            {hardwareSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-500 p-8 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Deployment Request Received</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our field operations team will contact <span className="font-semibold text-amber-600 dark:text-amber-400">{user?.email}</span> shortly to coordinate hardware availability and training requirements.
                </p>
              </div>
            ) : (
              <form onSubmit={handleHardwareSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Hardware Target</label>
                    <select 
                      value={hardwareType}
                      onChange={(e) => setHardwareType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option>UAV Drone Fleet (Thermal/LiDAR)</option>
                      <option>Autonomous Ground Rover</option>
                      <option>Stationary IoT Sensor Pack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Mission Type</label>
                    <select 
                      value={missionType}
                      onChange={(e) => setMissionType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option>Hazardous Asset Inspection</option>
                      <option>Routine Photogrammetry Scan</option>
                      <option>Emergency Wildfire / Leak Response</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Location / Asset Focus</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Northern Pipeline Sector 7"
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Operator Training Requirements</label>
                  <select 
                    value={trainingRequired}
                    onChange={(e) => setTrainingRequired(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option>Yes, include operator training</option>
                    <option>No, we have certified Kraftgene operators</option>
                    <option>Full-Service (Kraftgene flies the mission)</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsHardwareModalOpen(false)} className="border-slate-200 dark:border-white/10 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 shadow-md shadow-amber-900/30">
                    Submit Deployment Request
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