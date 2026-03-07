// components/CheckoutForm.js
"use client";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`, // Redirects back to site
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Complete Payment: ₹{amount}</h2>
      
      <PaymentElement />
      
      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
      
      <button 
        disabled={isProcessing || !stripe || !elements} 
        className="mt-4 bg-black text-white p-3 rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
}
