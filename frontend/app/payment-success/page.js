// app/payment-success/page.js
export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your ride has been successfully booked. Our driver is on the way.
        </p>
        <a 
          href="/" 
          className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
