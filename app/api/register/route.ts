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
        orgId = invite.organizationId;
        isApprovedStatus = false; // Auto-approve invited teammates
        
        await prisma.invite.update({ where: { id: invite.id }, data: { status: "accepted" } });
      }
    }

    // 3. Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company: company || "Unknown",
        role: assignedRole,
        organizationId: orgId,
        isApproved: isApprovedStatus,
      },
    });

    //  Send email alerts (Admin + Client Confirmation)
    try {
      await resend.emails.send({
        from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
        to: ["yu.nong@kraftgeneai.com", "m.m@kraftgeneai.com"],
        subject: `Registration Received - Kraftgene AI`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Welcome to Kraftgene AI, ${company}!</h2>
            <p>Your registration was successful. Our team is currently reviewing your account details to ensure secure access to the digital twin environment.</p>
            <p>We will notify you via email as soon as your account is approved and ready for use.</p>
            <p>Thank you for your patience!</p>
          </div>
        `
      });

      // B. Send Pending Approval email to the CLIENT via Resend
      await resend.emails.send({
        from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
        to: email,
        subject: `Registration Received - Kraftgene AI`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Welcome to Kraftgene AI, ${company}!</h2>
            <p>Your registration was successful. Our team is currently reviewing your account details to ensure secure access to the digital twin environment.</p>
            <p>We will notify you via email as soon as your account is approved and ready for use.</p>
            <p>Thank you for your patience!</p>
          </div>
        `
      });
      
      console.log("Admin and Client emails sent successfully.");
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