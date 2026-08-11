import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sensorId, pressure, temp, strain, userId } = body;

    // 1. Log Raw Telemetry Payload
    await prisma.telemetryLog.create({
      data: {
        sensorId,
        pressure: parseFloat(pressure),
        temp: parseFloat(temp),
        strain: parseFloat(strain),
      },
    });

    // 2. Anomaly Rule Engine (e.g., Pressure > 1,500 PSI or Strain > 0.08)
    const CRITICAL_PRESSURE = 1500;
    if (pressure > CRITICAL_PRESSURE) {
      const reportId = `REP-${Math.floor(100 + Math.random() * 900)}`;

      // Auto-trigger Structural Health Summary Report
      const alertReport = await prisma.report.create({
        data: {
          reportId,
          subject: "Pipeline Structural Health Alert",
          source: "Sensor Telemetry",
          riskLevel: "HIGH SURGE DETECTED",
          metrics: `Transducer ${sensorId} reported surge @ ${pressure} PSI (Threshold: ${CRITICAL_PRESSURE} PSI). Strain delta: ${strain}.`,
          userId: userId || null,
        },
      });

      return NextResponse.json({ 
        status: "ANOMALY_DETECTED", 
        reportTriggered: alertReport 
      });
    }

    return NextResponse.json({ status: "OK", message: "Telemetry logged cleanly." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}