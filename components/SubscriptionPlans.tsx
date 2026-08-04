"use client";

import React, { useState } from 'react';
import { Check, Sparkles, Cloud, Activity, ShieldCheck, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Add the props interface
export default function SubscriptionPlans({ userEmail }: { userEmail?: string }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Pricing mapped to your $45k - $180k target
  const plans = [
    {
      id: "core",
      name: "EnergyEminence Core",
      tagline: "Get more access to AI tools to boost your monitoring capabilities",
      monthlyPrice: 4500,
      annualPrice: 3750, // $45,000 / yr
      isRecommended: true,
      features: [
        "Real-time 2D/3D Topology Visualization",
        "Base Weather Meteorological Fusion",
        "Standard SCADA Telemetry Ingestion"
      ],
      advancedFeatures: [
        { name: "Platform Subscriptions", desc: "Core access to the interactive twin" },
        { name: "Standard Support", desc: "48-hour SLA response time" }
      ]
    },
    {
      id: "pro",
      name: "EnergyEminence Pro",
      tagline: "Work smarter and react faster with expanded predictive benefits",
      monthlyPrice: 9500,
      annualPrice: 8333, // ~$100,000 / yr
      isRecommended: false,
      features: [
        "Everything in Core, plus:",
        "Physics-Informed Prediction Engine",
        "Live UAV Drone Feed Ingestion",
        "Multi-Spectrum Thermal Vision"
      ],
      advancedFeatures: [
        { name: "Digital Twins Services", desc: "Advanced physical asset modeling" },
        { name: "Data Services", desc: "Premium environmental & flood feeds" }
      ]
    },
    {
      id: "enterprise",
      name: "EnergyEminence Ultra",
      tagline: "Accelerate your workflows with highest access to Autonomous AI",
      monthlyPrice: 18000,
      annualPrice: 15000, // $180,000 / yr
      isRecommended: false,
      features: [
        "Everything in Pro, plus:",
        "Autonomous Grid/Pipeline Copilot",
        "Automated Cascade Mitigation",
        "Unlimited Edge Processing"
      ],
      advancedFeatures: [
        { name: "Professional Services", desc: "Custom API integration & engineering" },
        { name: "Dedicated Agentic AI", desc: "Private LLM deployment for your org" }
      ]
    }
  ];

  const handleCheckout = async (planId: string) => {
    if (!userEmail) {
      alert("Error: Could not identify user session.");
      return;
    }

    setLoadingPlan(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId,
          isAnnual: isAnnual,
          userEmail: userEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      // Redirect the user to the secure Stripe Checkout URL!
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to connect to billing provider.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto font-sans">
      
      {/* Header & Toggle */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Upgrade for full access to EnergyEminence™
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Cancel anytime. By subscribing, you agree to our Enterprise Terms of Service.
        </p>
        
        <div className="inline-flex items-center p-1 bg-slate-900 border border-slate-700 rounded-full">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${!isAnnual ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${isAnnual ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Annual
          </button>
        </div>
        {isAnnual && <p className="text-emerald-400 text-xs font-semibold mt-3">Save up to 16% when you pay annually</p>}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative flex flex-col bg-[#111827] border rounded-2xl p-6 transition-all duration-300 hover:bg-[#1f2937] ${plan.isRecommended ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-slate-700 hover:border-slate-500'}`}
          >
            {plan.isRecommended && (
              <span className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Recommended
              </span>
            )}
            
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-slate-400 text-sm mb-4 min-h-[40px]">{plan.tagline}</p>
            
            <div className="mb-6 flex items-center space-x-2 text-slate-300 text-sm font-medium">
              <Cloud className="w-4 h-4" /> <span>Enterprise SLA</span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">${(isAnnual ? plan.annualPrice : plan.monthlyPrice).toLocaleString()}</span>
              <span className="text-slate-400">/mo</span>
              <p className="text-slate-500 text-xs mt-1">Billed {isAnnual ? `annually at $${(plan.annualPrice * 12).toLocaleString()}` : 'monthly'}</p>
            </div>

            <Button 
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingPlan === plan.id}
              className={`w-full h-12 rounded-full font-bold mb-8 ${plan.isRecommended ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
            >
              {loadingPlan === plan.id ? "Connecting to Stripe..." : `Get ${plan.name}`}
            </Button>

            {/* Core Features */}
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-bold text-sm">Platform Capabilities</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <hr className="border-slate-700 mb-6" />

            {/* Advanced Features (Data/Services) */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Includes advanced services</p>
            <ul className="space-y-4">
              {plan.advancedFeatures.map((adv, i) => (
                <li key={i} className="flex items-start">
                  {i % 2 === 0 ? <Database className="w-4 h-4 text-slate-400 mr-3 mt-1 shrink-0" /> : <ShieldCheck className="w-4 h-4 text-slate-400 mr-3 mt-1 shrink-0" />}
                  <div>
                    <span className="block text-sm font-bold text-white">{adv.name}</span>
                    <span className="block text-xs text-slate-400">{adv.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            
          </div>
        ))}
      </div>
    </div>
  );
}