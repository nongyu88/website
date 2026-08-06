"use client"

import { Database, ShieldCheck, Activity, Plane, ArrowRight, Zap, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DataServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-300 font-sans selection:bg-orange-500/30 pb-20 transition-colors duration-300">
      
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] sticky top-0 z-40 px-6 py-5 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 dark:bg-orange-500/10 w-10 h-10 rounded-lg flex items-center justify-center border border-orange-200 dark:border-orange-500/20">
            <Database className="w-5 h-5 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Services</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            The Lifeblood of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Digital Twin</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            A physics-informed AI is only as powerful as the data it processes. Kraftgene Data Services bridges the gap between your physical infrastructure and our autonomous intelligence engine through high-fidelity, real-time telemetry.
          </p>
        </section>

        {/* WHAT IS IT? SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#111113] p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-transform hover:-translate-y-1">
            <Plane className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Live UAV Ingestion</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Stream multiple live drone feeds directly into your dashboard. Our edge AI processes visual and thermal data locally to detect wildfires and encroachments in milliseconds.
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#111113] p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-transform hover:-translate-y-1">
            <Activity className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Asset Telemetry</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Continuous SCADA integration for pressure, thermal limits, and flow dynamics. We translate your raw sensor outputs into a unified 3D logical topology.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111113] p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-transform hover:-translate-y-1">
            <ShieldCheck className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Environmental Fusion</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Overlay premium meteorological data APIs directly onto your infrastructure corridors to forecast extreme weather events before they compromise physical nodes.
            </p>
          </div>
        </section>

        {/* WHY IT IS IMPORTANT */}
        <section className="bg-slate-100 dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                <Zap className="w-3.5 h-3.5" /> Mission Critical
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Why are Data Services Important?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Legacy infrastructure monitoring is entirely reactive—you only know something is broken after it fails. By utilizing Kraftgene Data Services, you transition to a <strong>predictive operational model</strong>.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Eliminate blind spots across vast, remote infrastructure.",
                  "Enable the AI Copilot to execute autonomous mitigation strategies.",
                  "Automate environmental compliance tracking and reporting.",
                  "Reduce false positives through multi-spectrum thermal validation."
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl">
                {/* Replace with a relevant image or keep the dark placeholder */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/40 to-black/80 z-10"></div>
                <img src="/images/e4.webp" alt="Data Services Visualization" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO GET IT (CTA) */}
        <section className="text-center bg-gradient-to-b from-white to-slate-50 dark:from-[#151518] dark:to-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-3xl p-12 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to activate real-time telemetry?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Data Services require custom integration with your existing SCADA architecture and drone deployment protocols. Our engineering team works directly with your operators to ensure secure, end-to-end data flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-600 hover:bg-orange-500 text-white h-12 px-8 font-bold text-sm transition-all shadow-lg shadow-orange-900/20">
              Contact Solutions Team
            </Button>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 h-12 px-8 font-bold text-sm">
                View Subscription Plans
              </Button>
            </Link>
          </div>
        </section>

      </main>
    </div>
  )
}