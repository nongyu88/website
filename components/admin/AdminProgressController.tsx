"use client"

import { useState, useEffect } from "react"
import { 
  ChevronRight, ChevronLeft, MessageSquare, 
  History, CheckCircle2, X, Save, Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"

const SERVICE_PHASES = {
  "Professional Services": [
    { name: "01 - Architecture Audit & SOW", progress: 10 },
    { name: "02 - SOW Proposal Delivery", progress: 35 },
    { name: "03 - Agile Execution & Integration", progress: 70 },
    { name: "04 - Handover & Active Support", progress: 100 },
  ],
  "Digital Twins": [
    { name: "01 - Scoping & Discovery", progress: 15 },
    { name: "02 - Spatial 3D Modeling", progress: 45 },
    { name: "03 - Telemetry & AI Binding", progress: 75 },
    { name: "04 - Deployment & Training", progress: 100 },
  ],
  "Data Services": [
    { name: "01 - API Provisioning", progress: 20 },
    { name: "02 - Hardware Allocation", progress: 50 },
    { name: "03 - Field Execution", progress: 80 },
    { name: "04 - Continuous Telemetry", progress: 100 },
  ]
}

export default function AdminProgressController({ 
  userEmail = "client@example.com",
  userActivePlans = [],
  initialProgress = "{}",
  onProgressUpdate
}: { 
  userEmail?: string; 
  userActivePlans?: any[]; 
  initialProgress?: string | object;
  onProgressUpdate?: (newProgressJson: string) => void;
}) {

  const [activeService, setActiveService] = useState("Professional Services")
  
  const activePlanNames = userActivePlans.map((p: any) => typeof p === 'string' ? p : p.name);

  // Robust multi-pass JSON parser for SQL Server double-encoded strings
  const getParsedProgress = () => {
    if (!initialProgress) return {}
    let parsed: any = initialProgress
    try {
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
      }
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed) // Second pass for double-encoded SQL strings
      }
      return (typeof parsed === 'object' && parsed !== null) ? parsed : {}
    } catch {
      return {}
    }
  }

  const [dbProgressState, setDbProgressState] = useState<Record<string, any>>(getParsedProgress())

  // Sync state whenever initialProgress prop updates
  useEffect(() => {
    setDbProgressState(getParsedProgress())
  }, [initialProgress])

  const isServiceSubscribed = 
    (activeService === "Professional Services" && activePlanNames.includes("Professional Services")) ||
    (activeService === "Digital Twins" && (activePlanNames.includes("Digital Twins Services") || activePlanNames.includes("Digital Twins"))) ||
    (activeService === "Data Services" && activePlanNames.includes("Data Services"));

  const phases = SERVICE_PHASES[activeService as keyof typeof SERVICE_PHASES]

  const serviceData = dbProgressState[activeService] || {}
  const currentPhaseIndex = typeof serviceData.phaseIndex === 'number' ? serviceData.phaseIndex : 0
  const historyLogs = Array.isArray(serviceData.logs) ? serviceData.logs : []

  const currentPhase = isServiceSubscribed 
    ? (phases[currentPhaseIndex] || phases[0])
    : { name: "Inactive - Awaiting Subscription", progress: 0 }

  // Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateDirection, setUpdateDirection] = useState<"NEXT" | "PREV" | null>(null)
  const [updateNote, setUpdateNote] = useState("")
  const [isCommitting, setIsCommitting] = useState(false)

  // ESC Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUpdateModalOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleOpenUpdate = (direction: "NEXT" | "PREV") => {
    setUpdateDirection(direction)
    setIsUpdateModalOpen(true)
  }

  const handleConfirmUpdate = async () => {
    setIsCommitting(true)

    const newIndex = updateDirection === "NEXT" 
      ? Math.min(currentPhaseIndex + 1, phases.length - 1)
      : Math.max(currentPhaseIndex - 1, 0)
    
    const newPhase = phases[newIndex]

    try {
      const res = await fetch('/api/admin/update-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          service: activeService,
          phaseIndex: newIndex,
          phaseName: newPhase.name,
          progress: newPhase.progress,
          note: updateNote,
          author: "Admin User"
        })
      });

      const data = await res.json()

      if (data.success && data.serviceProgress) {
        let freshParsed = data.serviceProgress
        if (typeof freshParsed === 'string') freshParsed = JSON.parse(freshParsed)
        if (typeof freshParsed === 'string') freshParsed = JSON.parse(freshParsed)

        setDbProgressState(freshParsed)
        if (onProgressUpdate) {
          onProgressUpdate(data.serviceProgress)
        }
      }
    } catch (e) {
      console.error("Failed to sync progress to database", e)
    } finally {
      setIsCommitting(false)
      setIsUpdateModalOpen(false)
      setUpdateNote("")
    }
  }

  return (
    <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
      
      {/* Header & Service Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Client Fulfillment Tracker
          </h2>
          <p className="text-xs text-slate-500">Manage deployment phases and audit logs for <span className="font-semibold text-blue-500">{userEmail}</span></p>
        </div>
        <select 
          value={activeService}
          onChange={(e) => setActiveService(e.target.value)}
          className="bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {Object.keys(SERVICE_PHASES).map(service => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </div>

      {/* Progress Bar & Controls */}
      <div className="bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/5 rounded-xl p-6 mb-8">
        
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Status</span>
            <span className={`text-sm font-semibold flex items-center gap-2 ${isServiceSubscribed ? 'text-slate-900 dark:text-white' : 'text-amber-500'}`}>
              {!isServiceSubscribed && <Lock className="w-4 h-4" />}
              {currentPhase.name}
            </span>
          </div>
          <span className={`text-xl font-black ${isServiceSubscribed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
            {currentPhase.progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 mb-6 overflow-hidden border border-slate-300 dark:border-slate-700">
          <div 
            className={`${isServiceSubscribed ? 'bg-emerald-500' : 'bg-slate-600'} h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
            style={{ width: `${currentPhase.progress}%` }}
          >
            {isServiceSubscribed && <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full"></div>}
          </div>
        </div>

        {/* Controller Buttons */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4 mt-2">
          <Button 
            variant="outline"
            disabled={!isServiceSubscribed || currentPhaseIndex === 0}
            onClick={() => handleOpenUpdate("PREV")}
            className="border-slate-300 dark:border-white/10 text-xs h-9 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Rollback Phase
          </Button>
          
          <Button 
            disabled={!isServiceSubscribed || currentPhaseIndex === phases.length - 1}
            onClick={() => handleOpenUpdate("NEXT")}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs h-9 px-6 shadow-md cursor-pointer"
          >
            {isServiceSubscribed ? "Proceed to Next Phase" : "Awaiting Client Payment"} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Audit Logs */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
          <History className="w-4 h-4 mr-2 text-slate-400" /> Update History (Audit Trail)
        </h3>
        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
          {historyLogs.length === 0 && (
            <p className="text-xs text-slate-500 italic">No updates recorded for this service yet.</p>
          )}
          {historyLogs.map((log: any) => (
            <div key={log.id} className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10 pb-4">
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-[#111113] ${log.action === 'ADVANCED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{log.action} • {new Date(log.date).toLocaleDateString()}</span>
                  <span className="text-[10px] text-slate-400">by {log.author}</span>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">{log.phase}</p>
                <div className="flex items-start text-slate-600 dark:text-slate-300 bg-white dark:bg-black/20 p-2 rounded text-xs border border-slate-100 dark:border-white/5">
                  <MessageSquare className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0 opacity-50" />
                  <span className="italic">"{log.note}"</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commit Status Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setIsUpdateModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
              {updateDirection === "NEXT" ? <ChevronRight className="w-5 h-5 text-emerald-500 mr-2" /> : <ChevronLeft className="w-5 h-5 text-amber-500 mr-2" />}
              {updateDirection === "NEXT" ? "Advance Status" : "Rollback Status"}
            </h3>
            
            <p className="text-xs text-slate-500 mb-6">
              You are moving the project phase to: <br/>
              <strong className="text-slate-900 dark:text-white mt-1 block">
                {updateDirection === "NEXT" ? phases[currentPhaseIndex + 1]?.name : phases[currentPhaseIndex - 1]?.name}
              </strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                  <span>Update Note (Commit Message)</span>
                  <span className="text-red-500">*Required</span>
                </label>
                <textarea
                  required
                  disabled={isCommitting}
                  rows={3}
                  placeholder={updateDirection === "NEXT" ? "e.g., SOW signed by client, moving to execution phase." : "e.g., Client requested revisions on architecture audit. Rolling back."}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button 
                  variant="outline" 
                  disabled={isCommitting}
                  onClick={() => setIsUpdateModalOpen(false)} 
                  className="border-slate-200 dark:border-white/10 text-xs disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button 
                  disabled={!updateNote.trim() || isCommitting}
                  onClick={handleConfirmUpdate} 
                  className={`${updateDirection === "NEXT" ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'} text-white font-bold text-xs px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  {isCommitting ? (
                    <span className="flex items-center"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Committing...</span>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Commit Status</>
                  )}
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}