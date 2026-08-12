import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sensorId, pressure, temp, strain, voltage, frequency, userId, userEmail } = body;

    let domain = body.domain?.toLowerCase();

    // 1. READ DOMAIN DIRECTLY FROM USER'S DASHBOARD PROFILE (user.industry)
    if (!domain && (userId || userEmail)) {
      const userProfile = await prisma.user.findFirst({
        where: userId ? { id: userId } : { email: userEmail },
        select: { industry: true }
      });

      if (userProfile?.industry) {
        domain = userProfile.industry.toLowerCase(); // 'pipeline' | 'grid' | 'both'
      }
    }

    // 2. FALLBACK AUTO-DETECTION (For headless IoT background pings with no user context)
    if (!domain || domain === "both") {
      if (voltage !== undefined || frequency !== undefined) {
        domain = "grid";
      } else {
        domain = "pipeline"; // Default fallback
      }
    }

    // 3. PERSIST TELEMETRY TO SQL SERVER
    await prisma.telemetryLog.create({
      data: {
        sensorId: sensorId || "NODE-UNKNOWN",
        pressure: pressure ? parseFloat(pressure) : 0,
        temp: temp ? parseFloat(temp) : 0,
        strain: strain ? parseFloat(strain) : 0,
      },
    });

    const uniqueSuffix = Math.random().toString(16).substring(2, 6).toUpperCase();

    // 4A. PIPELINE TELEMETRY EVALUATION (Pressure / Strain)
    if (domain === "pipeline") {
      if (pressure && parseFloat(pressure) > 1500) {
        const reportId = `REP-${Date.now().toString().slice(-4)}-${uniqueSuffix}`;
        const alertReport = await prisma.report.create({
          data: {
            reportId,
            subject: `Pipeline Surge Alert (${sensorId})`,
            source: "Sensor Telemetry",
            riskLevel: "CRITICAL (Surge Pressure)",
            metrics: `Transducer ${sensorId} reported surge @ ${pressure} PSI. Strain: ${strain || 0}.`,
            userId: userId || null,
          },
        });
        return NextResponse.json({ status: "ANOMALY_DETECTED", domain: "pipeline", reportTriggered: alertReport });
      }
    }

    // 4B. POWER GRID TELEMETRY EVALUATION (Voltage / Frequency)
    if (domain === "grid") {
      if ((voltage && parseFloat(voltage) < 110) || (frequency && parseFloat(frequency) < 59.5)) {
        const reportId = `REP-${Date.now().toString().slice(-4)}-${uniqueSuffix}`;
        const alertReport = await prisma.report.create({
          data: {
            reportId,
            subject: `Grid Voltage Sag Alert (${sensorId})`,
            source: "Sensor Telemetry",
            riskLevel: "CRITICAL (Grid Frequency Sag)",
            metrics: `Substation Sensor ${sensorId} reported voltage drop @ ${voltage} kV (Freq: ${frequency} Hz).`,
            userId: userId || null,
          },
        });
        return NextResponse.json({ status: "ANOMALY_DETECTED", domain: "grid", reportTriggered: alertReport });
      }
    }

    return NextResponse.json({
      status: "OK",
      domainSyncedFromDashboard: domain,
      message: `Telemetry processed according to ${domain.toUpperCase()} profile focus.`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}