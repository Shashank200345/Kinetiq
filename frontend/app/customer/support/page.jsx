"use client";

import { HelpCircle, FileText, Shield, AlertTriangle, Phone, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const categories = [
    { title: "Trip Issues & Refunds", icon: AlertTriangle, desc: "Report a problem with a recent ride" },
    { title: "Account & Payment", icon: Shield, desc: "Manage your profile and cards" },
    { title: "Safety Concerns", icon: HelpCircle, desc: "Report an incident or safety issue" },
    { title: "Policies & Terms", icon: FileText, desc: "Read our community guidelines" }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">How can we help you today?</p>
      </div>

      {/* Categories */}
      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((cat, i) => (
          <button key={i} className="text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
              <cat.icon className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{cat.title}</h3>
            <p className="text-xs text-gray-500">{cat.desc}</p>
          </button>
        ))}
      </div>

      {/* Direct Contact */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl mt-8">
        <h3 className="font-bold mb-4">Still need help?</h3>
        <div className="space-y-3">
          <Link href="tel:18001234567" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Call Us</p>
                <p className="text-xs text-slate-400">24/7 Priority Support</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-500" />
          </Link>

          <Link href="mailto:support@kinetiq.com" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Email Support</p>
                <p className="text-xs text-slate-400">Response within 2 hours</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
