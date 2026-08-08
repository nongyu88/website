export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        website: true,
        industry: true,
        region: true,
        avatarUrl: true,
        position: true,
        department: true,
        bio: true,
        linkedinUrl: true,
        timezone: true,
        skills: true,
        workingHours: true,
        notifySecurityAlerts: true,
        notifyProductUpdates: true,
        role: true,
        domain: true,
        // 🚨 CRITICAL FIX: Include subscription & plan fields for solo users!
        activePlans: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const emailDomain = email.split('@')[1]?.toLowerCase();

    // 1. AUTO-LINK TEAMMATES (Connects c@a.com to a.com's domain so Tax ID/Logo isn't blank)
    if (!user.domain && emailDomain) {
      const existingDomain = await prisma.domain.findFirst({ where: { name: emailDomain } });
      if (existingDomain) {
        await prisma.user.update({
          where: { id: user.id },
          data: { domainId: existingDomain.id }
        });
        user.domain = existingDomain;
      }
    }

    // 2. MERGE TEAM PLANS (Uses priceId so Monthly and Yearly plans remain separate!)
    if (emailDomain) {
      // Find all users in the same company
      const teammates = await prisma.user.findMany({
        where: { email: { endsWith: `@${emailDomain}` } },
        select: { activePlans: true }
      });

      // Combine all their activePlans into one array
      let allTeamPlans: any[] = [];
      teammates.forEach(teammate => {
        try {
          const plans = JSON.parse(teammate.activePlans || "[]");
          allTeamPlans = [...allTeamPlans, ...plans];
        } catch (e) {}
      });

      // Remove duplicates using priceId (keeps Monthly & Yearly versions distinct)
      const uniquePlans = allTeamPlans.filter((plan, index, self) =>
        index === self.findIndex((t) => t.priceId === plan.priceId)
      );

      // Overwrite user's plans with merged team plans before sending to frontend
      user.activePlans = JSON.stringify(uniquePlans);
    }

    // Fetch active Stripe Price ID 
    let activePriceId = null;
    const subId = user.stripeSubscriptionId;

    if (subId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subId);
        activePriceId = sub.items.data[0]?.price?.id || null;
      } catch (e) {
        console.error("Error retrieving Stripe subscription:", e);
      }
    }

    return NextResponse.json({ user, activePriceId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, firstName, lastName, company, website, 
      industry, region, avatarUrl, notifySecurityAlerts, notifyProductUpdates,
      position, department, bio, linkedinUrl, timezone, skills, workingHours
    } = body;

    if (!email) {
      return NextResponse.json({ error: "User email is required for updates." }, { status: 400 });
    }

    // Update the user record in the SQL database
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        firstName,
        lastName,
        company,
        website,
        industry,
        region,
        avatarUrl,
        position,
        department,
        bio,
        linkedinUrl,
        timezone,
        skills,
        workingHours,
        notifySecurityAlerts,
        notifyProductUpdates
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        company: updatedUser.company,
        website: updatedUser.website,
        industry: updatedUser.industry,
        region: updatedUser.region,
        avatarUrl: updatedUser.avatarUrl,
        notifySecurityAlerts: updatedUser.notifySecurityAlerts,
        notifyProductUpdates: updatedUser.notifyProductUpdates,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}