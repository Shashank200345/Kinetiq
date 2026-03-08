"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Navigation, MoreVertical, Search } from "lucide-react";

export default function SavedPlacesPage() {
  const [places] = useState([
    { id: 1, type: "home", label: "Home", address: "Not set yet", icon: Navigation, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
    { id: 2, type: "work", label: "Work", address: "Not set yet", icon: MapPin, bgColor: "bg-orange-50", iconColor: "text-orange-500" }
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Places</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your home, work, and frequent destinations</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <button className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-xl border border-dashed border-gray-200 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Add a new place</p>
              <p className="text-xs text-gray-500">Save a destination for quick booking</p>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {places.map((place) => (
            <div key={place.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${place.bgColor}`}>
                  <place.icon className={`h-6 w-6 ${place.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{place.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{place.address}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Search className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
