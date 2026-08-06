export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isApproved, company, role }
    });

    // Only fire the email if this is their FIRST time being approved
    if (sendApprovalEmail && updatedUser.isApproved) {
      await resend.emails.send({
        from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
        to: updatedUser.email,
        subject: "Your Account is Ready! - Kraftgene AI",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Great news, ${updatedUser.company}!</h2>
            <p>Your enterprise account has been fully approved by our administration team.</p>
            <p>You can now log in and access our services.</p>
            <div style="margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" style="padding: 12px 24px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log In to Dashboard</a>
            </div>
          </div>
        `
      });
    }

    // 2. IF REVOKED (Set to Pending): Send Suspension Email
    else if (!updatedUser.isApproved) {
      await resend.emails.send({
        from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
        to: updatedUser.email,
        subject: "Your Account Is Suspended! - Kraftgene AI",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Notice: Account Pending Review</h2>
            <p>Hello ${updatedUser.company},</p>
            <p>Your access to the Kraftgene AI digital twin platform has been temporarily suspended and returned to "Pending" status by an administrator.</p>
            <p>If you believe this is an error, please contact support.</p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
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