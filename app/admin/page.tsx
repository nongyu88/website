"use client"

import { useState, useEffect } from "react"
import { Shield, Trash2, Edit, CheckCircle, XCircle, X } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Edit Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [editCompany, setEditCompany] = useState("")
  const [editRole, setEditRole] = useState("")

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
          isApproved: editingUser.isApproved 
        })
      });
      if (!res.ok) throw new Error("Update failed");
      
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, company: editCompany, role: editRole } : u));
      setEditingUser(null);
    } catch (error) {
      alert("Error updating user details.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8 border-b border-white/10 pb-4">
          <Shield className="w-6 h-6 text-purple-500" />
          <h1 className="text-2xl font-bold text-white">Admin / User Management</h1>
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
                        onClick={() => { setEditingUser(user); setEditCompany(user.company); setEditRole(user.role || 'Viewer'); }}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4 inline" />
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Edit User Details</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Company / Name</label>
                <input type="text" required value={editCompany} onChange={(e) => setEditCompany(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">System Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none transition-colors cursor-pointer">
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-lg mt-4 transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}