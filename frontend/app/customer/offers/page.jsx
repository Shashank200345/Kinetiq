"use client";

import { Tag, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function OffersPage() {
  const [copied, setCopied] = useState(null);

  const offers = [
    { id: 1, title: "50% off your next 3 rides", code: "WELCOME50", expiry: "Valid till Dec 31", description: "Max discount ₹100 per ride. Applicable on Mini and Sedan only." },
    { id: 2, title: "₹150 cashback on Airport rides", code: "FLIGHT150", expiry: "Valid till Nov 15", description: "Valid only on trips starting or ending at the International Airport." },
    { id: 3, title: "10% off on Premium cars", code: "LUXURY10", expiry: "Ongoing", description: "Treat yourself to a premium ride with a flat 10% discount. Max discount ₹500." }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers & Promos</h1>
          <p className="text-sm text-gray-500 mt-1">Unlock discounts and special rewards</p>
        </div>
      </div>

      <div className="grid gap-4">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="bg-orange-50 p-6 md:w-1/3 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-orange-100 border-dashed">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <Tag className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-orange-600 leading-tight">{offer.title}</h3>
            </div>
            
            <div className="p-6 md:w-2/3 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{offer.expiry}</p>
                <p className="text-sm text-gray-600">{offer.description}</p>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3 w-fit">
                  <span className="font-mono font-bold tracking-wider text-gray-800">{offer.code}</span>
                  <button 
                    onClick={() => handleCopy(offer.code)}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                    title="Copy code"
                  >
                    {copied === offer.code ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
