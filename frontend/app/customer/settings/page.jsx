"use client";

import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and security preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex justify-center py-8">
        <UserProfile 
          appearance={{
            elements: {
              cardBox: "shadow-none",
              rootBox: "w-full max-w-full flex justify-center"
            }
          }}
        />
      </div>
    </div>
  );
}
