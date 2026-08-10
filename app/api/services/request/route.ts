import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend using your existing pattern
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
  try {
    const { serviceType, userEmail, details } = await request.json();

    if (!userEmail || !serviceType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Dynamically generate a clean HTML table from the 'details' object
    const detailsHtml = Object.entries(details || {})
      .map(([key, value]) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569; width: 40%;">${key}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${value}</td>
        </tr>
      `).join('');

    // Send the email via Resend
    await resend.emails.send({
      from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
      to: userEmail,
      bcc: ['customer@kraftgeneai.ca', 'tech@kraftgeneai.ca'],
      subject: `Confirmation: ${serviceType} Request Received`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 24px; color: #333; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-top: 0;">${serviceType}</h2>
          
          <p style="font-size: 16px; line-height: 1.5; color: #334155;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.5; color: #334155;">
            We have successfully received your request. Our engineering team is reviewing your specific parameters and will reach out shortly to coordinate next steps.
          </p>
          
          <h3 style="margin-top: 32px; color: #0f172a; font-size: 18px;">Your Submitted Parameters:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
            <tbody>
              ${detailsHtml}
            </tbody>
          </table>

          <p style="margin-top: 40px; font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
            Thank you for choosing Kraftgene AI.<br/>
            <strong>Enterprise Solutions Architecture Team</strong>
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Service Request Email Error:", error);
    return NextResponse.json({ error: "Failed to send confirmation email." }, { status: 500 });
  }
}