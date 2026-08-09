"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Key, Users, UserPlus, Lock, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SecuritySettingsPage() {
  const [userEmail, setUserEmail] = useState("")
  
  // Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false)

  const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false)
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false)

  // 2FA Setup State
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)
  const [twoFactorMsg, setTwoFactorMsg] = useState({ type: "", text: "" })
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [is2FAStatusLoading, setIs2FAStatusLoading] = useState(true)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" })

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Viewer")
  const [inviteLoading, setInviteLoading] = useState(false) // <-- NEW
  const [inviteMsg, setInviteMsg] = useState({ type: "", text: "" }) // <-- NEW

  const [position, setPosition] = useState("")
  const [department, setDepartment] = useState("")
  const [bio, setBio] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [timezone, setTimezone] = useState("")
  const [skills, setSkills] = useState("")
  const [workingHours, setWorkingHours] = useState("")

  // 1. Add the state at the top of your component
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Close modals when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIs2FAModalOpen(false);
        setIsPasswordModalOpen(false);
        setIsInviteModalOpen(false);
        setIsDisable2FAModalOpen(false);
        setIsSSOModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
  // Sync with your main dashboard's theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") setIsDarkMode(false)
  // ... rest of your existing useEffect code
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const email = JSON.parse(storedUser).email || ""
      setUserEmail(email)

      // Fetch fresh 2FA status from database on page load
      fetch(`/api/user/profile?email=${email}`)
        .then(res => res.json())
        .then(data => {
          if (data.user?.isTwoFactorEnabled) {
            setIs2FAEnabled(true)
          }
        })
        .catch(err => console.error("Error fetching 2FA status:", err))
        .finally(() => setIs2FAStatusLoading(false))
    } else {
      setIs2FAStatusLoading(false)
    }
  }, [])

// Real Team Data State
const [teamMembers, setTeamMembers] = useState<any[]>([])
const [currentUserRole, setCurrentUserRole] = useState("Viewer")
const [loadingTeam, setLoadingTeam] = useState(true)

const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
const [memberToRemove, setMemberToRemove] = useState<string | null>(null)

// Fetch the current user and their team on load
useEffect(() => {
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser)
    setUserEmail(parsedUser.email || "")
    setCurrentUserRole(parsedUser.role || "Viewer")
    
    // Fetch the actual team from the database
    fetch(`/api/team?email=${parsedUser.email}`)
    .then(res => res.json())
    .then(data => {
      if (data.members) {
        setTeamMembers(data.members)
        
        // --- NEW LOGIC: Sync the logged-in user's role from the fresh DB data ---
        const me = data.members.find((m: any) => m.email === parsedUser.email)
        if (me && me.role !== parsedUser.role) {
          setCurrentUserRole(me.role)
          // Update local storage so the rest of the app knows they are now an Owner
          localStorage.setItem("user", JSON.stringify({ ...parsedUser, role: me.role }))
        }
      }
      setLoadingTeam(false)
    })
    .catch(err => {
      console.error(err)
      setLoadingTeam(false)
    })
  }
}, [])

// Function to handle role changes
const handleRoleChange = async (targetUserId: string, newRole: string) => {
  try {
    const res = await fetch('/api/team', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterEmail: userEmail, targetUserId, newRole })
    });
    
    if (!res.ok) throw new Error("Failed to update role");
    
    // Update local state to reflect the change immediately
    setTeamMembers(prev => prev.map(member => 
      member.id === targetUserId ? { ...member, role: newRole } : member
    ));
  } catch (error) {
    alert("Error updating role. You might not have permission.");
  }
};

const handleRemoveMember = async (targetEmail: string) => {
  if (confirm(`Are you sure you want to remove ${targetEmail} from the team?`)) {
    try {
      const res = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterEmail: userEmail, targetEmail })
      });
      
      if (!res.ok) throw new Error("Failed to remove member");
      
      // Instantly remove them from the UI
      setTeamMembers(prev => prev.filter(m => m.email !== targetEmail));
    } catch (error) {
      alert("Error removing user. You may not have permission.");
    }
  }
};

