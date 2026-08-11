import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { lat = 31.9686, lon = -99.9018, userId } = await request.json(); // Default to Texas oil region

    // 1. Fetch live real-time weather & fire danger indicators
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );
    const weatherData = await weatherRes.json();
    const { temperature_2m, relative_humidity_2m, wind_speed_10m } = weatherData.current;

    // 2. Compute Wildfire Risk Score
    let riskLevel = "LOW / NOMINAL";
    if (temperature_2m > 35 && relative_humidity_2m < 20 && wind_speed_10m > 25) {
      riskLevel = "CRITICAL (Level 4)";
    } else if (temperature_2m > 30 && relative_humidity_2m < 30) {
      riskLevel = "MODERATE (Level 2)";
    }

    const reportId = `REP-${Math.floor(100 + Math.random() * 900)}`;

    // 3. Save Real Report to Database
    const newReport = await prisma.report.create({
      data: {
        reportId,
        subject: "Wildfire Risk Proximity Assessment",
        source: "Automated API",
        riskLevel,
        metrics: `Temp: ${temperature_2m}°C, Humidity: ${relative_humidity_2m}%, Wind: ${wind_speed_10m}km/h at Target Sector (${lat}, ${lon}).`,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true, report: newReport });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}