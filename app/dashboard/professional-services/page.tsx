"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Briefcase, FileText, Settings, 
  GraduationCap, Headset, ArrowRight, X, 
  CheckCircle2, Workflow, Database, Users,
  Lock, Unlock, ClipboardCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ProfessionalServicesPage() {
  const [user, setUser] = useState<any>(null)
  const [isSowModalOpen, setIsSowModalOpen] = useState(false)
  const [sowSubmitted, setSowSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // SOW Form State
  const [projectType, setProjectType] = useState("SCADA / Legacy System Integration")
  const [scopeDetails, setScopeDetails] = useState("")

  // Close all Professional Services Modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSowModalOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchFreshUser = async () => {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return

      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser) // Fast initial render from cache

      try {
        // Fetch fresh database record to get live serviceProgress
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

  // Close SOW Modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSowModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Parse subscription state
  const activePlansRaw = user?.organization?.activePlans || user?.activePlans || "[]";
  let activePlansArr: any[] = [];
  try {
    activePlansArr = typeof activePlansRaw === 'string' ? JSON.parse(activePlansRaw) : activePlansRaw;
  } catch (e) {}

  const hasProfessional = activePlansArr.some((p: any) => p.name === "Professional Services" || p === "Professional Services");

  const handleSowSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'Professional Services SOW',
          userEmail: user?.email,
          details: { 
            "Project Type": projectType, 
            "Scope Details": scopeDetails 
          }
        })
      });

      setSowSubmitted(true)
      setTimeout(() => {
        setIsSowModalOpen(false)
        setSowSubmitted(false)
        setScopeDetails("")
      }, 2500)
    } catch (error) {
      console.error("SOW submission error:", error)
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

        {/* Value Proposition Banner */}
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

        {/* Professional Service Pillars & Delivery Procedures (Unified) */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" /> Professional Service Pillars & Pricing
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Customized enterprise engagements with transparent pricing and structured delivery procedures
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. Legacy Systems Integration */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                {/* Embedded Banner Image */}
                <div className="w-full h-60 rounded-xl overflow-hidden mb-5 flex items-center justify-center p-2">
                  <img src="/integration2.webp" alt="Legacy Systems Integration" className="w-full h-full object-contain" />
                </div>

                <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                      <Workflow className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">Legacy Systems Integration</h3>
                      <p className="text-[11px] text-slate-500">Connect ERPs, CMMS (IBM Maximo, SAP), and GIS (ArcGIS)</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold block text-sm">$20k – $50k</span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Per System</span>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">1.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Discovery Audit:</strong> Security mapping (NERC CIP/API) and architecture review.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">2.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Middleware Dev:</strong> Custom bidirectional connectors for SAP, IBM Maximo, or ERPs.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">3.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">UAT & Staging:</strong> Sandbox environment testing to ensure zero operational disruption.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">4.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Production Launch:</strong> Live deployment with a 30-day hypercare support window.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Custom API & Data Engineering */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                {/* Embedded Banner Image */}
                <div className="w-full h-60 rounded-xl overflow-hidden mb-5 flex items-center justify-center p-2">
                  <img src="/api1.webp" alt="Custom API & Data Engineering" className="w-full h-full object-contain" />
                </div>

                <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                      <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">Custom API & Data Engineering</h3>
                      <p className="text-[11px] text-slate-500">Bespoke connectors for SCADA historians & edge devices</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold block text-sm">$10k – $30k</span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Per Pipeline</span>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">1.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Endpoint Profiling:</strong> Assessing rate limits, payload structures, and IoT edge hardware.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">2.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Schema Mapping:</strong> Aligning external telemetry datasets to the Kraftgene Twin ontology.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">3.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Pipeline Construction:</strong> Building fault-tolerant, real-time data ingestion pipelines.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">4.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">CI/CD Integration:</strong> Automated testing and deployment into your cloud or on-prem environment.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Change Management & Training */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                {/* Embedded Banner Image */}
                <div className="w-full h-60 rounded-xl overflow-hidden mb-5 flex items-center justify-center p-2">
                  <img src="/tr1.webp" alt="Change Management & Training" className="w-full h-full object-contain" />
                </div>

                <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                      <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">Change Management & Training</h3>
                      <p className="text-[11px] text-slate-500">Operator onboarding, workshops, and compliance docs</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold block text-sm">$5k – $15k</span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Per Cohort</span>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">1.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Needs Assessment:</strong> Evaluating operator workflows and control room protocols.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">2.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Curriculum Design:</strong> Tailoring documentation and scenario playbooks to your unique grid/pipeline.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">3.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Interactive Workshops:</strong> 2 to 4 day intensive on-site or virtual training sessions.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">4.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Certification:</strong> Final sandbox testing to ensure operator competence and safety compliance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Technical Account Management */}
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                {/* Embedded Banner Image */}
                <div className="w-full h-60 rounded-xl overflow-hidden mb-5 flex items-center justify-center p-2">
                  <img src="/tam2.webp" alt="Technical Account Management" className="w-full h-full object-contain" />
                </div>

                <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-500/20">
                      <Headset className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">Technical Account Management (TAM)</h3>
                      <p className="text-[11px] text-slate-500">Dedicated solutions architect & prioritized SLAs</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold block text-sm">$4k – $8k</span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Monthly Retainer</span>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">1.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Dedicated Resource:</strong> Senior solutions architect assigned directly to your workspace.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">2.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">SLA Prioritization:</strong> Guaranteed 1-hour response times for critical infrastructure tickets.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">3.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Proactive Syncs:</strong> Weekly touchpoints to manage ongoing integrations and roadmap requests.</p>
                  </div>
                  <div className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-5 font-bold text-purple-500 shrink-0">4.</span>
                    <p><strong className="text-slate-900 dark:text-white font-semibold">Quarterly Reviews:</strong> Comprehensive system audits and ROI reporting (QBRs).</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Subscription Status & Progress Section */}
        {hasProfessional ? (
          <section className="bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 mt-12 relative overflow-hidden shadow-lg">
            <div className="absolute top-4 right-4 bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <Unlock className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" /> Professional Services Active
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-2xl">
              Your service agreement is successfully activated. A Technical Account Manager (TAM) has been assigned to your workspace and is preparing your architecture audit.
            </p>
            
            {/* Dynamic Deployment Progress Bar from Database */}
            {(() => {
              // Robust Multi-Pass Parser for SQL Server
              let parsedProgress: any = user?.serviceProgress || {}
              try {
                if (typeof parsedProgress === 'string') parsedProgress = JSON.parse(parsedProgress)
                if (typeof parsedProgress === 'string') parsedProgress = JSON.parse(parsedProgress)
                if (typeof parsedProgress !== 'object' || parsedProgress === null) parsedProgress = {}
              } catch (e) {
                parsedProgress = {}
              }

              const proServiceData = parsedProgress["Professional Services"] || {}
              const liveProgress = proServiceData.progress ?? 10
              const livePhase = proServiceData.phaseName ?? "01 - Architecture Audit & SOW"

              return (
                <div className="max-w-2xl bg-slate-900/50 p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                    <span>Engagement Status</span>
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
            <div className="absolute top-4 right-4 bg-purple-500/20 p-2 rounded-full">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Engage Our Engineering Team?</h2>
            <p className="text-sm text-slate-300 mb-6 max-w-xl mx-auto">Subscribe to our Professional Services tier to activate dedicated support, customized operator training, and system integration.</p>
            <Link href="/dashboard/settings/plans#professional-services">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8">View Plans & Pricing</Button>
            </Link>
          </section>
        )}

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
                <fieldset disabled={isSubmitting} className="space-y-4 disabled:opacity-50 transition-opacity">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Primary Service Category</label>
                    <select 
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 disabled:cursor-not-allowed"
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
                      className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none disabled:cursor-not-allowed"
                    />
                  </div>
                </fieldset>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isSubmitting}
                    onClick={() => setIsSowModalOpen(false)}
                    className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 shadow-md shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Submitting...</span>
                    ) : "Submit SOW Request"}
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