export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', { 
  apiVersion: '2023-10-16' as any 
});
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

  if (event.type === 'checkout.session.completed') {
    console.log("✅ Checkout Session Completed Event Received!");
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // 1. Get the price ID
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;
      const fallbackName = lineItems.data[0]?.description || "Enterprise Convergence";
      
      console.log(`🏷️ Price ID Found: ${priceId}`);

      // Map Price IDs to exact Names and Cycles
      const priceDetails: Record<string, { name: string, cycle: string }> = {
        "price_1U0drsCnK1WH2hz2ETrB7CUj": { name: "Utility Grid Twin", cycle: "Monthly" },
        "price_1U0dwrCnK1WH2hz2vRXdFtze": { name: "Utility Grid Twin", cycle: "Annually" },
        "price_1U0dumCnK1WH2hz29ta30zW3": { name: "Pipeline Twin", cycle: "Monthly" },
        "price_1U0dxfCnK1WH2hz2B6V9AMUl": { name: "Pipeline Twin", cycle: "Annually" },
        "price_1U0dvJCnK1WH2hz2XZ6Zlfnm": { name: "Enterprise Convergence", cycle: "Monthly" },
        "price_1U0dyKCnK1WH2hz2aIY9w2Om": { name: "Enterprise Convergence", cycle: "Annually" }
      };
      
      const details = priceId && priceDetails[priceId] ? priceDetails[priceId] : { name: fallbackName, cycle: "Unknown" };
      
      // CREATE THE DETAILED PLAN OBJECT
      const newPlanObj = {
        name: details.name,
        priceId: priceId || "",
        cycle: details.cycle
      };

      console.log(`📦 Upgrading to Plan: ${details.name} (${details.cycle})`);
      
      // 2. Find user by Customer ID (Safest) or Email
      const stripeCustomerId = session.customer as string;
      const userEmail = session.customer_details?.email || session.customer_email || "";
      
      console.log(`🔍 Looking for user with Stripe ID: ${stripeCustomerId} OR Email: ${userEmail}`);

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { stripeCustomerId: stripeCustomerId },
            { email: userEmail }
          ]
        },
        include: { organization: true }
      });

      if (!user) {
        console.error("❌ CRITICAL: User not found in database! Plan not applied.");
        return NextResponse.json({ received: true }, { status: 200 });
      }

      console.log(`👤 Found User: ${user.email}. Organization ID: ${user.organization?.id || 'None (Solo User)'}`);

      // Helper function to safely update the JSON array with the new object
      const updatePlansArray = (existingPlansRaw: string | null) => {
        let currentPlans: any[] = [];
        try { 
          currentPlans = JSON.parse(existingPlansRaw || "[]"); 
          // Safely map any legacy string arrays to objects just in case
          currentPlans = currentPlans.map(p => typeof p === 'string' ? { name: p, priceId: "", cycle: "Unknown" } : p);
        } catch(e) {}
        
        // Remove any existing plan object that has the EXACT same priceId to avoid duplicates
        currentPlans = currentPlans.filter(p => p.priceId !== priceId);
        currentPlans.push(newPlanObj);
        return JSON.stringify(currentPlans);
      };

      // 3. Update the database
      if (user.organization) {
        await prisma.organization.update({
          where: { id: user.organization.id },
          data: {
            subscriptionStatus: "active",
            activePlans: updatePlansArray(user.organization.activePlans)
          }
        });
        console.log("💾 Successfully updated Organization table!");
      } 
      else {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: "active",
            activePlans: updatePlansArray(user.activePlans)
          }
        });
        console.log("💾 Successfully updated User table directly!");
      }
    } catch (err) {
      console.error("❌ Error processing checkout database update:", err);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}