// app/payment/page.js
"use client";
import { useEffect, useState, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm"; 

// Initialize Stripe outside of component to avoid recreating it on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function PaymentContent() {
  const searchParams = useSearchParams();
  const amountStr = searchParams.get("amount") || "500"; // default to 500 if undefined
  const amount = parseInt(amountStr, 10);
  
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create the payment intent on the backend
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }), 
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Secure Checkout</h1>
        
        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm amount={amount} />
          </Elements>
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
