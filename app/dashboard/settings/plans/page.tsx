"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { addNotification } from "@/lib/notifications"

// NEW: Define the strict object structure matching our database
interface ActivePlanData {
  name: string;
  priceId: string;
  cycle: string;
  cancelAtPeriodEnd?: boolean;
}

function PlansContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually")

  // Listen for return redirects from Stripe Checkout
  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    const userObj = JSON.parse(localStorage.getItem("user") || "{}")

    if (success === "true" && userObj?.email) {
      addNotification(
        userObj.email,
        "Subscription Active",
        "Your payment was successful and your subscription is now active."
      )
      router.replace("/dashboard/settings/plans")
    }

    if (canceled === "true" && userObj?.email) {
      addNotification(
        userObj.email,
        "Checkout Canceled",
        "Your subscription checkout process was canceled."
      )
      router.replace("/dashboard/settings/plans")
    }
  }, [searchParams, router])
  const [addonBillingCycle, setAddonBillingCycle] = useState<"monthly" | "annually">("annually")
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [checkoutLoading, setCheckoutLoading] = useState<string>("")
  const [portalLoading, setPortalLoading] = useState(false)
  
  // Controls the greyed-out state while fetching data
  const [isPageLoading, setIsPageLoading] = useState(true)

  const [activePlanName, setActivePlanName] = useState<string>("Free")
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive")
  const [activePriceId, setActivePriceId] = useState<string>("")

  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // State now holds our detailed objects!
  const [activePlans, setActivePlans] = useState<ActivePlanData[]>([]);

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    const role = String(userObj.role || "viewer").toLowerCase();
    
    setIsAdmin(role === "admin" || role === "owner");
  }, []);

  // Re-sync plan state whenever the user switches back to this browser tab (from Stripe Portal)
  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          fetch(`/api/user/profile?email=${parsedUser.email}&t=${Date.now()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
              if (data.user?.activePlans) {
                const parsed = typeof data.user.activePlans === 'string' ? JSON.parse(data.user.activePlans) : data.user.activePlans;
                setActivePlans(parsed);
              }
            })
            .catch(err => console.error(err));
        }
      }, 1200);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsPageLoading(true); 
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        setIsPageLoading(false);
        return;
      }
      const parsedUser = JSON.parse(storedUser)

      try {
        const res = await fetch(`/api/user/profile?email=${parsedUser.email}&t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        if (data.user) {
          setUser(data.user);

          const realRole = String(data.user.role || "viewer").toLowerCase();
          setIsAdmin(realRole === "admin" || realRole === "owner");
          
          localStorage.setItem("user", JSON.stringify({ ...parsedUser, role: realRole }));
        }

        // Helper to parse the JSON and map legacy strings to objects if needed
        const parsePlans = (rawPlans: any): ActivePlanData[] => {
          if (!rawPlans) return [];
          try {
            const parsed = typeof rawPlans === 'string' ? JSON.parse(rawPlans) : rawPlans;
            if (Array.isArray(parsed)) {
              return parsed.map((p: any) => {
                // If it's an old string record, convert it to an object safely
                if (typeof p === 'string') return { name: p, priceId: "", cycle: "Unknown" };
                return p;
              });
            }
          } catch (err) {}
          return [];
        };

        let fetchedPlans = parsePlans(data.user?.organization?.activePlans);

        if (fetchedPlans.length === 0) {
          fetchedPlans = parsePlans(data.user?.activePlans);
        }

        setActivePlans(fetchedPlans);

        if (data.activePriceId) {
          setActivePriceId(data.activePriceId)
        }
      } catch (err) {
        console.error("Failed to fetch current plan", err)
      } finally {
        setIsPageLoading(false); 
      }
    }
    fetchUserData()
  }, [])

  const handleSubscribe = async (priceId: string, planName: string) => {
    setCheckoutLoading(planName);

    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userObj.email) throw new Error("Session error. Please re-login.");

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userObj.email, priceId })
      });
      
      const data = await res.json();
      
      if (data.url) {
        // Redirect current tab directly to Stripe
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to load checkout.");
      }
    } catch (err: any) {
      alert(err.message || "A network error occurred.");
    } finally {
      setCheckoutLoading("");
    }
  }

  const handleManageBilling = async (actionType?: 'update' | 'cancel' | 'reactivate' | 'upgrade', activePriceId?: string, targetPriceId?: string) => {
    setPortalLoading(true);
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userObj.email, 
          action: actionType, 
          priceId: activePriceId,
          targetPriceId: targetPriceId
        })
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to load billing portal.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setPortalLoading(false);
    }
  }
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "light") setIsDarkMode(false)

    // Handle deep-linking from dashboard card buttons (e.g., #additional-services)
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [])

  const additionalServices = [
    {
      id: "digital-twins",
      name: "Digital Twins Services",
      description: "Advanced physical asset modeling and custom environmental integration for your specific infrastructure.",
      features: [
        "Real-time asset telemetry",
        "Custom 3D spatial environments",
        "IoT sensor aggregation",
        "Dedicated API endpoints"
      ],
      buttonText: "Subscribe to Digital Twins",
      priceMonthly: "$500",
      priceAnnually: "$400",
      stripePriceMonthly: "price_1U13FiCnK1WH2hz2EwrOlA7u",
      stripePriceAnnually: "price_1U13G8CnK1WH2hz2d1Khdn3z",
    },
    {
      id: "professional-services",
      name: "Professional Services",
      description: "Dedicated client training, seamless system API integration, and full digital transformation consulting.",
      features: [
        "Dedicated account manager",
        "Custom API integration",
        "Weekly strategy syncs",
        "Priority 24/7 routing"
      ],
      buttonText: "Subscribe to Pro Services",
      priceMonthly: "$800",
      priceAnnually: "$633",
      stripePriceMonthly: "price_1U13HSCnK1WH2hz2zqnZI8xB",
      stripePriceAnnually: "price_1U13HqCnK1WH2hz2QKrXe9En",
    },
    {
      id: "data-services",
      name: "Data Services",
      description: "Real-time robotic data acquisition, live UAV drone feeds, and continuous asset health telemetry.",
      features: [
        "Live UAV drone feeds",
        "Robotic data acquisition",
        "Historical telemetry retention",
        "Custom export pipelines"
      ],
      buttonText: "Subscribe to Data Services",
      priceMonthly: "$600",
      priceAnnually: "$475",
      stripePriceMonthly: "price_1U13ICCnK1WH2hz2IeK3uYsE",
      stripePriceAnnually: "price_1U13IOCnK1WH2hz22xIIcIpH",
    }
  ];

  const plans = [
    {
      id: "grid",
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
      buttonText: "Get Grid Digital Twin",
      stripePriceMonthly: "price_1U0drsCnK1WH2hz2ETrB7CUj",
      stripePriceAnnually: "price_1U0dwrCnK1WH2hz2vRXdFtze"
    },
    {
      id: "grid_distribution",
      name: "Grid Distribution Twin",
      priceMonthly: "$1,100",
      priceAnnually: "$900",
      description: "Low & medium voltage feeder intelligence, PV/DER tracking, and EV load modeling.",
      features: [
        "118-Bus feeder simulation model",
        "Live PV & Solar DER tracking",
        "EV load & battery SOC modeling",
        "Autonomous voltage tap optimization",
        "Azure IoT Hub MQTT streaming"
      ],
      buttonText: "Get Distribution Twin",
      stripePriceMonthly: "price_1U4FUrCnK1WH2hz2knMkvY8O", 
      stripePriceAnnually: "price_1U4FVmCnK1WH2hz2hx6mghNL"  
    },
    {
      id: "pipeline",
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
      buttonText: "Get Pipeline Digital Twin",
      stripePriceMonthly: "price_1U0dumCnK1WH2hz29ta30zW3",
      stripePriceAnnually: "price_1U0dxfCnK1WH2hz2B6V9AMUl"
    },
  ]

  const filteredPlans = plans.filter(plan => {
    if (!user?.industry) return true;
    if (user?.industry === 'both') return plan.id === 'enterprise';
    return plan.id === user?.industry;
  });

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
          
        {/* TOP ACTIVE SUBSCRIPTION BANNER */}
        <section className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{activePlans.length > 0 ? "Active Subscriptions" : "No Active Subscription"}</span>
            </div>
            
            {activePlans.filter(p => plans.some(main => main.name === p.name)).length > 0 ? (
              <div className="flex flex-col space-y-2">
                {activePlans.filter(p => plans.some(main => main.name === p.name)).map((planObj, i) => (
                  <h2 key={i} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 shrink-0"></span>
                    {/* Render directly from our detailed JSON object */}
                    {planObj.name}{planObj.cycle && planObj.cycle !== "Unknown" ? ` (${planObj.cycle})` : ""} Tier
                  </h2>
                ))}
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Free Tier</h2>
            )}
            
            {activePlans.length > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Your billing is managed via Stripe securely.</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => {
                    if (!isAdmin) {
                      alert("Only Organization Admins can access billing management.");
                      return;
                    }
                    handleManageBilling();
                  }}
                  disabled={portalLoading || isPageLoading || !isAdmin}
                  variant="outline" 
                  className={`border-purple-500/50 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 ${
                    !isAdmin ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {portalLoading ? "Loading..." : !isAdmin ? "Admin Required" : "Manage Billing & Invoices"}
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
          <section className={`grid grid-cols-1 gap-6 ${filteredPlans.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-3'}`}>
          {filteredPlans.map((plan) => {
              const targetPriceId = billingCycle === "monthly" ? plan.stripePriceMonthly : plan.stripePriceAnnually;
              
              const yearlyPlanObj = activePlans.find(p => p.name === plan.name && p.priceId === plan.stripePriceAnnually);
              const monthlyPlanObj = activePlans.find(p => p.name === plan.name && p.priceId === plan.stripePriceMonthly);

              const isYearlyActive = !!yearlyPlanObj;
              const isMonthlyActive = !!monthlyPlanObj;
              const isExactCurrentPlan = activePlans.some(p => p.priceId === targetPriceId);

              const isYearlyCanceling = yearlyPlanObj?.cancelAtPeriodEnd === true;
              const isMonthlyCanceling = monthlyPlanObj?.cancelAtPeriodEnd === true;

              const isSelected = selectedPlan === plan.name;

              let buttonText = plan.buttonText;
              let isDisabled = isPageLoading || checkoutLoading === plan.name || !isAdmin;
              let buttonClasses = `w-full text-xs font-semibold h-10 ${
                !isAdmin ? 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-400' : ''
              }`;

              if (isYearlyActive) {
                if (billingCycle === "annually") {
                  if (isYearlyCanceling) {
                    buttonText = "Reactivate Yearly Plan";
                    buttonClasses = `w-full text-xs font-semibold h-10 bg-emerald-500 hover:bg-emerald-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                  } else {
                    buttonText = "Cancel Yearly Plan";
                    buttonClasses = `w-full text-xs font-semibold h-10 bg-red-500 hover:bg-red-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                  }
                } else {
                  isDisabled = true;
                  buttonText = "Yearly Active (Disable Monthly)";
                }
              } else if (isMonthlyActive) {
                if (billingCycle === "annually") {
                  if (isMonthlyCanceling) {
                    isDisabled = true;
                    buttonText = "Monthly Canceling (Locked)";
                  } else {
                    buttonText = "Upgrade to Pro";
                    buttonClasses = `w-full text-xs font-semibold h-10 bg-emerald-500 hover:bg-emerald-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                  }
                } else {
                  if (isMonthlyCanceling) {
                    buttonText = "Reactivate Monthly Plan";
                    buttonClasses = `w-full text-xs font-semibold h-10 bg-emerald-500 hover:bg-emerald-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                  } else {
                    buttonText = "Cancel Monthly Plan";
                    buttonClasses = `w-full text-xs font-semibold h-10 bg-red-500 hover:bg-red-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                  }
                }
              }

              return (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 cursor-pointer ${isSelected ? 'bg-white dark:bg-[#111113] border-slate-900 dark:border-white shadow-md relative' : 'bg-white dark:bg-[#111113] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                >
                {isExactCurrentPlan && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {isYearlyCanceling || isMonthlyCanceling ? "Canceling Soon" : "Current Plan"}
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
                  disabled={isDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAdmin) {
                      alert("Only Organization Admins can manage billing tiers.");
                      return;
                    }
                    
                    if (isYearlyActive && billingCycle === "annually") {
                      if (isYearlyCanceling) {
                        handleManageBilling('reactivate', plan.stripePriceAnnually);
                      } else {
                        handleManageBilling('cancel', plan.stripePriceAnnually);
                      }
                    } else if (isMonthlyActive && billingCycle === "monthly") {
                      if (isMonthlyCanceling) {
                        handleManageBilling('reactivate', plan.stripePriceMonthly);
                      } else {
                        handleManageBilling('cancel', plan.stripePriceMonthly);
                      }
                    } else if (isMonthlyActive && billingCycle === "annually" && !isMonthlyCanceling) {
                      handleManageBilling('upgrade', plan.stripePriceMonthly, plan.stripePriceAnnually);
                    } else if (!isYearlyActive && !isMonthlyActive) {
                      handleSubscribe(targetPriceId, plan.name);
                    }
                  }}
                  className={buttonClasses}
                >
                  {isPageLoading ? "Loading..." : !isAdmin ? "Admin Permission Required" : buttonText}
                </Button>
              </div>
            )
          })}
    </section>

          {/* SECTION 3: ADDITIONAL ENTERPRISE SERVICES */}
          <div id="additional-services" className="pt-12 mt-12 border-t border-slate-200 dark:border-white/10 space-y-8">
            <div className="text-center md:text-left mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Additional Enterprise Services</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Modular add-ons to enhance your core infrastructure operations. Available regardless of your primary subscription tier.
              </p>
            </div>

            {/* ADD-ON ACTIVE SUBSCRIPTIONS BANNER */}
            <section className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>{activePlans.filter(p => additionalServices.some(as => as.name === p.name)).length > 0 ? "Active Add-on Subscriptions" : "No Active Add-ons"}</span>
                </div>
                
                {activePlans.filter(p => additionalServices.some(as => as.name === p.name)).length > 0 ? (
                  <div className="flex flex-col space-y-2">
                    {activePlans.filter(p => additionalServices.some(as => as.name === p.name)).map((planObj, i) => (
                      <h2 key={i} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 shrink-0"></span>
                        {planObj.name}{planObj.cycle && planObj.cycle !== "Unknown" ? ` (${planObj.cycle})` : ""}
                      </h2>
                    ))}
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Expand your capabilities below</h2>
                )}
                
                {activePlans.filter(p => additionalServices.some(as => as.name === p.name)).length > 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Your billing is managed via Stripe securely.</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
              <Button 
                  onClick={() => {
                    if (!isAdmin) {
                      alert("Only Organization Admins can access billing management.");
                      return;
                    }
                    handleManageBilling();
                  }}
                  disabled={portalLoading || isPageLoading || !isAdmin}
                  variant="outline" 
                  className={`border-purple-500/50 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 ${
                    !isAdmin ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {portalLoading ? "Loading..." : !isAdmin ? "Admin Required" : "Manage Billing & Invoices"}
                </Button>
              </div>
            </section>

            {/* ADD-ON BILLING CYCLE TOGGLE */}
            <div className="flex justify-center my-8">
              <div className="bg-slate-200 dark:bg-[#111113] p-1 rounded-xl border border-slate-300 dark:border-white/10 flex items-center">
                <button
                  onClick={() => setAddonBillingCycle("monthly")}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${addonBillingCycle === "monthly" ? "bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setAddonBillingCycle("annually")}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 ${addonBillingCycle === "annually" ? "bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  <span>Annual Billing</span>
                  <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
                </button>
              </div>
            </div>

            {/* VERTICAL CENTERED CARDS */}
            <section className="flex flex-col space-y-8 max-w-md mx-auto">
            {additionalServices.map((plan) => {
                const targetPriceId = addonBillingCycle === "monthly" ? plan.stripePriceMonthly : plan.stripePriceAnnually;
                
                const yearlyPlanObj = activePlans.find(p => p.name === plan.name && p.priceId === plan.stripePriceAnnually);
                const monthlyPlanObj = activePlans.find(p => p.name === plan.name && p.priceId === plan.stripePriceMonthly);

                const isYearlyActive = !!yearlyPlanObj;
                const isMonthlyActive = !!monthlyPlanObj;
                const isExactCurrentPlan = activePlans.some(p => p.priceId === targetPriceId);

                const isYearlyCanceling = yearlyPlanObj?.cancelAtPeriodEnd === true;
                const isMonthlyCanceling = monthlyPlanObj?.cancelAtPeriodEnd === true;

                const isSelected = selectedPlan === plan.name;

                let buttonText = plan.buttonText;
                let isDisabled = isPageLoading || checkoutLoading === plan.name || !isAdmin;
                let buttonClasses = `w-full text-xs font-semibold h-10 ${
                  !isAdmin ? 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-400' : ''
                }`;

                if (isYearlyActive) {
                  if (addonBillingCycle === "annually") {
                    if (isYearlyCanceling) {
                      buttonText = "Reactivate Yearly Plan";
                      buttonClasses = `w-full text-xs font-semibold h-10 bg-emerald-500 hover:bg-emerald-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                    } else {
                      buttonText = "Cancel Yearly Plan";
                      buttonClasses = `w-full text-xs font-semibold h-10 bg-red-500 hover:bg-red-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                    }
                  } else {
                    isDisabled = true;
                    buttonText = "Yearly Active (Disable Monthly)";
                  }
                } else if (isMonthlyActive) {
                  if (addonBillingCycle === "annually") {
                    if (isMonthlyCanceling) {
                      isDisabled = true;
                      buttonText = "Monthly Canceling (Locked)";
                    } else {
                      buttonText = "Upgrade to Pro";
                      buttonClasses = `w-full text-xs font-semibold h-10 bg-emerald-500 hover:bg-emerald-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                    }
                  } else {
                    if (isMonthlyCanceling) {
                      buttonText = "Reactivate Monthly Plan";
                      buttonClasses = `w-full text-xs font-semibold h-10 bg-emerald-500 hover:bg-emerald-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                    } else {
                      buttonText = "Cancel Monthly Plan";
                      buttonClasses = `w-full text-xs font-semibold h-10 bg-red-500 hover:bg-red-600 text-white ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`;
                    }
                  }
                }

              return (
                <div 
                  key={plan.id}
                  id={plan.id}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 cursor-pointer w-full ${isSelected ? 'bg-white dark:bg-[#111113] border-slate-900 dark:border-white shadow-md relative' : 'bg-white dark:bg-[#111113] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                >
                  {isExactCurrentPlan && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {isYearlyCanceling || isMonthlyCanceling ? "Canceling Soon" : "Current Plan"}
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 min-h-[36px]">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {addonBillingCycle === "annually" ? plan.priceAnnually : plan.priceMonthly}
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
                    disabled={isDisabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAdmin) {
                        alert("Only Organization Admins can manage billing tiers.");
                        return;
                      }

                      if (isYearlyActive && addonBillingCycle === "annually") {
                        if (isYearlyCanceling) {
                          handleManageBilling('reactivate', plan.stripePriceAnnually);
                        } else {
                          handleManageBilling('cancel', plan.stripePriceAnnually);
                        }
                      } else if (isMonthlyActive && addonBillingCycle === "monthly") {
                        if (isMonthlyCanceling) {
                          handleManageBilling('reactivate', plan.stripePriceMonthly);
                        } else {
                          handleManageBilling('cancel', plan.stripePriceMonthly);
                        }
                      } else if (isMonthlyActive && addonBillingCycle === "annually" && !isMonthlyCanceling) {
                        handleManageBilling('upgrade', plan.stripePriceMonthly, plan.stripePriceAnnually);
                      } else if (!isYearlyActive && !isMonthlyActive) {
                        handleSubscribe(targetPriceId, plan.name);
                      }
                    }}
                    className={buttonClasses}
                  >
                    {isPageLoading ? "Loading..." : !isAdmin ? "Admin Permission Required" : buttonText}
                  </Button>
                </div>
              )
            })}
            </section>
          </div>

</main>
</div>
</div>
)
}


export default function PlansAndFeesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono">
        Loading Subscription Plans...
      </div>
    }>
      <PlansContent />
    </Suspense>
  );
}