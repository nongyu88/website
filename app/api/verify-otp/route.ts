import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.verificationOtp !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
    }

    // Success! Mark email as verified and clear the OTP fields
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        verificationOtp: null,
        otpExpiresAt: null,
      }
    });

    const companyName = user.company || "Enterprise Account";
    
    // Send emails securely from the server
    try {
      // 1. Notify Admin Team to review the new user
      await resend.emails.send({
        from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
        to: ["yu.nong@kraftgeneai.com", "m.m@kraftgeneai.com"],
        subject: `[Action Required] New Account Registration - ${companyName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px;">
            <h2 style="color: #047857;">Enterprise Registration Pending Review</h2>
            <p>A new enterprise account registration requires your attention.</p>
            <p>User <strong>${email}</strong> (Company: <strong>${companyName}</strong>) has successfully verified their email address.</p>
            <p>Please log in to the Kraftgene AI Admin Dashboard to review and process this request.</p>
          </div>
        `
      });

    // 2. Notify Client that their account is under review
    await resend.emails.send({
      from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
      to: email,
      subject: `Registration Received - Kraftgene AI`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px;">
          <h2 style="color: #047857;">Registration Received</h2>
          <p>Hello ${companyName},</p>
          <p>Thank you for registering with Kraftgene AI. We have successfully received your request.</p>
          <p>Our administration team is currently reviewing your enterprise credentials to ensure a secure operating environment. You will receive a follow-up email with access instructions once your account has been fully verified and approved.</p>
          <p>We appreciate your patience.</p>
        </div>
      `
    });

      console.log("Admin and Client emails sent successfully.");
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ error: "Server error during verification" }, { status: 500 });
  }
}