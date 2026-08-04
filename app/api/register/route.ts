export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust path if needed
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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

    // 3. NEW LOGIC: Send the email alert to you
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail", // Change if using Office365, Outlook, etc.
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "yu.nong@kraftgeneai.com", // Your direct email
        subject: `🚨 New Client Registration: ${company}`,
        html: `
          <h3>New Client Registration Alert</h3>
          <p>A new enterprise user has registered for the Kraftgene AI portal and is awaiting your approval.</p>
          <ul>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p>Please log in to your database or admin dashboard to approve their access.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Admin alert email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send admin email:", emailError);
      // We don't return an error here so the user's registration still succeeds
    }

    // 4. Return success to the client
    return NextResponse.json({ 
      message: "Registration successful. Pending admin approval." 
    });

  } catch (error: any) {
    return NextResponse.json({ error: `API CRASH: ${error.message}` }, { status: 500 });
  }
}