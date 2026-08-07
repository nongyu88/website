"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CommunicationsPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("account")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "light") setIsDarkMode(false)
  }, [])

  const tabs = [
    { id: "account", label: "Account" },
    { id: "transactions", label: "Transactions and Balances" },
    { id: "api", label: "API" },
    { id: "connected", label: "Connected accounts" },
    { id: "stripe", label: "Stripe updates" },
  ]

  const notificationGroups = [
    {
      title: "Account risk and compliance",
      items: [
      ]
    },
    {
      title: "Account updates",
      items: [
      ]
    },
    {
      title: "Team management",
      items: [
      ]
    }
  ]

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-300 font-sans pb-20 transition-colors duration-300">
        
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] sticky top-0 z-50 px-6 py-4 flex items-center space-x-4">
          <Link href="/dashboard/settings" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Communication preferences</h1>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">

          {/* Dynamic Clickable Tabs */}
          <div className="flex space-x-6 border-b border-slate-200 dark:border-white/10 mb-8 text-sm font-bold overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-500"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "account" ? (
            <div className="space-y-10">
              {notificationGroups.map((group, gIdx) => (
                <div key={gIdx}>
                  <div className="flex justify-between items-end mb-4 px-2">
                    <h2 className="text-slate-900 dark:text-white font-bold text-[15px]">{group.title}</h2>
                    <div className="flex space-x-6 text-[11px] font-bold text-slate-900 dark:text-white tracking-wide">
                      <span className="w-8 text-center">Email</span>
                      <span className="w-8 text-center">SMS</span>
                      <span className="w-8 text-center">Push</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/10">
                    {group.items.map((item, iIdx) => (
                      <label key={iIdx} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.02] px-2 transition-colors cursor-pointer">
                        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 select-none">{item}</span>
                        <div className="flex space-x-6">
                          <div className="w-8 flex justify-center">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 dark:border-white/20 cursor-pointer accent-purple-600 dark:accent-purple-500" />
                          </div>
                          <div className="w-8 flex justify-center">
                            <input type="checkbox" disabled className="w-4 h-4 rounded opacity-40 cursor-not-allowed" />
                          </div>
                          <div className="w-8 flex justify-center">
                            <input type="checkbox" disabled className="w-4 h-4 rounded opacity-40 cursor-not-allowed" />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#111113] text-slate-500">
              No preferences configured for <span className="font-semibold text-slate-700 dark:text-slate-300">{tabs.find(t => t.id === activeTab)?.label}</span> yet.
            </div>
          )}
        </main>
      </div>
    </div>
  )
}