const confirmRemoveMember = async () => {
  if (!memberToRemove) return;
  
  try {
    const res = await fetch('/api/team', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterEmail: userEmail, targetEmail: memberToRemove })
    });
    
    if (!res.ok) throw new Error("Failed to remove member");
    
    setTeamMembers(prev => prev.filter(m => m.email !== memberToRemove));
    setIsRemoveModalOpen(false);
    setMemberToRemove(null);
  } catch (error) {
    alert("Error removing user. You may not have permission.");
  }
};

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordMsg({ type: "", text: "" })

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, currentPassword, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      
      setPasswordMsg({ type: "success", text: "Password updated successfully!" })
      setTimeout(() => {
        setIsPasswordModalOpen(false)
        setCurrentPassword("")
        setNewPassword("")
        setPasswordMsg({ type: "", text: "" })
      }, 2000)
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.message })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)
    setInviteMsg({ type: "", text: "" })

    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviterEmail: userEmail,
          inviteeEmail: inviteEmail,
          role: inviteRole
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation.")
      }

      setInviteMsg({ type: "success", text: `Invitation sent to ${inviteEmail}!` })
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsInviteModalOpen(false)
        setInviteEmail("")
        setInviteRole("Viewer")
        setInviteMsg({ type: "", text: "" })
      }, 2000)

    } catch (error: any) {
      setInviteMsg({ type: "error", text: error.message })
    } finally {
      setInviteLoading(false)
    }
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-700 dark:text-slate-300 font-sans selection:bg-purple-500/30 pb-20 relative transition-colors duration-300">
        
        {/* Top Header */}
        <header className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] sticky top-0 z-40 px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/settings" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Team and security</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          
          {/* SECTION 1: ACCOUNT SECURITY */}
          <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
              <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Security</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 dark:border-white/5 rounded-lg bg-slate-50 dark:bg-[#0A0A0B] transition-colors duration-300">
                <div>
                  <p className="text-slate-900 dark:text-white font-medium flex items-center"><Key className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" /> Password</p>
                  <p className="text-sm text-slate-500 mt-1">Change the password used to log in to your account.</p>
                </div>
                <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline" className="mt-4 md:mt-0 border-slate-200 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10">
                  Update Password
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 dark:border-white/5 rounded-lg bg-slate-50 dark:bg-[#0A0A0B] transition-colors duration-300">
                <div>
                  <p className="text-slate-900 dark:text-white font-medium flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" /> Two-step verification
                    {is2FAEnabled && (
                      <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        Active
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account using an authenticator app.</p>
                </div>

                {is2FAStatusLoading ? (
                  <Button 
                    disabled 
                    variant="outline" 
                    className="mt-4 md:mt-0 border-slate-200/50 dark:border-white/10 text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed"
                  >
                    Loading 2FA...
                  </Button>
                ) : is2FAEnabled ? (
                  <Button 
                    onClick={() => setIsDisable2FAModalOpen(true)} 
                    variant="outline" 
                    className="mt-4 md:mt-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Disable 2FA
                  </Button>
                ) : (
                  <Button 
                    onClick={async () => {
                      setIs2FAModalOpen(true);
                      setTwoFactorLoading(true);
                      try {
                        const res = await fetch('/api/auth/2fa/setup', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: userEmail })
                        });
                        const data = await res.json();
                        if (data.qrCodeUrl) setQrCodeUrl(data.qrCodeUrl);
                      } catch (e) {
                        setTwoFactorMsg({ type: "error", text: "Failed to load QR code." });
                      } finally {
                        setTwoFactorLoading(false);
                      }
                    }} 
                    variant="outline" 
                    className="mt-4 md:mt-0 border-slate-200 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    Enable 2FA
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: TEAM MANAGEMENT */}
          <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Team Members</h2>
              </div>
              <Button onClick={() => setIsInviteModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white flex items-center h-9">
                <UserPlus className="w-4 h-4 mr-2" /> Invite
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-sm text-slate-500">
                    <th className="py-3 font-medium">User</th>
                    <th className="py-3 font-medium">Role</th>
                    <th className="py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loadingTeam ? (
                    <tr><td colSpan={3} className="py-4 text-slate-500 text-center">Loading team members...</td></tr>
                  ) : teamMembers.length === 0 ? (
                    <tr><td colSpan={3} className="py-4 text-slate-500 text-center">No other team members found.</td></tr>
                  ) : (
                    teamMembers.map((member) => (
                      <tr key={member.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1A1A1D] transition-colors">
                        <td className="py-4">
                          <p className="text-slate-900 dark:text-white font-medium">{member.firstName ? `${member.firstName} ${member.lastName}` : "User"}</p>
                          <p className="text-slate-500 text-xs">{member.email}</p>
                        </td>
                        <td className="py-4">
                          {currentUserRole === "Owner" || currentUserRole === "Admin" ? (
                             <select 
                             value={member.role}
                             onChange={(e) => handleRoleChange(member.id, e.target.value)}
                             disabled={member.email === userEmail}
                             className="bg-transparent border border-slate-300 dark:border-white/10 rounded-md text-slate-900 dark:text-slate-300 text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 appearance-none cursor-pointer"
                           >
                             <option value="Viewer" className="bg-white dark:bg-[#111113] text-slate-900 dark:text-white">Viewer</option>
                             <option value="Admin" className="bg-white dark:bg-[#111113] text-slate-900 dark:text-white">Admin</option>
                             <option value="Owner" className="bg-white dark:bg-[#111113] text-slate-900 dark:text-white">Owner</option>
                           </select>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                              {member.role}
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          {(currentUserRole === "Owner" || currentUserRole === "Admin") && member.email !== userEmail && (
                             <button 
                             onClick={() => {
                               setMemberToRemove(member.email);
                               setIsRemoveModalOpen(true);
                             }}
                             className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-xs font-medium"
                           >
                             Remove
                           </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 3: SINGLE SIGN-ON (SSO) */}
          <section className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
              <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise SSO</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Configure Single Sign-On (SAML/OIDC) for your organization. This feature requires an active Enterprise subscription.
            </p>
            <Button 
              onClick={() => setIsSSOModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-md shadow-purple-900/20"
            >
              Configure SSO
            </Button>
          </section>

        </main>

        {/* --- MODALS --- */}
        
        {/* Update Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <button onClick={() => setIsPasswordModalOpen(false)} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Update Password</h3>
              
              {passwordMsg.text && (
                <div className={`p-3 rounded-lg text-sm mb-4 border ${passwordMsg.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400'}`}>
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Current Password</label>
                  <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={passwordLoading} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none disabled:opacity-50 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">New Password</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={passwordLoading} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none disabled:opacity-50 transition-colors" />
                </div>
                <Button type="submit" disabled={passwordLoading} className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-4">
                  {passwordLoading ? "Updating..." : "Save Password"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Remove User Confirmation Modal */}
        {isRemoveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Remove Team Member</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Are you sure you want to remove <span className="font-bold text-slate-700 dark:text-slate-300">{memberToRemove}</span> from the team? They will lose all access to this organization.
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsRemoveModalOpen(false)} className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                  Cancel
                </Button>
                <Button onClick={confirmRemoveMember} className="bg-red-600 hover:bg-red-500 text-white">
                  Remove User
                </Button>
              </div>
            </div>
          </div>
        )}


        {/* 2FA Setup Modal */}
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <button onClick={() => setIs2FAModalOpen(false)} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Setup 2FA Authenticator</h3>
              <p className="text-xs text-slate-500 mb-4">Scan the QR code with Google Authenticator or Authy, then enter the 6-digit code.</p>
              
              {twoFactorMsg.text && (
                <div className={`p-3 rounded-lg text-sm mb-4 border ${twoFactorMsg.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400'}`}>
                  {twoFactorMsg.text}
                </div>
              )}

              <div className="flex justify-center mb-4">
                {twoFactorLoading ? (
                  <p className="text-xs text-slate-500 py-8">Generating QR Code...</p>
                ) : (
                  qrCodeUrl && <img src={qrCodeUrl} alt="2FA QR Code" className="w-44 h-44 rounded-lg border border-white/10" />
                )}
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setTwoFactorLoading(true);
                setTwoFactorMsg({ type: "", text: "" });

                try {
                  const res = await fetch('/api/auth/2fa/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, token: twoFactorCode })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);

                  setIs2FAEnabled(true);
                  setTwoFactorMsg({ type: "success", text: "2FA successfully enabled!" });
                  setTimeout(() => {
                    setIs2FAModalOpen(false);
                    setTwoFactorCode("");
                    setTwoFactorMsg({ type: "", text: "" });
                  }, 2000);
                } catch (err: any) {
                  setTwoFactorMsg({ type: "error", text: err.message });
                } finally {
                  setTwoFactorLoading(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Authenticator Code</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6} 
                    value={twoFactorCode} 
                    onChange={(e) => setTwoFactorCode(e.target.value)} 
                    placeholder="123456" 
                    className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-center text-lg font-mono tracking-widest text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                <Button type="submit" disabled={twoFactorLoading || twoFactorCode.length < 6} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                  {twoFactorLoading ? "Verifying..." : "Verify & Enable 2FA"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Disable 2FA Confirmation Modal */}
        {isDisable2FAModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Disable 2FA</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Are you sure you want to disable Two-Factor Authentication? This will remove the extra layer of security from your account.
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDisable2FAModalOpen(false)} className="border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5">
                  Cancel
                </Button>
                <Button 
                  disabled={twoFactorLoading}
                  onClick={async () => {
                    setTwoFactorLoading(true);
                    try {
                      await fetch('/api/user/profile', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userEmail, isTwoFactorEnabled: false })
                      });
                      setIs2FAEnabled(false);
                      setIsDisable2FAModalOpen(false);
                    } catch (error) {
                      console.error("Failed to disable 2FA", error);
                    } finally {
                      setTwoFactorLoading(false);
                    }
                  }} 
                  className="bg-red-600 hover:bg-red-500 text-white"
                >
                  {twoFactorLoading ? "Disabling..." : "Disable 2FA"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Invite User Modal */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <button onClick={() => setIsInviteModalOpen(false)} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Invite Team Member</h3>
              
              {inviteMsg.text && (
                <div className={`p-3 rounded-lg text-sm mb-4 border ${inviteMsg.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400'}`}>
                  {inviteMsg.text}
                </div>
              )}
              
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Email Address</label>
                  <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} disabled={inviteLoading} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none disabled:opacity-50 transition-colors" placeholder="colleague@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Role</label>
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} disabled={inviteLoading} className="w-full bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none disabled:opacity-50 transition-colors cursor-pointer">
                    <option value="Viewer" className="bg-white dark:bg-[#111113] text-slate-900 dark:text-white">Viewer (Read-only)</option>
                    <option value="Admin" className="bg-white dark:bg-[#111113] text-slate-900 dark:text-white">Admin (Can edit settings)</option>
                    <option value="Owner" className="bg-white dark:bg-[#111113] text-slate-900 dark:text-white">Owner (Full access)</option>
                  </select>
                </div>
                <Button type="submit" disabled={inviteLoading} className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-4 transition-all">
                  {inviteLoading ? "Sending Invite..." : "Send Invitation"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Enterprise SSO Information Modal */}
        {isSSOModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl relative text-center">
              
              <button 
                onClick={() => setIsSSOModalOpen(false)} 
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Glowing Shield Icon Header */}
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/5">
                <Shield className="w-7 h-7 text-purple-500 dark:text-purple-400" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Enterprise SSO Integration
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Enterprise SSO (SAML/OIDC) is available on custom enterprise tiers. Contact our security engineering team at <a href="mailto:security@kraftgeneai.ca?subject=Enterprise%20SSO%20Setup%20Request" className="text-purple-500 dark:text-purple-400 font-semibold hover:underline">security@kraftgeneai.ca</a> to enable Okta, Azure AD, or Google Workspace for your organization.
              </p>

              <div className="space-y-3">
                <a
                  href="mailto:security@kraftgeneai.ca?subject=Enterprise%20SSO%20Setup%20Request"
                  className="w-full inline-flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-semibold h-11 rounded-xl transition-all shadow-md shadow-purple-900/30 text-sm"
                >
                  Contact Security Team
                </a>

                <Button 
                  variant="outline" 
                  onClick={() => setIsSSOModalOpen(false)} 
                  className="w-full border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 h-10 text-xs"
                >
                  Close
                </Button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}