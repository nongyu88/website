import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// A mock function for your Mini Copilot. 
// In production, you would swap this with an OpenAI (or your own LLM) API call.
async function copilotAnalyzeUser(email: string, rawIndustry: string, alerts: string[]) {
  // The Copilot decides the true industry focus
  let decidedIndustry = 'grid';
  if (rawIndustry === 'pipeline' || email.includes('enbridge') || email.includes('aramco')) {
    decidedIndustry = 'pipeline';
  } else if (rawIndustry === 'both') {
    decidedIndustry = 'both';
  }

  // The Copilot generates a tailored threat brief based on their alert focus
  const alertStr = Array.isArray(alerts) ? alerts.join(', ') : alerts;
  const aiBrief = `Copilot initialized for ${email}. Monitoring active telemetry for ${decidedIndustry} infrastructure. High priority assigned to: ${alertStr || 'Standard Operations'}. No critical anomalies detected in the last 24 hours.`;

  return { decidedIndustry, aiBrief };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, industry, region, alertFocus } = body;

    // 1. Feed the data to the Mini Copilot
    const { decidedIndustry, aiBrief } = await copilotAnalyzeUser(email, industry, alertFocus);

    const alertFocusString = Array.isArray(alertFocus) ? alertFocus.join(',') : alertFocus;

    // 2. Save the Copilot's decisions to the database
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        hasCompletedOnboarding: true,
        industry: decidedIndustry, // The AI's decision!
        region: region,
        alertFocus: alertFocusString,
        // Note: You can add an `aiBrief` column to Prisma later, 
        // but for now we'll just return it to the frontend.
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      copilotBrief: aiBrief 
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to save preferences:", error);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}