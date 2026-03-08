"use client";

import { UserProfile } from "@clerk/nextjs";

export default function DriverSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information and security preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex justify-center py-8">
        <UserProfile 
          appearance={{
            elements: {
              cardBox: "shadow-none",
              rootBox: "w-full max-w-full flex justify-center",
              primaryButton: "bg-slate-900 hover:bg-slate-800"
            }
          }}
        />
      </div>
    </div>
  );
}
