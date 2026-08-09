"use client"

import { useState, useEffect } from "react"
import { Shield, Trash2, Edit, CheckCircle, XCircle, X, UserPlus, Info, User as UserIcon } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Provision User Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [addEmail, setAddEmail] = useState("")
  const [addPassword, setAddPassword] = useState("")
  const [addCompany, setAddCompany] = useState("")
  const [addRole, setAddRole] = useState("Owner")

  // Edit / Detailed View Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [editCompany, setEditCompany] = useState("")
  const [editRole, setEditRole] = useState("")
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Close modals when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingUser(null);
        setShowAddModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Manual User Provisioning
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addEmail, password: addPassword, company: addCompany, role: addRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      
      setUsers([data.user, ...users]); // Add to top of list
      setShowAddModal(false);
      setAddEmail(""); setAddPassword(""); setAddCompany(""); setAddRole("Owner");
      alert("User provisioned and approved successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }

  // Handle 1-Click Approve
  const handleToggleApproval = async (user: any) => {
    const isApproving = !user.isApproved;
    if (isApproving && !window.confirm(`Approve access for ${user.company} and send welcome email?`)) return;
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          isApproved: isApproving, 
          sendApprovalEmail: isApproving // Only email if turning ON
        })
      });
      if (!res.ok) throw new Error("Update failed");
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isApproved: isApproving } : u));
    } catch (error) {
      alert("Error updating approval status.");
    }
  }

  // Handle Delete
  const handleDelete = async (userId: string, company: string) => {
    if (!window.confirm(`CRITICAL: Are you absolutely sure you want to permanently delete ${company}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      alert("Error deleting user.");
    }
  }

  // Handle Edit Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: editingUser.id, 
          company: editCompany, 
          role: editRole,
          firstName: editFirstName,
          lastName: editLastName,
          isApproved: editingUser.isApproved 
        })
      });
      if (!res.ok) throw new Error("Update failed");
      
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, company: editCompany, role: editRole, firstName: editFirstName, lastName: editLastName } : u));
      setEditingUser(null);
    } catch (error) {
      alert("Error updating user details.");
    }
  }

  // Universal parser that handles stringified JSON, double-escaped strings, and key variations
  const getParsedPlans = (plansData: any) => {
    if (!plansData) return [];
    
    let parsed = plansData;

    // 1. Handle double-escaped JSON strings from SQL Server
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed); // Parse second time if double-encoded
        }
      } catch (e) {
        return [];
      }
    }

    if (!Array.isArray(parsed)) return [];

    // 2. Normalize every item into a standardized { name, interval } object
    return parsed.map((item: any) => {
      if (typeof item === 'string') {
        // Try extracting interval from strings like "Pipeline Twin (Monthly)", "Pipeline Twin - Annually", etc.
        const match = item.match(/[\(\-\|]\s*(Monthly|Annually|month|year|annual|monthly|annually)\s*[\)]?/i);
        const extractedInterval = match ? match[1] : null;
        const cleanName = item.replace(/[\(\-\|]\s*(Monthly|Annually|month|year|annual|monthly|annually)\s*[\)]?/i, '').replace(/Tier/i, '').trim();

        return {
          name: cleanName || item,
          interval: extractedInterval ? (extractedInterval.toLowerCase().includes('year') || extractedInterval.toLowerCase().includes('annual') ? 'Annually' : 'Monthly') : null
        };
      }

      if (typeof item === 'object' && item !== null) {
        // Check all possible key names used for plan name and interval
        const name = item.name || item.title || item.plan || item.planName || item.id || "Digital Twin Plan";
        const rawInterval = item.interval || item.billingCycle || item.period || item.cycle || item.billing || item.type || "";
        
        let intervalDisplay = null;
        if (rawInterval) {
          intervalDisplay = (rawInterval.toLowerCase().includes('year') || rawInterval.toLowerCase().includes('annual')) ? 'Annually' : 'Monthly';
        }

        return { name, interval: intervalDisplay };
      }

      return { name: String(item), interval: null };
    });
  };

  // Helper to find teammates
  const getTeammates = (userEmail: string, userId: string) => {
    const domain = userEmail.split('@')[1];
    if (!domain) return [];
    return users.filter(u => u.id !== userId && u.email.endsWith(`@${domain}`));
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-white/10 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">Admin / User Management</h1>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
          >
            <UserPlus className="w-4 h-4" /> Provision User
          </button>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading database...</p>
        ) : (
          <div className="bg-[#111113] border border-white/10 rounded-xl overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-sm text-slate-500 bg-black/20">
                  <th className="py-4 px-6 font-medium">Company / User</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium text-center">Status</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-white font-bold text-base">{user.company}</p>
                      <p className="text-slate-500 text-xs mt-1">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                        {user.role || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => handleToggleApproval(user)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${user.isApproved ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 animate-pulse'}`}
                      >
                        {user.isApproved ? <><CheckCircle className="w-3.5 h-3.5"/> Approved</> : <><XCircle className="w-3.5 h-3.5"/> Pending</>}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                    <button 
                        onClick={() => { 
                          setEditingUser(user); 
                          setEditCompany(user.company || ''); 
                          setEditRole(user.role || 'Viewer'); 
                          setEditFirstName(user.firstName || ''); 
                          setEditLastName(user.lastName || ''); 
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                        title="Detailed Profile & Edit"
                      >
                        <Info className="w-4 h-4 inline" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.company)}
                        className="text-red-500 hover:text-red-400 transition-colors p-1"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Provision Enterprise User</h3>
            <p className="text-xs text-slate-500 mb-6">Create an auto-verified, pre-approved account.</p>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                <input type="text" required value={addCompany} onChange={(e) => setAddCompany(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">User Email</label>
                <input type="email" required value={addEmail} onChange={(e) => setAddEmail(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Temporary Password</label>
                <input type="password" required value={addPassword} onChange={(e) => setAddPassword(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">System Role</label>
                <select value={addRole} onChange={(e) => setAddRole(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer">
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg mt-4 transition-all">
                Provision Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-20 pb-20">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Enterprise Profile</h3>
            
            {/* Quick Edit Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 mb-6">
              
              {/* Profile Photo Display */}
              <div className="flex items-center gap-4 bg-[#0A0A0B] p-3 rounded-xl border border-white/5">
                <div className="w-14 h-14 rounded-full border border-white/20 bg-[#1A1A1D] flex items-center justify-center overflow-hidden shrink-0">
                  {editingUser.avatarUrl && editingUser.avatarUrl.startsWith("http") ? (
                    <img 
                      src={editingUser.avatarUrl} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {editingUser.firstName || editingUser.lastName ? `${editingUser.firstName || ''} ${editingUser.lastName || ''}`.trim() : "No Display Name Set"}
                  </p>
                  <p className="text-xs text-slate-500">{editingUser.email}</p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">First Name</label>
                  <input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} placeholder="e.g. John" className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
                  <input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} placeholder="e.g. Doe" className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
              </div>

              {/* Company & Role Fields */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                  <input type="text" required value={editCompany} onChange={(e) => setEditCompany(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">System Role</label>
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer">
                    <option value="Viewer">Viewer</option>
                    <option value="Admin">Admin</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-all text-sm">
                Update Primary Info
              </button>
            </form>

            <div className="border-t border-white/10 pt-6 space-y-6">
              {/* Detailed Read-Only Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Audit & Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Audit & Timeline</h4>
                  <div className="bg-[#0A0A0B] border border-white/5 rounded-lg p-3 space-y-2 text-sm h-full">
                    <p><span className="text-slate-500 w-28 inline-block">Email:</span> <span className="text-white font-medium">{editingUser.email}</span></p>
                    <p><span className="text-slate-500 w-28 inline-block">Stripe ID:</span> <span className="text-white font-medium font-mono">{editingUser.stripeCustomerId || "None"}</span></p>
                    <p><span className="text-slate-500 w-28 inline-block">Created At:</span> <span className="text-white font-medium">{editingUser.createdAt ? new Date(editingUser.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }) + ' (CST)' : "N/A"}</span></p>
                    <p><span className="text-slate-500 w-28 inline-block">Last Active:</span> <span className="text-white font-medium">{editingUser.lastLoginAt ? new Date(editingUser.lastLoginAt).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }) + ' (CST)' : "Never logged in"}</span></p>
                    <p><span className="text-slate-500 w-28 inline-block">Onboarded:</span> <span className="text-emerald-400 font-medium">{editingUser.hasCompletedOnboarding ? "Yes" : "No"}</span></p>
                  </div>
                </div>

                {/* Professional Demographics */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Demographics</h4>
                  <div className="bg-[#0A0A0B] border border-white/5 rounded-lg p-3 space-y-2 text-sm h-full">
                    <p><span className="text-slate-500 w-24 inline-block">Industry:</span> <span className="text-white font-medium capitalize">{editingUser.industry || "Not Provided"}</span></p>
                    <p><span className="text-slate-500 w-24 inline-block">Region:</span> <span className="text-white font-medium capitalize">{editingUser.region?.replace('_', ' ') || "Not Provided"}</span></p>
                    <p><span className="text-slate-500 w-24 inline-block">Department:</span> <span className="text-white font-medium">{editingUser.department || "Not Provided"}</span></p>
                    <p><span className="text-slate-500 w-24 inline-block">Position:</span> <span className="text-white font-medium">{editingUser.position || "Not Provided"}</span></p>
                  </div>
                </div>

              </div>

{/* Digital Twins & Plans */}
<div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Active Subscriptions</h4>
                <div className="bg-[#0A0A0B] border border-white/5 rounded-lg p-3 text-sm">
                  {getParsedPlans(editingUser.activePlans).length > 0 ? (
                    <ul className="space-y-1.5">
                    {getParsedPlans(editingUser.activePlans).map((plan: any, idx: number) => {
                      let planName = typeof plan === 'string' ? plan : (plan.name || plan.title || "Digital Twin Plan");
                      let interval: string | null = null;

                      // 1. If plan is an object containing an interval property
                      if (typeof plan === 'object' && plan !== null) {
                        const rawInt = plan.interval || plan.period || plan.billingCycle || plan.type || "";
                        if (rawInt) {
                          interval = (rawInt.toLowerCase().includes('year') || rawInt.toLowerCase().includes('annual')) ? 'Annually' : 'Monthly';
                        }
                      }

                      // 2. If interval wasn't in object, check if it's in the text (e.g. "Pipeline Twin (Monthly)")
                      if (!interval && typeof planName === 'string') {
                        const match = planName.match(/\((Monthly|Annually|month|year|annual|monthly|annually)\)/i);
                        if (match) {
                          const raw = match[1].toLowerCase();
                          interval = (raw.includes('year') || raw.includes('annual')) ? 'Annually' : 'Monthly';
                        }
                      }

                      // 3. Clean up the display name
                      const cleanName = planName
                        .replace(/\((Monthly|Annually|month|year|annual|monthly|annually)\)/i, '')
                        .replace(/Tier/i, '')
                        .trim();

                      return (
                        <li key={idx} className="text-emerald-400 font-medium flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                          <span className="flex items-center before:content-['•'] before:mr-2 before:text-slate-500">
                            {cleanName}
                          </span>
                          
                          {/* Render interval badge, or fallback to 'Active' for legacy data */}
                          {interval ? (
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-mono border border-emerald-500/20">
                              {interval}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono border border-white/10">
                              Active
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  ) : (
                    <p className="text-slate-500 italic">No active digital twin plans.</p>
                  )}
                </div>
              </div>

              {/* Team Roster */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Workspace Roster (@{editingUser.email.split('@')[1]})</h4>
                <div className="bg-[#0A0A0B] border border-white/5 rounded-lg p-3 text-sm">
                  {getTeammates(editingUser.email, editingUser.id).length > 0 ? (
                    <ul className="space-y-2">
                      {getTeammates(editingUser.email, editingUser.id).map((t: any) => (
                        <li key={t.id} className="flex justify-between items-center text-slate-300">
                          <span>{t.email}</span>
                          <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-slate-400">{t.role}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No other teammates found.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}