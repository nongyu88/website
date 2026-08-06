"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"

export function SessionGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const isAlerting = useRef(false) // 1. ADD THIS LOCK

  useEffect(() => {
    if (pathname === '/login') return;

    const verifySession = async () => {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return

      try {
        const email = JSON.parse(storedUser)?.email
        if (!email) return

        const res = await fetch(`/api/auth/me?email=${encodeURIComponent(email)}`)
        
        if (!res.ok) {
          localStorage.removeItem("kraftgene_token")
          localStorage.removeItem("login_timestamp")
          localStorage.removeItem("user")

          // 2. ONLY SHOW ALERT IF WE HAVEN'T ALREADY
          if (!isAlerting.current) {
            isAlerting.current = true
            alert("Your session has ended or your account access was suspended by an admin.")
            router.push("/login")
            
            // Unlock after a few seconds in case they log back in normally
            setTimeout(() => { isAlerting.current = false }, 3000)
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

  return null
}