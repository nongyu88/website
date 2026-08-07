export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust path if needed
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { Yuji_Boku } from "next/font/google";

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(req: Request) {
  try {
    const { email, password, company, inviteToken } = await req.json();

    // 1. Existing logic: Check if user exists & hash password
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedRole = "Owner";
    let orgId = null;
    let isApprovedStatus = false; // Default to pending for public signups

    // 2. NEW LOGIC: Catch the invite token
    if (inviteToken) {
      const invite = await prisma.invite.findUnique({ where: { token: inviteToken } });
      if (invite && invite.status === "pending" && invite.email.toLowerCase() === email.toLowerCase()) {
        assignedRole = invite.role;
        isApprovedStatus = true; // Auto-approve invited teammates
        
        await prisma.invite.update({ where: { id: invite.id }, data: { status: "accepted" } });
      }
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes valid

    // 3. Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company: company || "Unknown",
        role: assignedRole,
        isApproved: isApprovedStatus,
        verificationOtp: otpCode,
        otpExpiresAt: otpExpiresAt,
      },
    });

    try {
      // A. Send OTP code to verify account.
      await resend.emails.send({
        from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
        to: email,
        subject: 'Verify Your Enterprise Account - Kraftgene AI',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px;">
            <h2 style="color: #047857;">Welcome to Kraftgene AI, ${company}.</h2>
            <p>To proceed with your enterprise account registration, please verify your email address.</p>
            <p>Your secure verification code is: <strong style="font-size: 1.4em; letter-spacing: 4px; display: inline-block; margin: 10px 0;">${otpCode}</strong></p>
            <p style="font-size: 0.9em; color: #666;">This code is valid for 15 minutes.</p>
          </div>
        `
      });
      
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    // 4. Return success to the client
    return NextResponse.json({ 
      message: "Registration successful. Pending admin approval." 
    });

  } catch (error: any) {
    return NextResponse.json({ error: `API CRASH: ${error.message}` }, { status: 500 });
  }
}