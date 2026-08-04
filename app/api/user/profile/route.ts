export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', { 
  apiVersion: '2024-04-10' as any 
});

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
        notifySecurityAlerts: true,
        notifyProductUpdates: true,
        role: true,
        organization: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the active Stripe Price ID directly from Stripe if subscription exists
    let activePriceId = null;
    if (user.organization?.stripeSubscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(user.organization.stripeSubscriptionId);
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
      industry, region, avatarUrl, notifySecurityAlerts, notifyProductUpdates 
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