"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AlertCircle } from "lucide-react"

export function SessionGuard() {
  const router = useRouter()
  const pathname = usePathname()
  
  // State to control our custom modal UI
  const [showExpiredModal, setShowExpiredModal] = useState(false)
  const isAlerting = useRef(false)

  useEffect(() => {
    // Don't check on the login page itself
    if (pathname === '/login') return;

    const verifySession = async () => {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return

      try {
        const email = JSON.parse(storedUser)?.email
        if (!email) return

        const res = await fetch(`/api/auth/me?email=${encodeURIComponent(email)}`)
        
        if (!res.ok) {
          // Clear local storage to fully log them out
          localStorage.removeItem("kraftgene_token")
          localStorage.removeItem("login_timestamp")
          localStorage.removeItem("user")

          // Trigger our custom UI instead of the ugly browser alert
          if (!isAlerting.current) {
            isAlerting.current = true
            setShowExpiredModal(true)
          }
        }
      } catch (err) {
        console.error("Session verification failed", err)
      }
    }

    verifySession()
    const interval = setInterval(verifySession, 15000)
    
    return () => clearInterval(interval)
  }, [router, pathname])

  const handleReLogin = () => {
    setShowExpiredModal(false)
    isAlerting.current = false
    router.push("/login")
  }

  // If session is valid, render nothing (invisible guard)
  if (!showExpiredModal) return null

  // If session expired, render the full-screen modal
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0B]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-sm p-6 md:p-8 shadow-2xl text-center">
        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
          <AlertCircle className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Session Expired</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          For your security, your session has ended. Please log in again to continue accessing the enterprise portal.
        </p>
        <button 
          onClick={handleReLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg"
        >
          Return to Login
        </button>
      </div>
    </div>
  )
}