import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

// Next.js Global Singleton Pattern
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(req: Request) {
  try {
    const { userEmail, service, phaseIndex, phaseName, progress, note, author } = await req.json()

    if (!userEmail || !service) {
      return NextResponse.json({ error: "User email and service name required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Robust Multi-Pass Parser for SQL Server
    let existingProgress: any = user.serviceProgress || "{}"
    try {
      if (typeof existingProgress === 'string') existingProgress = JSON.parse(existingProgress)
      if (typeof existingProgress === 'string') existingProgress = JSON.parse(existingProgress)
      if (typeof existingProgress !== 'object' || existingProgress === null) existingProgress = {}
    } catch (e) {
      existingProgress = {}
    }

    const existingServiceData = existingProgress[service] || {}
    const existingLogs = Array.isArray(existingServiceData.logs) ? existingServiceData.logs : []

    // Create persistent log entry
    const newLog = {
      id: Date.now(),
      service,
      action: progress >= (existingServiceData.progress || 0) ? "ADVANCED" : "ROLLED_BACK",
      phase: phaseName,
      note: note || "Phase updated",
      date: new Date().toISOString(),
      author: author || "Admin User"
    }

    // Save phase progress AND history logs array to DB
    existingProgress[service] = {
      phaseIndex,
      phaseName,
      progress,
      lastUpdated: new Date().toISOString(),
      updatedBy: author || "Admin",
      logs: [newLog, ...existingLogs] // Store audit trail in DB
    }

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        serviceProgress: JSON.stringify(existingProgress)
      }
    })

    return NextResponse.json({ 
      success: true, 
      serviceProgress: JSON.stringify(existingProgress) 
    })
  } catch (error: any) {
    console.error("Progress update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}