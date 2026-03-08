import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;

    try {
      // In production, use process.env.STRIPE_WEBHOOK_SECRET
      // For local testing without a webhook secret, we bypass validation if not set
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(
          bodyText,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } else {
        // Fallback for easy local testing if no webhook secret is provided
        event = JSON.parse(bodyText);
      }
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const rideId = session.metadata?.rideId;

      if (rideId) {
        // Update the ride in Supabase to be marked as paid
        const { error } = await supabaseAdmin
          .from("rides")
          .update({ payment_status: "paid", updated_at: new Date().toISOString() })
          .eq("id", rideId);

        if (error) {
          console.error("Error updating ride payment status:", error);
          return NextResponse.json({ error: "Failed to update DB" }, { status: 500 });
        }
        console.log(`✅ Ride ${rideId} marked as PAID!`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
