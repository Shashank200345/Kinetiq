"use client";

import { useUser } from "@clerk/nextjs";
import { UserCheck, Edit3, Car, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";

export default function DriverProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="animate-pulse space-y-4 max-w-2xl mx-auto"><div className="h-32 bg-slate-200 rounded-xl"></div></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your driver identity and vehicle info</p>
        </div>
        <Link 
          href="/driver/settings" 
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Edit3 className="h-4 w-4" /> Edit Details
        </Link>
      </div>

      {/* Primary Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
            <img 
              src={user?.imageUrl || "https://ui-avatars.com/api/?name=Driver&background=020617&color=fff"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-bold text-slate-800">{user?.fullName || "Kinetiq Driver"}</h2>
              <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-4">Partner since Oct 2023</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Mail className="h-4 w-4 text-slate-400" />
                {user?.primaryEmailAddress?.emailAddress || "driver@example.com"}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Phone className="h-4 w-4 text-slate-400" />
                {user?.primaryPhoneNumber?.phoneNumber || "+91 (XXX) XXX-XXXX"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Car className="h-5 w-5 text-slate-400" /> Vehicle Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Make & Model</p>
              <p className="text-slate-800 font-medium">Toyota Innova Crysta (White)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Registration Number</p>
              <p className="text-slate-800 font-medium font-mono">DL 01 AA 1234</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Vehicle Class</p>
              <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                SUV
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="h-5 w-5 text-slate-400" /> License & Documents
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-xl border border-green-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Commercial Driving License</p>
                <p className="text-xs text-slate-500 mt-0.5">Expires: 12 Nov 2029</p>
              </div>
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Verified</div>
            </div>
            <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-xl border border-green-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Background Check</p>
                <p className="text-xs text-slate-500 mt-0.5">Completed: 15 Oct 2023</p>
              </div>
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Passed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
