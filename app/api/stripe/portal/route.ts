export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma"; // Adjust import path if needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Fetch user and organization safely without referencing old columns
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get customer ID from Organization or User fallback
    const stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No active Stripe customer found. Please subscribe to a plan first." },
        { status: 400 }
      );
    }

    const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const baseUrl = rawBaseUrl.replace(/\/$/, '');

    // Create Stripe Customer Portal Session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/dashboard/settings/plans`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load billing portal." }, { status: 500 });
  }
}