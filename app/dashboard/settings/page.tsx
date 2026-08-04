"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, User, CreditCard, Building, Shield, Bell, FileText, Activity } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-300 font-sans transition-colors duration-300 pb-20">
      
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0A0A0B] sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-white">Account Settings</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* PERSONAL SETTINGS SECTION */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Profile Card */}
            <Link href="/dashboard/settings/profile" className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block">
              <div className="flex space-x-4">
                <User className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Personal details</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Contact information, password, and your active sessions.</p>
                </div>
              </div>
            </Link>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block">
              <div className="flex space-x-4">
                <Bell className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Communication preferences</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Customize the emails and alerts you receive.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT SETTINGS SECTION */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Account settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block">
              <div className="flex space-x-4">
                <Building className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Business</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Company details, industry focus, and authorized networks.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block">
            <Link href="/dashboard/settings/security" className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block">
              <div className="flex space-x-4">
                <Shield className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Team and security</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Team members, roles, account security, and SSO.</p>
                </div>
              </div>
            </Link>
            </div>

            {/* THE BILLING/PLANS CARD */}
            <div 
              className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block"
            >
              <Link href="/dashboard/settings/plans" className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block">
              <div className="flex space-x-4">
                <CreditCard className="w-6 h-6 text-purple-500 dark:text-purple-400 shrink-0" />
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Plans and fees</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Manage your digital twin tier, billing details, and view payment history.</p>
                </div>
              </div>
            </Link>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] hover:bg-slate-100 dark:hover:bg-[#1A1A1D] transition-colors group cursor-pointer block">
              <div className="flex space-x-4">
                <FileText className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Compliance and documents</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Security compliance, enterprise agreements, and exports.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}