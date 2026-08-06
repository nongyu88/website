export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
  try {
    const { inviterEmail, inviteeEmail, role } = await request.json();

    if (!inviterEmail || !inviteeEmail || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. Find the inviter
    const inviter = await prisma.user.findUnique({ where: { email: inviterEmail } });
    if (!inviter) return NextResponse.json({ error: "Inviter not found." }, { status: 404 });

    // 2. SAFEGUARD: If this is an older test user without an organization, auto-link or create!
    let orgId = inviter.organizationId;

    if (!orgId) {
      // A. Check if an organization already exists for their company name
      let org = await prisma.organization.findFirst({
        where: inviter.company && inviter.company !== "Unknown" 
          ? { name: inviter.company } 
          : undefined
      });

      // B. If not found, attach to the default/first organization in the database
      if (!org) {
        org = await prisma.organization.findFirst();
      }

      // C. If the database has 0 organizations, create the initial one with unique dummy keys
      if (!org) {
        try {
          const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          org = await prisma.organization.create({
            data: {
              name: inviter.company || `Enterprise Workspace (${uniqueSuffix})`,
              activePlans: inviter.activePlans || "[]",
              subscriptionStatus: inviter.subscriptionStatus || "inactive",
              stripeCustomerId: `cus_init_${uniqueSuffix}`,
              stripeSubscriptionId: `sub_init_${uniqueSuffix}`
            }
          });
        } catch (createErr) {
          // Final safety net: grab any existing org
          org = await prisma.organization.findFirst();
        }
      }

      if (!org) {
        return NextResponse.json({ error: "Failed to locate or create an organization." }, { status: 500 });
      }

      // D. Attach the inviter to this organization
      await prisma.user.update({
        where: { id: inviter.id },
        data: { organizationId: org.id, role: "Owner" }
      });

      orgId = org.id;
    }

    // 3. Ensure the inviter has permission
    if (inviter.role === "Viewer") {
      return NextResponse.json({ error: "You do not have permission to invite members." }, { status: 403 });
    }

    // 4. Generate a secure, unique token
    const token = crypto.randomBytes(32).toString('hex');

    // 5. Save the Invite to the database
    const invite = await prisma.invite.create({
      data: {
        email: inviteeEmail,
        role: role,
        token: token,
        organizationId: orgId
      }
    });

    // Point directly to /login where your AuthPage component lives!
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/login?invite=${token}`;
    
    const inviterName = inviter.firstName ? `${inviter.firstName} ${inviter.lastName}` : inviter.email;
    const companyName = inviter.company || "their enterprise workspace";

    await resend.emails.send({
      from: 'Kraftgene AI <onboarding@kraftgeneai.ca>',
      to: inviteeEmail,
      subject: `${inviterName} invited you to join ${companyName} on Kraftgene AI`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>You've been invited!</h2>
          <p><strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> on Kraftgene AI as a <strong>${role}</strong>.</p>
          <p>Click the button below to accept your invitation and access the Digital Twin dashboard:</p>
          <div style="margin-top: 24px;">
            <a href="${inviteLink}" style="padding: 12px 24px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Invite Error:", error);
    return NextResponse.json({ error: "Failed to send invitation." }, { status: 500 });
  }
}