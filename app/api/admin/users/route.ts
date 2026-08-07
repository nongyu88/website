export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// GET: Fetch ALL users
export async function GET() {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, company: true, role: true, isApproved: true, createdAt: true }
    });
    return NextResponse.json({ users: allUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

// PUT: Update user (Approve, or Edit details)
export async function PUT(request: Request) {
  try {
    const { userId, isApproved, company, role, sendApprovalEmail } = await request.json();

    // 1. Build dynamic update object so omitted fields aren't affected
    const updateData: any = {};
    if (typeof isApproved === "boolean") updateData.isApproved = isApproved;
    if (company !== undefined) updateData.company = company;
    if (role !== undefined) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // 2. Wrap Resend email in a separate try/catch so email errors don't crash the approval
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
          subject: "Your Account Is Suspended! - Kraftgene AI",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2>Notice: Account Pending Review</h2>
              <p>Hello ${displayName},</p>
              <p>Your access to the Kraftgene AI digital twin platform has been temporarily suspended and returned to "Pending" status by an administrator.</p>
              <p>If you believe this is an error, please contact support.</p>
            </div>`
        });
      }
    } catch (emailErr) {
      console.error("Non-fatal email error during approval toggle:", emailErr);
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
// DELETE: Remove a user entirely
export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}