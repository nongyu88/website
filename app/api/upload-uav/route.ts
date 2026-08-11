export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const targetNode = (formData.get("targetNode") as string) || "Sector-04 Thermal Array";
    const missionType = (formData.get("missionType") as string) || "Thermal Anomaly Scan";
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No telemetry payload file uploaded." }, { status: 400 });
    }

    // 1. Process File Bytes & Save locally in /public/uploads/uav/
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "uav");
    await mkdir(uploadsDir, { recursive: true }); // Ensure directory exists

    const sanitizedFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, sanitizedFileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/uav/${sanitizedFileName}`;
    const fileSizeMb = (bytes.byteLength / (1024 * 1024)).toFixed(2);

    // 2. AI Computer Vision Simulation Engine
    // Determine risk level based on mission type / file name
    const isAnomalyDetected = Math.random() < 0.6; // 60% chance of detecting thermal delta
    const tempDelta = isAnomalyDetected ? (12 + Math.random() * 8).toFixed(1) : "1.2";
    
    let riskLevel = "NOMINAL (Baseline)";
    if (isAnomalyDetected) {
      riskLevel = parseFloat(tempDelta) > 15 ? "CRITICAL (Level 3 Anomaly)" : "ELEVATED (Thermal Delta)";
    }

    const reportId = `REP-0${Math.floor(100 + Math.random() * 900)}`;

    // 3. Persist Report in SQL Database via Prisma
    const newReport = await prisma.report.create({
      data: {
        reportId,
        subject: `${missionType} (${targetNode})`,
        source: "UAV Data Upload",
        riskLevel,
        metrics: `Processed flight payload "${file.name}" (${fileSizeMb} MB). AI Vision Engine detected +${tempDelta}°C temperature variance over thermal baseline on ${targetNode}.`,
        fileUrl,
        userId: userId || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "UAV flight payload processed successfully.",
      report: newReport,
    });
  } catch (error: any) {
    console.error("UAV Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process UAV upload." }, { status: 500 });
  }
}