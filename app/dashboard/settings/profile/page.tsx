"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Building, MapPin, Briefcase, User, Globe, Mail, Bell, Camera, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  
  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null)

// Form State
const [email, setEmail] = useState("")
const [firstName, setFirstName] = useState("")
const [lastName, setLastName] = useState("")
const [company, setCompany] = useState("")
const [website, setWebsite] = useState("")
const [industry, setIndustry] = useState("")
const [region, setRegion] = useState("")
const [avatarUrl, setAvatarUrl] = useState("")

// Professional Fields State
const [position, setPosition] = useState("")
const [department, setDepartment] = useState("")
const [bio, setBio] = useState("")
const [linkedinUrl, setLinkedinUrl] = useState("")
const [timezone, setTimezone] = useState("")
const [skills, setSkills] = useState("")
const [workingHours, setWorkingHours] = useState("")
  
  // Communication State
  const [notifySecurityAlerts, setNotifySecurityAlerts] = useState(true)
  const [notifyProductUpdates, setNotifyProductUpdates] = useState(false)

// Load fresh user data directly from Azure Database on page load
useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setEmail(parsedUser.email || "")

      // Fetch fresh data directly from Azure DB
      fetch(`/api/user/profile?email=${parsedUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            const u = data.user
            setFirstName(u.firstName || "")
            setLastName(u.lastName || "")
            setCompany(u.company || "")
            setWebsite(u.website || "")
            setIndustry(u.industry || "")
            setRegion(u.region || "")
            setAvatarUrl(u.avatarUrl || "")
            
            // Populate Professional Fields
            setPosition(u.position || "")
            setDepartment(u.department || "")
            setBio(u.bio || "")
            setLinkedinUrl(u.linkedinUrl || "")
            setTimezone(u.timezone || "")
            setSkills(u.skills || "")
            setWorkingHours(u.workingHours || "")

            setNotifySecurityAlerts(u.notifySecurityAlerts ?? true)
            setNotifyProductUpdates(u.notifyProductUpdates ?? false)

            // Update localStorage so the rest of the app stays in sync
            localStorage.setItem("user", JSON.stringify({ ...parsedUser, ...u }))
          }
        })
        .catch((err) => console.error("Error loading user profile:", err))
    }
  }, [])

// Handle local preview and Azure Upload
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Show an immediate local preview so the app feels fast
    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl);

    // 2. Prepare the file for upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 3. Send it to our new Azure upload route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Swap the local preview URL for the permanent Azure URL!
        setAvatarUrl(data.url);
      } else {
        setErrorMsg(data.error || "Failed to upload image to cloud storage.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error during upload.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, firstName, lastName, company, website, industry, region, avatarUrl, 
          notifySecurityAlerts, notifyProductUpdates,
          position, department, bio, linkedinUrl, timezone, skills, workingHours
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to update profile")

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...data.user }))

      setSuccessMsg("Settings saved successfully.")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (error: any) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-300 font-sans transition-colors duration-300 pb-20">
      
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0A0A0B] sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/settings" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-white">Profile & Preferences</h1>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center"
        >
          {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">{errorMsg}</div>}
        {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-sm">{successMsg}</div>}

        <form id="settings-form" onSubmit={handleSave} className="space-y-8">
          
          {/* SECTION 1: PERSONAL IDENTITY & AVATAR */}
          <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/5 pb-4">Personal Information</h2>
            
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              {/* Avatar Uploader */}
              <div className="flex flex-col items-center space-y-4">
              <div 
                  className="relative w-28 h-28 rounded-full border border-white/20 bg-[#1A1A1D] flex items-center justify-center overflow-hidden group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarUrl && avatarUrl.startsWith("http") ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                      onError={() => setAvatarUrl("")} // Reverts to icon if link breaks
                    />
                  ) : (
                    <User className="w-10 h-10 text-slate-500" />
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase">Upload</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </div>

              {/* Name Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Mail className="w-4 h-4 mr-2" /> Account Email (Locked)</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors cursor-not-allowed"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Position / Title</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g. Senior Grid Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g. Infrastructure & Operations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none transition-colors"
                >
                  <option value="" disabled>Select primary timezone...</option>
                  <option value="America/New_York">Eastern Time (EST / UTC-5)</option>
                  <option value="America/Chicago">Central Time (CST / UTC-6)</option>
                  <option value="America/Denver">Mountain Time (MST / UTC-7)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST / UTC-8)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT / UTC+0)</option>
                  <option value="Europe/Berlin">Central European Time (CET / UTC+1)</option>
                  <option value="Asia/Hong_Kong">Hong Kong Time (HKT / UTC+8)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g. 9:00 AM - 5:00 PM EST"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Skills & Specialties</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g. SCADA Systems, Python, Azure"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Professional Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Brief overview of your background and technical experience..."
                />
              </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: COMPANY DETAILS */}
          {/* <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/5 pb-4">Enterprise Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Building className="w-4 h-4 mr-2" /> Company Name *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="e.g. Enbridge"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Globe className="w-4 h-4 mr-2" /> Company Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Primary Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none transition-colors"
                >
                  <option value="" disabled>Select your focus...</option>
                  <option value="grid">Utility Power Grids</option>
                  <option value="pipeline">Oil & Gas Pipelines</option>
                  <option value="both">Both (Enterprise Convergence)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Operational Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none transition-colors"
                >
                  <option value="" disabled>Select a region...</option>
                  <option value="north_america">North America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia-Pacific</option>
                  <option value="global">Global (Multinational)</option>
                </select>
              </div>
            </div>
          </section> */}

          {/* SECTION 3: COMMUNICATION PREFS */}
          {/* <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/5 pb-4">Communication Preferences</h2>
            
            <div className="space-y-6">
              <label className="flex items-start space-x-4 cursor-pointer group">
                <div className="flex items-center h-6">
                  <input 
                    type="checkbox" 
                    checked={notifySecurityAlerts}
                    onChange={(e) => setNotifySecurityAlerts(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-[#0A0A0B] text-purple-600 focus:ring-purple-500 focus:ring-offset-[#111113]"
                  />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-white font-medium flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-emerald-400" /> Critical Security & Infrastructure Alerts</span>
                  <p className="text-sm text-slate-500 mt-1">Receive immediate emails for critical cascade warnings, anomalies, or system downtime.</p>
                </div>
              </label>

              <label className="flex items-start space-x-4 cursor-pointer group">
                <div className="flex items-center h-6">
                  <input 
                    type="checkbox" 
                    checked={notifyProductUpdates}
                    onChange={(e) => setNotifyProductUpdates(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-[#0A0A0B] text-purple-600 focus:ring-purple-500 focus:ring-offset-[#111113]"
                  />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-white font-medium flex items-center"><Bell className="w-4 h-4 mr-2 text-blue-400" /> Product Updates & Reports</span>
                  <p className="text-sm text-slate-500 mt-1">Receive monthly digest reports on your Digital Twin usage and new platform features.</p>
                </div>
              </label>
            </div>
          </section> */}

        </form>
      </main>
    </div>
  )
}