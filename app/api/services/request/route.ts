export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Reusing your existing Resend instance pattern
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
  try {
    const { serviceType, userEmail, details } = await request.json();

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required." }, { status: 400 });
    }

    // Format the details object into a clean HTML list for the email
    const detailsHtml = Object.entries(details)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join('');

    await resend.emails.send({
      from: 'Kraftgene AI Portal <onboarding@kraftgeneai.ca>', // Must be a verified domain in Resend
      to: 'yu.nong@kraftgeneai.com',
      subject: `New Lead: ${serviceType} Request from ${userEmail}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">New Enterprise Service Request</h2>
          <p>A user has submitted a consultation request from the portal.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Service Area:</strong> ${serviceType}</p>
            <p><strong>User Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
            <h3>Submission Details:</h3>
            <ul>
              ${detailsHtml}
            </ul>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Failed to send notification." }, { status: 500 });
  }
}