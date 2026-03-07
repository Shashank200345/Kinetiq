import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
  // Initialize Stripe inside the handler to avoid build-time crashes
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { amount } = await request.json(); 

    if (!amount) {
        return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      // Stripe expects the amount in the smallest currency unit (e.g., paise for INR)
      amount: amount * 100, 
      currency: "inr", // Change to "inr", "usd", etc. based on your app
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the generated client-secret back to the frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
