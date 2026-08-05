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
    const { email, priceId } = await request.json();

    if (!email || !priceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the user and include their organization if they have one
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { organization: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 2. Determine and reuse the single Stripe Customer ID
    let customerId = user.organization?.stripeCustomerId || user.stripeCustomerId;

    // If no Stripe Customer ID exists yet, create ONE customer and attach to both
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.company || "Enterprise Account",
        metadata: {
          organizationId: user.organizationId || "",
        }
      });
      
      customerId = customer.id;

      // Persist the single customer ID to User
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });

      // Also persist to Organization if user belongs to one
      if (user.organization?.id) {
        await prisma.organization.update({
          where: { id: user.organization.id },
          data: { stripeCustomerId: customerId }
        });
      }
    }

    // Safely format base URL without trailing slash
    const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const baseUrl = rawBaseUrl.replace(/\/$/, '');

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
      success_url: `${baseUrl}/dashboard/settings/plans?success=true`,
      cancel_url: `${baseUrl}/dashboard/settings/plans?canceled=true`,
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