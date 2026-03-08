import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { rideId } = await req.json();

    if (!rideId) {
      return NextResponse.json({ error: "rideId is required" }, { status: 400 });
    }

    // 1. Fetch the ride to get the fare amount
    const { data: ride, error } = await supabaseAdmin
      .from("rides")
      .select("fare, status, payment_status")
      .eq("id", rideId)
      .single();

    if (error || !ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.payment_status === "paid") {
      return NextResponse.json({ error: "Ride is already paid" }, { status: 400 });
    }

    // 2. Create Stripe Checkout Session
    // Convert ₹ fare to paise (Stripe uses the smallest currency unit, e.g. cents/paise)
    const fareInPaise = Math.round(Number(ride.fare) * 100);

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${origin}/customer/ride-track/${rideId}?success=true`,
      cancel_url: `${origin}/customer/ride-track/${rideId}?canceled=true`,
      customer_email: "dummy@kinetiq.app", // Optional: real email if we fetch from users
      metadata: {
        rideId: rideId, // Store rideId to update DB on webhook success
      },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Kinetiq Trip Payment`,
              description: `Ride ID: ${rideId}`,
            },
            unit_amount: fareInPaise,
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
