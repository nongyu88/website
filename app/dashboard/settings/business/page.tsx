"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Building, MapPin, Briefcase, Globe, Users, FileText, Camera, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BusinessSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [userEmail, setUserEmail] = useState("")

  // Form States
  const [companyName, setCompanyName] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [industry, setIndustry] = useState("")
  const [region, setRegion] = useState("")
  const [companySize, setCompanySize] = useState("1-50")
  const [taxId, setTaxId] = useState("")
  const [businessLogo, setBusinessLogo] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchBusinessData = async () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        setUserEmail(parsed.email)

        try {
          const res = await fetch(`/api/user/profile?email=${parsed.email}&t=${Date.now()}`, { cache: 'no-store' })
          const data = await res.json()
          
          if (data.user) {
            setCompanyName(data.user.company || "")
            setCompanyWebsite(data.user.website || "")
            setIndustry(data.user.industry || "")
            setRegion(data.user.region || "")
          }

          // Read domain fields directly from the nested domain object!
          if (data.user?.domain) {
            setCompanySize(data.user.domain.companySize || "1-50")
            setTaxId(data.user.domain.taxId || "")
            setBusinessLogo(data.user.domain.businessLogo || "")
          }
        } catch (error) {
          console.error("Failed to load business data", error)
        }
      }
    }
    fetchBusinessData()
  }, [])

  // Handle Logo Upload (Converts file to Base64 string for easy DB saving)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setBusinessLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Save to Database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/user/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userEmail, 
          companyName, 
          companyWebsite, 
          industry, 
          region, 
          companySize, 
          taxId,
          businessLogo
        })
      })

      if (!res.ok) throw new Error("Failed to save changes")

      setSuccessMsg("Business settings saved successfully.")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (error) {
      alert("Error saving business details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-300 font-sans transition-colors duration-300 pb-20">
      
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/settings" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Business Details</h1>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center">
          {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm">{successMsg}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* LOGO SECTION */}
          <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300 flex items-center space-x-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#1A1A1D] hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors relative overflow-hidden group shrink-0"
            >
              {businessLogo ? (
                <>
                  <img src={businessLogo} alt="Business Logo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Upload</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Company Logo</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Upload your organization's logo. Recommended size: 256x256px (Max 2MB).</p>
            </div>
            {/* Hidden file input */}
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </section>

          {/* INFORMATION SECTION */}
          <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/5 pb-4">Enterprise Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Building className="w-4 h-4 mr-2" /> Company Name</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors duration-300" placeholder="e.g. Enbridge" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Globe className="w-4 h-4 mr-2" /> Company Website</label>
                <input type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors duration-300" placeholder="https://example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Primary Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none transition-colors duration-300 cursor-pointer">
                  <option value="" disabled>Select your focus...</option>
                  <option value="grid">Utility Power Grids - Transmission Network</option>
                  <option value="pipeline">Oil & Gas Pipelines</option>
                  <option value="grid">Utility Power Grids - Distribution Network (Comming soon..)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Operational Region</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none transition-colors duration-300 cursor-pointer">
                  <option value="" disabled>Select a region...</option>
                  <option value="north_america">North America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia-Pacific</option>
                  <option value="global">Global (Multinational)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><Users className="w-4 h-4 mr-2" /> Company Size</label>
                <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none transition-colors duration-300 cursor-pointer">
                  <option value="1-50">1 - 50</option>
                  <option value="51-200">51 - 200</option>
                  <option value="201-1000">201 - 1,000</option>
                  <option value="1000+">1,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2 flex items-center"><FileText className="w-4 h-4 mr-2" /> Tax ID / Registration Number</label>
                <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors duration-300" placeholder="e.g. EIN or VAT ID" />
              </div>
            </div>
          </section>
        </form>
      </main>
    </div>
  )
}