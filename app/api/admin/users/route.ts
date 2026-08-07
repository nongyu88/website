export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// GET: Fetch ALL users with extended details
export async function GET() {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        email: true, 
        company: true, 
        role: true, 
        isApproved: true, 
        createdAt: true,
        stripeCustomerId: true,
        activePlans: true,
        hasCompletedOnboarding: true
      }
    });
    return NextResponse.json({ users: allUsers }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/users Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch users." }, { status: 500 });
  }
}

// POST: Admin manually provisions a new user (skips OTP, auto-approved)
export async function POST(request: Request) {
  try {
    const { email, password, company, role } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company: company || "Enterprise Account",
        role: role || "Owner",
        isApproved: true,
        emailVerified: new Date(),
      },
      select: { 
        id: true, email: true, company: true, role: true, 
        isApproved: true, createdAt: true, stripeCustomerId: true, 
        activePlans: true, hasCompletedOnboarding: true 
      }
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/admin/users Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create user." }, { status: 500 });
  }
}

// PUT: Update user (Approve, or Edit details)
export async function PUT(request: Request) {
  try {
    const { userId, isApproved, company, role, sendApprovalEmail } = await request.json();

    const updateData: any = {};
    if (typeof isApproved === "boolean") updateData.isApproved = isApproved;
    if (company !== undefined) updateData.company = company;
    if (role !== undefined) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    try {
      const displayName = updatedUser.company || updatedUser.email;

      if (sendApprovalEmail && updatedUser.isApproved) {
        await resend.emails.send({
          from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
          to: updatedUser.email,
          subject: "Your Account is Ready! - Kraftgene AI",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px;">
              <h2 style="color: #047857;">Enterprise Access Granted</h2>
              <p>Hello ${displayName},</p>
              <p>Your enterprise account has been successfully verified and approved by the Kraftgene AI administration team.</p>
              <p>You may now log in to the client portal and access your digital twin environment.</p>
              <div style="margin: 28px 0;">
                <a href="https://www.kraftgeneai.ca/login" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log In to Client Portal</a>
              </div>
              <p style="font-size: 0.9em; color: #666;">If you have any questions or require technical support during onboarding, please reply directly to this email.</p>
            </div>
          `
        });
      } else if (sendApprovalEmail === false && !updatedUser.isApproved) {
        await resend.emails.send({
          from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
          to: updatedUser.email,
          subject: "Notice: Enterprise Account Status Update - Kraftgene AI",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px;">
              <h2 style="color: #b91c1c;">Enterprise Account Status Update</h2>
              <p>Hello ${displayName},</p>
              <p>Please be advised that your access to the Kraftgene AI digital twin platform has been temporarily placed on administrative hold and returned to <strong>Pending Review</strong> status.</p>
              <p>During this period, access to active digital twins, platform APIs, and dashboard analytics for your organization will be restricted.</p>
              <p style="margin-top: 24px;">If you believe this status change was made in error or if you require immediate compliance clarification, please contact our team at <a href="mailto:info@kraftgeneai.ca" style="color: #059669; text-decoration: underline;">info@kraftgeneai.ca</a>.</p>
            </div>`
        });
      }
    } catch (emailErr) {
      console.error("Non-fatal email error during approval toggle:", emailErr);
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/admin/users Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update user." }, { status: 500 });
  }
}

// DELETE: Remove a user entirely
export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/admin/users Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete user." }, { status: 500 });
  }
}