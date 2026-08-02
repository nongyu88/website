"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Form Fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")

  // State Management
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  useEffect(() => {
    // 1. Grab the token and the time the user logged in
    const token = localStorage.getItem("kraftgene_token");
    const loginTime = localStorage.getItem("login_timestamp");

    if (token && loginTime) {
      const timeElapsed = Date.now() - parseInt(loginTime);
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

      // 2. If they are within the 15-minute window, bounce them to the dashboard
      if (timeElapsed < fifteenMinutes) {
        router.push("/dashboard");
      } else {
        // 3. If 15 minutes have passed, clear the stale session so they must log in again
        localStorage.removeItem("kraftgene_token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_timestamp");
      }
    }
  }, [router]);

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      // Safely check if the response is JSON before parsing
      const isJson = res.headers.get("content-type")?.includes("application/json")
      const data = isJson ? await res.json() : null

      if (!res.ok) {
        throw new Error(data?.error || `Server error: received status ${res.status}.`)
      }

      // Store signed JWT token & user session
      localStorage.setItem("kraftgene_token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      localStorage.setItem("login_timestamp", Date.now().toString());

      // Redirect to authorized dashboard
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle Registration Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, company }),
      })

      // Safely check if the response is JSON before parsing
      const isJson = res.headers.get("content-type")?.includes("application/json")
      const data = isJson ? await res.json() : null

      if (!res.ok) {
        throw new Error(data?.error || `Server error: received status ${res.status}. Ensure the API route exists.`)
      }

      // Change this line:
      setSuccess("Registration received! Your account is pending staff review. You will be able to log in once approved.")
      setIsRegistering(false) // Switch back to login form
      setPassword("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="bg-slate-900 border border-emerald-900/50 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {isRegistering ? "Request Enterprise Access" : "Client Portal Login"}
        </h2>
        <p className="text-slate-400 text-xs text-center mb-8">
          {isRegistering 
            ? "Register your enterprise credentials to access digital twins." 
            : "Sign in with your registered enterprise email."}
        </p>

        {/* Notifications */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl mb-6 text-xs text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-3 rounded-xl mb-6 text-xs text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          
          {isRegistering && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Pacific Gas & Electric"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Enterprise Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/30 mt-2"
          >
            {loading ? "Processing..." : isRegistering ? "Register Account" : "Secure Login"}
          </Button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            {isRegistering ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError("")
                setSuccess("")
              }}
              className="text-emerald-400 hover:underline font-semibold ml-1"
            >
              {isRegistering ? "Sign In" : "Register Here"}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}