export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' as any });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ""; 

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // If you are testing locally without a webhook secret, this skips signature verification 
    // (Make sure to add STRIPE_WEBHOOK_SECRET to .env in production!)
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.metadata?.organizationId;
    const subscriptionId = session.subscription as string;

    if (orgId && subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      // Map Stripe Price ID back to your internal Plan Name
      let planName = "Enterprise Convergence";
      if (priceId === "price_1U0drsCnK1WH2hz2ETrB7CUj" || priceId === "price_1U0dwrCnK1WH2hz2vRXdFtze") planName = "Utility Grid Twin";
      if (priceId === "price_1U0dumCnK1WH2hz29ta30zW3" || priceId === "price_1U0dxfCnK1WH2hz2B6V9AMUl") planName = "Pipeline Twin";

      await prisma.organization.update({
        where: { id: orgId },
        data: {
          stripeSubscriptionId: subscriptionId,
          planName: planName,
          subscriptionStatus: "active"
        }
      });
    }
  }

  // Handle cancellations or failed payments
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.organization.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { subscriptionStatus: subscription.status } // 'active', 'canceled', 'past_due'
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}