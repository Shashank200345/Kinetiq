"use client";

import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";

export default function WalletPage() {
  const transactions = [
    { id: 1, type: "payment",  title: "Ride Payment", date: "Today, 10:45 AM", amount: "-₹145.00", icon: ArrowUpRight, color: "text-red-500", bg: "bg-red-50" },
    { id: 2, type: "topup",    title: "Wallet Top-up",  date: "Yesterday, 2:30 PM", amount: "+₹500.00", icon: ArrowDownLeft, color: "text-green-500", bg: "bg-green-50" },
    { id: 3, type: "promo",    title: "Promo Applied",  date: "Mon, 1:15 PM", amount: "+₹50.00", icon: Receipt, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kinetiq Wallet</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your balance and payment methods</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold">₹405.00</h2>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <WalletIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="mt-8 flex gap-3 relative z-10">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" /> Add Money
          </button>
        </div>
        
        {/* Decorative circle */}
        <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map(t => (
            <div key={t.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.bg}`}>
                  <t.icon className={`h-5 w-5 ${t.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.date}</p>
                </div>
              </div>
              <div className={`text-sm font-bold ${t.amount.startsWith("+") ? "text-green-600" : "text-gray-800"}`}>
                {t.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
