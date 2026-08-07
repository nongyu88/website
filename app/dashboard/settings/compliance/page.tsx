"use client"

import { useState } from "react" // 1. IMPORT USESTATE
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CompliancePage() {
  // 2. ADD TAB STATE
  const [activeTab, setActiveTab] = useState("legacy")

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-300 font-sans pb-20 transition-colors duration-300">
      
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] sticky top-0 z-50 px-6 py-4 flex items-center space-x-4 transition-colors duration-300">
        <Link href="/dashboard/settings" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Compliance and documents</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* 3. MAKE TABS INTERACTIVE */}
        <div className="flex space-x-6 border-b border-slate-200 dark:border-white/10 mb-8 text-sm font-medium">
          <button 
            onClick={() => setActiveTab("my_docs")}
            className={`pb-3 transition-colors ${activeTab === "my_docs" ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            My documents
          </button>
          <button 
            onClick={() => setActiveTab("stripe")}
            className={`pb-3 transition-colors ${activeTab === "stripe" ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            Stripe documents
          </button>
          <button 
            onClick={() => setActiveTab("legacy")}
            className={`pb-3 transition-colors ${activeTab === "legacy" ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            Legacy exports
          </button>
        </div>

        {/* 4. CONDITIONALLY RENDER CONTENT BASED ON TAB */}
        {activeTab === "my_docs" && (
          <div className="p-8 text-center border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#111113] text-slate-500">
            No personal compliance documents uploaded yet.
          </div>
        )}

        {activeTab === "stripe" && (
          <div className="p-8 text-center border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#111113] text-slate-500">
            Stripe tax documents will appear here at the end of the fiscal year.
          </div>
        )}

        {activeTab === "legacy" && (
          <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#111113] shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161618]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Legacy exports settings</h2>
            </div>

            <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-1 text-base">QuickBooks export</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Download an .iif file of your test transaction data that can be easily imported into QuickBooks.</p>
              </div>
              <button onClick={() => alert("Coming soon...")} className="shrink-0 px-4 py-1.5 bg-slate-100 dark:bg-[#2A2A2D] hover:bg-slate-200 dark:hover:bg-[#333336] text-slate-900 dark:text-white text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/10 transition-colors">
                Export to QuickBooks...
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}