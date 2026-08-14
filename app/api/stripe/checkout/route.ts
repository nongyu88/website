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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 2. Reuse the user's individual Stripe Customer ID or create a new one for them
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email, // Always use THIS specific user's email
        name: user.company || user.email,
        metadata: {
          userId: user.id,
        }
      });
      
      customerId = customer.id;

      // Save THIS user's unique Stripe Customer ID to their account
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // If no Stripe Customer ID exists yet across the entire team, create ONE customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.company || "Enterprise Account",
        metadata: {
          userId: user.id,
        }
      });
      
      customerId = customer.id;

      // Persist the single customer ID to User
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
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
        userId: user.id,// Pass this so the Webhook knows who paid!
      }
    });

    // 4. Return the secure Stripe URL to the frontend
    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    // Return error.message so you can see the exact Stripe error in the alert!
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}