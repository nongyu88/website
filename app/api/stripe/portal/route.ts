export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Add the || 'sk_test_placeholder' so it doesn't crash when undefined during build
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10' as any,
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user || !user.organization?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found. Please subscribe first." }, { status: 404 });
    }

    // Generate the secure Stripe Portal link
    const session = await stripe.billingPortal.sessions.create({
      customer: user.organization.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings/plans`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: "Failed to load billing portal." }, { status: 500 });
  }
}