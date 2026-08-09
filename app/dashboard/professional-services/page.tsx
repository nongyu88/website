"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Briefcase, FileText, Settings, 
  GraduationCap, Headset, ArrowRight, X, 
  CheckCircle2, Workflow, Database, Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ProfessionalServicesPage() {
  const [user, setUser] = useState<any>(null)
  const [isSowModalOpen, setIsSowModalOpen] = useState(false)
  const [sowSubmitted, setSowSubmitted] = useState(false)

  // SOW Form State
  const [projectType, setProjectType] = useState("SCADA / Legacy System Integration")
  const [scopeDetails, setScopeDetails] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const handleSowSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSowSubmitted(true)
    setTimeout(() => {
      setIsSowModalOpen(false)
      setSowSubmitted(false)
      setScopeDetails("")
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
              <Briefcase className="w-5 h-5 text-purple-500" /> Professional Services
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise integration, training, and dedicated engineering support</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsSowModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-md shadow-purple-900/20"
        >
          <FileText className="w-4 h-4 mr-2" /> Request Statement of Work
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Value Proposition Banner (Contrast Fixed for Both Modes) */}
        <div className="bg-gradient-to-r from-purple-50 via-fuchsia-50 to-white dark:from-purple-900/30 dark:via-fuchsia-900/20 dark:to-slate-900/40 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-8 relative overflow-hidden shadow-xl transition-colors">
          <div className="relative z-10 max-w-2xl">
            <Badge className="mb-3 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Expert Implementation
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Seamlessly Integrate AI Into Your Enterprise Architecture
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Maximize the ROI of your digital twins. Our solutions architects work alongside your IT and operational teams to connect legacy systems, train personnel, and ensure secure, compliant deployment across your organization.
            </p>
            <Button 
              onClick={() => setIsSowModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-11 px-6 rounded-xl transition-all shadow-lg shadow-purple-900/40"
            >
              Discuss Your Integration Requirements <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Service Pillars */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" /> Professional Service Pillars
              </h2>
              <p className="text-xs text-slate-500">Customized engagements to bridge the gap between our platform and your operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1: Systems Integration */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                <Workflow className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Legacy Systems Integration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Connect Kraftgene AI bidirectionally with your existing ERPs, CMMS (IBM Maximo, SAP), and GIS platforms (Esri ArcGIS) to maintain a single source of truth.
                </p>
              </div>
            </div>

            {/* Pillar 2: Custom Data Engineering */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Custom API & Data Engineering</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Development of bespoke data connectors for proprietary SCADA historians, custom IoT edge devices, or localized weather monitoring stations.
                </p>
              </div>
            </div>

            {/* Pillar 3: Training & Change Management */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Change Management & Training</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Comprehensive onboarding programs, on-site workshops, and documentation for control room operators, ensuring rapid platform adoption and safety compliance.
                </p>
              </div>
            </div>

            {/* Pillar 4: Dedicated Support */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                <Headset className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Technical Account Management (TAM)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Assigned solutions architects and prioritized SLAs for mission-critical infrastructure, including quarterly business reviews and proactive system audits.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Engagement Process */}
        <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The Engagement Process</h2>
          <p className="text-xs text-slate-500 mb-8">How we scope, execute, and deliver professional services</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-purple-500/30 mb-2 block">01</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Architecture Audit</h4>
              <p className="text-xs text-slate-500">We analyze your current tech stack, IT security constraints, and operational bottlenecks.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-purple-500/30 mb-2 block">02</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">SOW Proposal</h4>
              <p className="text-xs text-slate-500">We deliver a detailed Statement of Work outlining deliverables, timelines, and resourcing.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-purple-500/30 mb-2 block">03</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Agile Execution</h4>
              <p className="text-xs text-slate-500">Our engineers integrate the solutions with regular milestone check-ins and staging reviews.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0B] rounded-xl border border-slate-200 dark:border-white/5 relative">
              <span className="text-2xl font-black text-purple-500/30 mb-2 block">04</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Handover & Support</h4>
              <p className="text-xs text-slate-500">Rigorous UAT testing, user training sessions, and transition to ongoing TAM support.</p>
            </div>
          </div>

        </section>

      </main>

      {/* Modal: Request Statement of Work */}
      {isSowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            
            <button 
              onClick={() => setIsSowModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Request Service Scoping
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-6">
              Submit your integration or training requirements. Our solutions architecture team will contact you to draft a formal Statement of Work (SOW).
            </p>

            {sowSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-500 p-8 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Scoping Request Received</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Thank you. An Enterprise Solutions Architect will reach out to <span className="font-semibold text-purple-600 dark:text-purple-400">{user?.email}</span> within 24 hours to schedule a discovery call.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSowSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Primary Service Category</label>
                  <select 
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="SCADA / Legacy System Integration">SCADA / Legacy System Integration</option>
                    <option value="Custom API / Data Engineering">Custom API & Data Engineering</option>
                    <option value="Operator Training & Onboarding">Operator Training & Onboarding</option>
                    <option value="Dedicated Technical Account Management">Dedicated Support / TAM</option>
                    <option value="Other Enterprise Integration">Other Enterprise Integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Brief Overview of Requirements</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="E.g., We need to integrate Kraftgene with our on-premise IBM Maximo server, and require a 2-day on-site training workshop for 15 operators..."
                    value={scopeDetails}
                    onChange={(e) => setScopeDetails(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSowModalOpen(false)}
                    className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 shadow-md shadow-purple-900/30"
                  >
                    Submit SOW Request
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