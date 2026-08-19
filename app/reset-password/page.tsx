"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Eye, EyeOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [mounted, setMounted] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    setMounted(true)
    if (searchParams) {
      setToken(searchParams.get('token'))
      setEmail(searchParams.get('email'))
    }
  }, [searchParams])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-xs">
        Initializing secure session...
      </div>
    )
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-slate-900 border border-red-900/50 p-8 rounded-3xl text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-slate-400 text-sm mb-6">The password reset link is invalid or missing required parameters.</p>
          <Link href="/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">Return to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password. Link may be expired.")
      }

      setSuccess("Password successfully reset! Redirecting to login...")
      
      setTimeout(() => {
        router.push("/login")
      }, 2500)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-900/50 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-slate-900 dark:text-white">
        
        <Link href="/login" className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white transition-all">
          <X className="w-5 h-5" />
        </Link>
          
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Create New Password</h2>
        <p className="text-slate-400 text-xs text-center mb-8">
          Enter a new secure password for <strong>{email}</strong>.
        </p>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-6 text-xs text-center">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-3 rounded-xl mb-6 text-xs text-center">{success}</div>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading || !!success}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || !!success}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !!success} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-bold mt-2">
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}