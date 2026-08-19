export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "123");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Security best practice: Don't reveal if the email exists or not
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 2. Generate a secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // 3. Save the token to the user's database record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationOtp: resetToken, // Re-using the OTP field for the reset token
        otpExpiresAt: tokenExpiresAt
      }
    });

    // 4. Determine the base URL for the reset link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // 5. Send the email via Resend
    await resend.emails.send({
      from: 'Kraftgene AI <security@kraftgeneai.ca>',
      to: email,
      subject: 'Kraftgene AI: Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-top: 0;">Password Reset Request</h2>
          
          <p style="font-size: 16px; line-height: 1.5; color: #334155;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.5; color: #334155;">
            We received a request to reset your password for your Kraftgene AI Enterprise Portal account. 
            Click the button below to choose a new password. This link will expire in 1 hour.
          </p>
          
          <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
            <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
          </div>

          <p style="font-size: 14px; color: #64748b;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetLink}" style="color: #10b981; word-break: break-all;">${resetLink}</a>
          </p>

          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            If you did not request a password reset, please ignore this email or contact support if you have concerns.
          </p>
          
          <p style="margin-top: 40px; font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
            Securely delivered by Kraftgene AI.<br/>
            <strong>Enterprise Security Team</strong>
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}