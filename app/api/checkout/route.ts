export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe with a placeholder key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // Add 'as any' to satisfy TypeScript, or press Ctrl+Space inside 
    // the quotes to let VS Code auto-complete the exact date it wants.
    apiVersion: '2023-10-16' as any, 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, isAnnual, userEmail } = body;

    // 1. Verify the user exists in your database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Map your plan IDs to real Stripe Price IDs (You will get these from your Stripe Dashboard)
    // Note: These are placeholders. We will update them once you create the products in Stripe.
    const priceMap: Record<string, { monthly: string, annual: string }> = {
      core: { monthly: 'price_core_monthly_mock', annual: 'price_core_annual_mock' },
      pro: { monthly: 'price_pro_monthly_mock', annual: 'price_pro_annual_mock' },
      enterprise: { monthly: 'price_ent_monthly_mock', annual: 'price_ent_annual_mock' }
    };

    const priceId = isAnnual ? priceMap[planId].annual : priceMap[planId].monthly;

    // 3. Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email, // Pre-fill their email at checkout
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // The URLs Stripe will redirect to after payment (success or cancel)
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkout=canceled`,
      // Pass the user ID to Stripe so we know WHO paid when the webhook fires later
      metadata: {
        userId: user.id,
        planTier: planId
      }
    });

    // 4. Return the secure checkout URL to the frontend
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}