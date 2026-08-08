export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(request: Request) {
  try {
    const { email, action, priceId, targetPriceId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: "No active Stripe customer found." }, { status: 400 });
    }

    const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const baseUrl = rawBaseUrl.replace(/\/$/, '');

    let sessionConfig: Stripe.BillingPortal.SessionCreateParams = {
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard/settings/plans`,
    };

    if (action && priceId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
      });

      const targetSubscription = subscriptions.data.find(sub => 
        sub.items.data.some(item => item.price.id === priceId)
      );

      if (targetSubscription) {
        const subItem = targetSubscription.items.data.find(item => item.price.id === priceId);

        if (action === 'upgrade' && targetPriceId && subItem) {
          // Direct deep-link to confirmation page for THIS specific annual price
          sessionConfig.flow_data = {
            type: 'subscription_update_confirm',
            subscription_update_confirm: {
              subscription: targetSubscription.id,
              items: [
                {
                  id: subItem.id,
                  price: targetPriceId,
                }
              ]
            }
          };
        } else if (action === 'cancel' && !targetSubscription.cancel_at_period_end) {
          sessionConfig.flow_data = {
            type: 'subscription_cancel',
            subscription_cancel: { subscription: targetSubscription.id }
          };
        }
        // If action is 'reactivate' or default, flow_data is omitted to safely open portal home
      }
    }

    const portalSession = await stripe.billingPortal.sessions.create(sessionConfig);
    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load portal." }, { status: 500 });
  }
}