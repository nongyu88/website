"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Check, Zap, Shield, FileText, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PlansAndFeesPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentPlan, setCurrentPlan] = useState("Enterprise")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "light") setIsDarkMode(false)
  }, [])

  const plans = [
    {
      name: "Utility Grid Twin",
      priceMonthly: "$1,200",
      priceAnnually: "$1,000",
      description: "Dedicated digital twin monitoring for power transmission & distribution grids.",
      features: [
        "Up to 500 substation nodes",
        "Real-time grid load flow analysis",
        "Substation cascade alert triggers",
        "5 Team seats included",
        "Standard support (24/7)"
      ],
      current: false,
      buttonText: "Switch to Grid Twin"
    },
    {
      name: "Pipeline Twin",
      priceMonthly: "$1,500",
      priceAnnually: "$1,250",
      description: "Comprehensive hydraulic & pressure simulation for oil & gas pipelines.",
      features: [
        "Up to 1,000 km pipeline network",
        "Real-time pressure drop & leak detection",
        "SCADA telemetry integration",
        "5 Team seats included",
        "Standard support (24/7)"
      ],
      current: false,
      buttonText: "Switch to Pipeline Twin"
    },
    {
      name: "Enterprise Convergence",
      priceMonthly: "$2,800",
      priceAnnually: "$2,400",
      description: "Unified cross-domain platform for co-located power and pipeline networks.",
      features: [
        "Unlimited grid & pipeline nodes",
        "Cross-domain cascade impact engine",
        "Custom ML anomaly models",
        "Unlimited Team seats",
        "Dedicated account engineer & SLA"
      ],
      current: true,
      buttonText: "Current Active Plan"
    }
  ]

  const invoices = [
    { id: "INV-2026-008", date: "Aug 1, 2026", amount: "$2,400.00", status: "Paid" },
    { id: "INV-2026-007", date: "Jul 1, 2026", amount: "$2,400.00", status: "Paid" },
    { id: "INV-2026-006", date: "Jun 1, 2026", amount: "$2,400.00", status: "Paid" }
  ]

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-700 dark:text-slate-300 font-sans selection:bg-purple-500/30 pb-20 relative transition-colors duration-300">
        
        {/* Top Header */}
        <header className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] sticky top-0 z-40 px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/settings" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Plans and fees</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          
          {/* SECTION 1: CURRENT SUBSCRIPTION BANNER */}
          <section className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Active Plan</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Enterprise Convergence Tier</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your next billing date is <strong>September 1, 2026</strong> ($2,400/month, billed annually).</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-purple-500/50 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10">
                Manage Payment Method
              </Button>
            </div>
          </section>

          {/* BILLING CYCLE TOGGLE */}
          <div className="flex justify-center my-8">
            <div className="bg-slate-200 dark:bg-[#111113] p-1 rounded-xl border border-slate-300 dark:border-white/10 flex items-center">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${billingCycle === "monthly" ? "bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annually")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 ${billingCycle === "annually" ? "bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: PLANS GRID */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 ${plan.current ? 'bg-white dark:bg-[#111113] border-purple-500 shadow-lg shadow-purple-500/10 relative' : 'bg-white dark:bg-[#111113] border-slate-200 dark:border-white/10'}`}
              >
                {plan.current && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Current Plan
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 min-h-[36px]">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {billingCycle === "annually" ? plan.priceAnnually : plan.priceMonthly}
                    </span>
                    <span className="text-slate-500 text-xs"> / month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  disabled={plan.current}
                  className={`w-full text-xs font-semibold h-10 ${plan.current ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </section>

          {/* SECTION 3: INVOICE HISTORY */}
          <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
              <FileText className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Billing History & Invoices</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500">
                    <th className="py-3 font-medium">Invoice Number</th>
                    <th className="py-3 font-medium">Date</th>
                    <th className="py-3 font-medium">Amount</th>
                    <th className="py-3 font-medium">Status</th>
                    <th className="py-3 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1A1A1D] transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{inv.id}</td>
                      <td className="py-3 text-slate-500">{inv.date}</td>
                      <td className="py-3 text-slate-900 dark:text-white font-medium">{inv.amount}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button className="text-purple-600 dark:text-purple-400 hover:underline flex items-center justify-end ml-auto">
                          <Download className="w-3.5 h-3.5 mr-1" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}