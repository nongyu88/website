"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, FileText, Download, Trash2, Loader2, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserDocument {
  id: string
  name: string
  size: string
  uploadedAt: string
  url: string
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<"documents" | "exports">("documents")
  const [userEmail, setUserEmail] = useState("")
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isFetchingDocs, setIsFetchingDocs] = useState(true)
  const [docToDelete, setDocToDelete] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load document records directly from database on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const email = JSON.parse(storedUser).email || ""
      setUserEmail(email)

      fetch(`/api/user/documents?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.documents) {
            setDocuments(data.documents)
          }
        })
        .catch((err) => console.error("Error fetching documents:", err))
        .finally(() => setIsFetchingDocs(false))
    } else {
      setIsFetchingDocs(false)
    }
  }, [])

  // Handle PDF Upload to Azure Blob Storage & Database
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErrorMessage(null)

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Invalid format. Only PDF files (.pdf) are permitted.")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setIsUploading(true)
    try {
      // 1. Upload binary file to Azure Blob Storage
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || "Cloud storage upload failed")

      const newDoc: UserDocument = {
        id: `DOC-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        url: uploadData.url
      }

      // 2. Persist document metadata to database
      const dbRes = await fetch("/api/user/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, document: newDoc }),
      })

      const dbData = await dbRes.json()
      if (!dbRes.ok) throw new Error(dbData.error || "Database record creation failed")

      setDocuments(dbData.documents)
    } catch (err: any) {
      setErrorMessage(`Upload error: ${err.message}`)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Delete Document from Database
  const confirmDeleteDoc = async () => {
    if (!docToDelete || !userEmail) return

    try {
      const res = await fetch("/api/user/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, docId: docToDelete }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Delete failed")

      setDocuments(data.documents)
      setDocToDelete(null)
    } catch (err: any) {
      setErrorMessage(`Delete error: ${err.message}`)
    }
  }

  // Generate & Download QuickBooks .iif File
  const handleExportQuickBooks = () => {
    const iifContent = `!TRNS\tTRNSID\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO
!SPL\tSPLID\tSPLTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO
!ENDTRNS
TRNS\t101\tPAYMENT\t${new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })}\tAccounts Receivable\tKraftgene AI\t1200.00\tINV-${new Date().getFullYear()}-001\tEnterprise Twin Subscription
SPL\t102\tPAYMENT\t${new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })}\tSales Revenue\tKraftgene AI\t-1200.00\tINV-${new Date().getFullYear()}-001\tEnterprise Twin Subscription
ENDTRNS`

    const blob = new Blob([iifContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Kraftgene_QuickBooks_Export_${new Date().toISOString().slice(0,10)}.iif`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-300 font-sans pb-20">
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] sticky top-0 z-50 px-6 py-4 flex items-center space-x-4">
        <Link href="/dashboard/settings" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Compliance and documents</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between text-red-400 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-slate-200 dark:border-white/10 mb-8 text-sm font-bold">
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 transition-colors ${activeTab === "documents" ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            My documents
          </button>
          <button
            onClick={() => setActiveTab("exports")}
            className={`pb-3 transition-colors ${activeTab === "exports" ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            Legacy exports
          </button>
        </div>

        {/* TAB 1: MY DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 p-6 rounded-2xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Upload Compliance Document</h2>
                <p className="text-xs text-slate-500 mt-1">Select PDF files (.pdf only) to attach to your enterprise account.</p>
              </div>
              <input type="file" ref={fileInputRef} accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md shadow-purple-900/20"
              >
                {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Upload PDF</>}
              </Button>
            </div>

            {isFetchingDocs ? (
              <div className="p-12 text-center border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111113] text-slate-500 text-xs">
                Loading compliance documents from database...
              </div>
            ) : documents.length === 0 ? (
              <div className="p-12 text-center border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111113] text-slate-500 text-sm">
                No personal compliance documents uploaded yet.
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-[#1A1A1D] border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-6 font-medium text-xs text-slate-500 uppercase">Document Name</th>
                      <th className="py-3 px-6 font-medium text-xs text-slate-500 uppercase">Size</th>
                      <th className="py-3 px-6 font-medium text-xs text-slate-500 uppercase">Uploaded</th>
                      <th className="py-3 px-6 font-medium text-xs text-slate-500 uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white flex items-center">
                          <FileText className="w-4 h-4 text-purple-500 mr-3 shrink-0" />
                          <span className="truncate max-w-xs">{doc.name}</span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">{doc.size}</td>
                        <td className="py-4 px-6 text-xs text-slate-500">{doc.uploadedAt}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <a href={doc.url} download={doc.name} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 dark:border-white/10 hover:bg-purple-500/10 hover:text-purple-400">
                              <Download className="w-3.5 h-3.5 mr-1 text-purple-500" /> Download
                            </Button>
                          </a>
                          <Button onClick={() => setDocToDelete(doc.id)} variant="outline" size="sm" className="h-8 text-xs border-slate-200 dark:border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEGACY EXPORTS */}
        {activeTab === "exports" && (
          <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#111113] shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161618]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Legacy exports settings</h2>
            </div>

            <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-1 text-base">QuickBooks export</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Download an .iif file of your test transaction data that can be easily imported into QuickBooks.</p>
              </div>
              <button 
                onClick={handleExportQuickBooks} 
                className="shrink-0 px-4 py-1.5 bg-slate-100 dark:bg-[#2A2A2D] hover:bg-slate-200 dark:hover:bg-[#333336] text-slate-900 dark:text-white text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/10 transition-colors"
              >
                Export to QuickBooks...
              </button>
            </div>
          </div>
        )}
      </main>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4 relative">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Remove Document?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to remove this compliance document? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setDocToDelete(null)} 
                className="border-slate-200 dark:border-white/10 text-xs px-4"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDeleteDoc} 
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 shadow-lg shadow-red-950/40"
              >
                Remove Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}