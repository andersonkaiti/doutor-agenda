import { db } from "@db/index";
import { usersTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key or webhook secret key not found");
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    throw new Error("Stripe signature not found");
  }

  const text = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });

  // HMAC com SHA256
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      if (!event.data.object.id) {
        throw new Error("Invoice ID not found");
      }

      const { parent, customer } = event.data.object as unknown as {
        customer: string;
        parent: {
          subscription_details: {
            metadata: {
              userId: string;
            };
            subscription: string;
          };
        };
      };

      if (!parent.subscription_details.subscription) {
        throw new Error("Subscription not found");
      }

      const { userId } = parent.subscription_details.metadata;

      if (!userId) {
        throw new Error("User ID not found");
      }

      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: parent.subscription_details.subscription,
          stripeCustomerId: customer,
          plan: "essential",
        })
        .where(eq(usersTable.id, userId));

      break;
    }

    case "customer.subscription.deleted": {
      if (!event.data.object.id) {
        throw new Error("Invoice ID not found");
      }

      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      const { userId } = subscription.metadata;

      if (!userId) {
        throw new Error("User ID not found");
      }

      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          plan: null,
        })
        .where(eq(usersTable.id, userId));

      break;
    }
  }

  return NextResponse.json({
    received: true,
  });
}
