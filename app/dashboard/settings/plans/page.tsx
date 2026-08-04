"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Check, Zap, Shield, FileText, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PlansAndFeesPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually")
  const [selectedPlan, setSelectedPlan] = useState<string>("Enterprise Convergence")
  const [checkoutLoading, setCheckoutLoading] = useState<string>("")
  const [portalLoading, setPortalLoading] = useState(false)
  
  const [activePlanName, setActivePlanName] = useState<string>("Free")
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive")
  const [activePriceId, setActivePriceId] = useState<string>("") // Tracks exact Price ID

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return
      const parsedUser = JSON.parse(storedUser)

      try {
        const res = await fetch(`/api/user/profile?email=${parsedUser.email}&t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        if (data.user?.organization) {
          setActivePlanName(data.user.organization.planName || "Free")
          setSubscriptionStatus(data.user.organization.subscriptionStatus || "inactive")
          if (data.user.organization.planName) {
            setSelectedPlan(data.user.organization.planName) // Snaps purple outline to real active plan!
          }
        }
        if (data.activePriceId) {
          setActivePriceId(data.activePriceId) // Sets active Price ID from Stripe
        }
      } catch (err) {
        console.error("Failed to fetch current plan", err)
      }
    }
    fetchUserData()
  }, [])

  const handleSubscribe = async (priceId: string, planName: string) => {
    setCheckoutLoading(planName)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (!user.email) throw new Error("Session error.")

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, priceId })
      })
      const data = await res.json()
      
      if (data.url) window.open(data.url, '_blank') // OPENS IN NEW TAB
      else alert(data.error || "Failed to load checkout.")
    } catch (err: any) {
      alert(err.message || "A network error occurred.")
    } finally {
      setCheckoutLoading("")
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })
      const data = await res.json()
      
      if (data.url) window.open(data.url, '_blank') // Open portal in new tab
      else alert(data.error || "Failed to load portal.")
    } catch (err) {
      alert("Network error.")
    } finally {
      setPortalLoading(false)
    }
  }

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
      buttonText: "Get Grid Digital Twin",
      stripePriceMonthly: "price_1U0drsCnK1WH2hz2ETrB7CUj",
      stripePriceAnnually: "price_1U0dwrCnK1WH2hz2vRXdFtze"
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
      buttonText: "Get Pipeline Digital Twin",
      stripePriceMonthly: "price_1U0dumCnK1WH2hz29ta30zW3",
      stripePriceAnnually: "price_1U0dxfCnK1WH2hz2B6V9AMUl"
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
      buttonText: "Get Enterprise Convergence",
      stripePriceMonthly: "price_1U0dvJCnK1WH2hz2XZ6Zlfnm",
      stripePriceAnnually: "price_1U0dyKCnK1WH2hz2aIY9w2Om"
    }
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
          
        <section className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{subscriptionStatus === "active" ? "Active Plan" : "No Active Subscription"}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activePlanName} Tier</h2>
            {subscriptionStatus === "active" && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your billing is managed via Stripe securely.</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleManageBilling}
              disabled={portalLoading}
              variant="outline" 
              className="border-purple-500/50 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10"
            >
              {portalLoading ? "Loading..." : "Manage Billing & Invoices"}
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
            {plans.map((plan, index) => {
              const targetPriceId = billingCycle === "monthly" ? plan.stripePriceMonthly : plan.stripePriceAnnually;
              // Matches against live activePriceId or falls back to plan name match on same cycle
              const isCurrentPlan = activePriceId 
                ? activePriceId === targetPriceId 
                : (activePlanName === plan.name && billingCycle === "annually");
              const isSelected = selectedPlan === plan.name;

            return (
              <div 
                key={index}
                onClick={() => setSelectedPlan(plan.name)}
                className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 cursor-pointer ${isSelected ? 'bg-white dark:bg-[#111113] border-purple-500 shadow-lg shadow-purple-500/10 relative' : 'bg-white dark:bg-[#111113] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
              >
                {isCurrentPlan && (
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
                  disabled={isCurrentPlan || checkoutLoading === plan.name}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from double-firing
                    if (!isCurrentPlan) handleSubscribe(billingCycle === "monthly" ? plan.stripePriceMonthly : plan.stripePriceAnnually, plan.name);
                  }}
                  className={`w-full text-xs font-semibold h-10 ${isCurrentPlan ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-0' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                >
                  {checkoutLoading === plan.name ? "Redirecting..." : isCurrentPlan ? "Current Active Plan" : plan.buttonText}
                </Button>
              </div>
            )
          })}
          </section>

        </main>
      </div>
    </div>
  )
}