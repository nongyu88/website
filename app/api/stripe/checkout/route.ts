export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe with your Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any, 
});

export async function POST(request: Request) {
  try {
    const { email, priceId } = await request.json();

    if (!email || !priceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get the user and their organization from the database
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user || !user.organizationId) {
      return NextResponse.json({ error: "User or Organization not found" }, { status: 404 });
    }

    // 2. Determine the Stripe Customer ID
    let customerId = user.organization?.stripeCustomerId;

    // If they don't have a Stripe Customer ID yet, create one!
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.company || "Enterprise Account",
        metadata: {
          organizationId: user.organizationId,
        }
      });
      
      customerId = customer.id;

      // Save the new Stripe Customer ID to your database
      await prisma.organization.update({
        where: { id: user.organizationId },
        data: { stripeCustomerId: customerId }
      });
    }

    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Because this is a recurring monthly/annual plan
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings/plans?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings/plans?canceled=true`,
      metadata: {
        organizationId: user.organizationId, // Pass this so the Webhook knows who paid!
      }
    });

    // 4. Return the secure Stripe URL to the frontend
    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}