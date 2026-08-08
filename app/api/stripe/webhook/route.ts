export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`❌ Webhook signature failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // ====================================================================
  // 1. HANDLE NEW PURCHASES
  // ====================================================================
  if (event.type === 'checkout.session.completed') {
    console.log("✅ Checkout Session Completed Event Received!");
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;
      const fallbackName = lineItems.data[0]?.description || "Enterprise Service";
      
      console.log(`🏷️ Price ID Found: ${priceId}`);

      // 🚨 REMINDER: Update these with your real Stripe Price IDs!
      const priceDetails: Record<string, { name: string, cycle: string }> = {
        "price_1U0drsCnK1WH2hz2ETrB7CUj": { name: "Utility Grid Twin", cycle: "Monthly" },
        "price_1U0dwrCnK1WH2hz2vRXdFtze": { name: "Utility Grid Twin", cycle: "Annually" },
        "price_1U0dumCnK1WH2hz29ta30zW3": { name: "Pipeline Twin", cycle: "Monthly" },
        "price_1U0dxfCnK1WH2hz2B6V9AMUl": { name: "Pipeline Twin", cycle: "Annually" },
        "price_1U0dvJCnK1WH2hz2XZ6Zlfnm": { name: "Enterprise Convergence", cycle: "Monthly" },
        "price_1U0dyKCnK1WH2hz2aIY9w2Om": { name: "Enterprise Convergence", cycle: "Annually" },
        // --- Additional Services (Replace with your actual Price IDs from Step 1) ---
        "price_1U13FiCnK1WH2hz2EwrOlA7u": { name: "Digital Twins Services", cycle: "Monthly" },
        "price_1U13G8CnK1WH2hz2d1Khdn3z": { name: "Digital Twins Services", cycle: "Annually" },

        "price_1U13HSCnK1WH2hz2zqnZI8xB": { name: "Professional Services", cycle: "Monthly" },
        "price_1U13HqCnK1WH2hz2QKrXe9En": { name: "Professional Services", cycle: "Annually" },

        "price_1U13ICCnK1WH2hz2IeK3uYsE": { name: "Data Services", cycle: "Monthly" },
        "price_1U13IOCnK1WH2hz22xIIcIpH": { name: "Data Services", cycle: "Annually" }
      };
      
      const details = priceId && priceDetails[priceId] ? priceDetails[priceId] : { name: fallbackName, cycle: "Unknown" };
      
      const newPlanObj = {
        name: details.name,
        priceId: priceId || "",
        cycle: details.cycle,
        subscribedAt: new Date().toISOString()
      };
      
      const stripeCustomerId = session.customer as string;
      const userEmail = session.customer_details?.email || session.customer_email || "";
      
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { stripeCustomerId: stripeCustomerId },
            { email: userEmail }
          ]
        },
        include: { domain: true }
      });

      if (!user) return NextResponse.json({ received: true }, { status: 200 });

      const updatePlansArray = (existingPlansRaw: string | null) => {
        let currentPlans: any[] = [];
        try { 
          currentPlans = JSON.parse(existingPlansRaw || "[]"); 
          currentPlans = currentPlans.map(p => typeof p === 'string' ? { name: p, priceId: "", cycle: "Unknown" } : p);
        } catch(e) {}
        currentPlans = currentPlans.filter(p => p.priceId !== priceId);
        currentPlans.push(newPlanObj);
        return JSON.stringify(currentPlans);
      };

      // Update the plans directly on the User record
    await prisma.user.update({
      where: { id: user.id },
      data: { activePlans: updatePlansArray(user.activePlans) }
    });
    } catch (err) {
      console.error("❌ Error processing checkout database update:", err);
    }
  }

// ====================================================================
  // 2. HANDLE CANCELLATIONS & DELETIONS
  // ====================================================================
  if ((event.type as string) === 'customer.subscription.deleted' || (event.type as string) === 'customer.subscription.canceled') {
    console.log("❌ Subscription Deleted/Canceled Event Received!");
    const subscription = event.data.object as Stripe.Subscription;
    
    try {
      const priceId = subscription.items.data[0]?.price?.id;
      const stripeCustomerId = subscription.customer as string;

      if (!priceId || !stripeCustomerId) return NextResponse.json({ received: true }, { status: 200 });

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: stripeCustomerId },
        include: { domain: true }
      });

      if (!user) return NextResponse.json({ received: true }, { status: 200 });

      // Helper to remove the specific canceled plan from the array
      const removePlanFromArray = (existingPlansRaw: string | null) => {
        let currentPlans: any[] = [];
        try { currentPlans = JSON.parse(existingPlansRaw || "[]"); } catch(e) {}
        // Keep all plans EXCEPT the one that matches the canceled Stripe Price ID
        currentPlans = currentPlans.filter(p => p.priceId !== priceId);
        return JSON.stringify(currentPlans);
      };

// Update the plans directly on the User record
await prisma.user.update({
  where: { id: user.id },
  data: { activePlans: removePlanFromArray(user.activePlans) }
});
    } catch (err) {
      console.error("❌ Error processing subscription deletion:", err);
    }
  }

// ====================================================================
  // 3. HANDLE SUBSCRIPTION UPDATES & CANCELLATIONS (e.g. Pending Cancellation)
  // ====================================================================
  if (event.type === 'customer.subscription.updated') {
    console.log("🔄 Subscription Updated Event Received!");
    const subscription = event.data.object as Stripe.Subscription;

    try {
      const priceId = subscription.items.data[0]?.price?.id;
      const stripeCustomerId = subscription.customer as string;

      if (!priceId || !stripeCustomerId) return NextResponse.json({ received: true }, { status: 200 });

      const priceDetails: Record<string, { name: string, cycle: string }> = {
        "price_1U0drsCnK1WH2hz2ETrB7CUj": { name: "Utility Grid Twin", cycle: "Monthly" },
        "price_1U0dwrCnK1WH2hz2vRXdFtze": { name: "Utility Grid Twin", cycle: "Annually" },
        "price_1U0dumCnK1WH2hz29ta30zW3": { name: "Pipeline Twin", cycle: "Monthly" },
        "price_1U0dxfCnK1WH2hz2B6V9AMUl": { name: "Pipeline Twin", cycle: "Annually" },
        "price_1U0dvJCnK1WH2hz2XZ6Zlfnm": { name: "Enterprise Convergence", cycle: "Monthly" },
        "price_1U0dyKCnK1WH2hz2aIY9w2Om": { name: "Enterprise Convergence", cycle: "Annually" },
        "price_1U13FiCnK1WH2hz2EwrOlA7u": { name: "Digital Twins Services", cycle: "Monthly" },
        "price_1U13G8CnK1WH2hz2d1Khdn3z": { name: "Digital Twins Services", cycle: "Annually" },
        "price_1U13HSCnK1WH2hz2zqnZI8xB": { name: "Professional Services", cycle: "Monthly" },
        "price_1U13HqCnK1WH2hz2QKrXe9En": { name: "Professional Services", cycle: "Annually" },
        "price_1U13ICCnK1WH2hz2IeK3uYsE": { name: "Data Services", cycle: "Monthly" },
        "price_1U13IOCnK1WH2hz22xIIcIpH": { name: "Data Services", cycle: "Annually" }
      };

      const details = priceDetails[priceId];
      if (!details) return NextResponse.json({ received: true }, { status: 200 });

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: stripeCustomerId }
      });

      if (!user) return NextResponse.json({ received: true }, { status: 200 });

      let currentPlans: any[] = [];
      try { 
        currentPlans = JSON.parse(user.activePlans || "[]"); 
      } catch(e) {}

      // Clear existing records for this plan name
      currentPlans = currentPlans.filter(p => (typeof p === 'object' ? p.name : p) !== details.name);

      const isFullyCanceled = subscription.status === 'canceled' || subscription.status === 'unpaid';

      // Keep in DB if active, but mark cancelAtPeriodEnd flag
      if (!isFullyCanceled && (subscription.status === 'active' || subscription.status === 'trialing')) {
        currentPlans.push({
          name: details.name,
          priceId: priceId,
          cycle: details.cycle,
          cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
          subscribedAt: new Date().toISOString()
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { activePlans: JSON.stringify(currentPlans) }
      });

    } catch (err) {
      console.error("❌ Error processing subscription update:", err);
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}