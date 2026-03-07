"use client";

import { useState } from "react";
import { Search, ChevronDown, Car } from "lucide-react";

const mockTrips = [
  { id: "TRPAA001", type: "Sedan", pickup: "Antonietta Heights, Paxton 57353", dropoff: "Gavin Lake, 08789 Bennett Lake", status: "Not Assigned" },
  { id: "TRPAA002", type: "Mini", pickup: "Antonietta Heights, Paxton 57353", dropoff: "Gavin Lake, 08789 Bennett Lake", status: "Not Assigned" },
  { id: "TRPAA003", type: "Sedan", pickup: "Antonietta Heights, Paxton 57353", dropoff: "Gavin Lake, 08789 Bennett Lake", status: "Not Assigned" },
  { id: "TRPAA004", type: "Sedan", pickup: "Antonietta Heights, Paxton 57353", dropoff: "Gavin Lake, 08789 Bennett Lake", status: "Not Assigned" },
];

export default function DispatchersPage() {
  const [selectedTrip, setSelectedTrip] = useState(mockTrips[0].id);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-800">Dispatchers</h1>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-[200px]">
          <input
            type="text"
            placeholder="Search.."
            className="w-full h-10 pl-4 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 bg-white"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
        </div>
        <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
          Status <ChevronDown className="h-3.5 w-3.5 text-orange-500" />
        </button>
      </div>

      {/* Split Layout: Trip Cards + Map */}
      <div className="flex gap-5 h-[550px]">
        {/* Left: Trip Cards */}
        <div className="w-[380px] flex-shrink-0 overflow-y-auto space-y-3 pr-1">
          {mockTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(trip.id)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                selectedTrip === trip.id
                  ? "border-orange-400 shadow-md"
                  : "border-gray-100 shadow-sm hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-gray-800">{trip.id}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-xs text-red-500 font-medium">{trip.status}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{trip.type}</p>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 mt-0.5 rounded-full border-2 border-gray-800 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{trip.pickup}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 mt-0.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{trip.dropoff}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Map + Assign Driver */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Map Placeholder */}
          <div className="flex-1 bg-gray-100 rounded-xl relative overflow-hidden border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Car className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Map will be integrated here</p>
              </div>
            </div>

            {/* Pickup/Dropoff Labels */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md px-3 py-2 space-y-1">
              <p className="text-xs font-medium text-gray-700">Pick Up</p>
              <p className="text-[10px] text-gray-500">Antonietta Heights, Pax...</p>
            </div>
            <div className="absolute bottom-20 left-1/3 bg-white rounded-lg shadow-md px-3 py-2 space-y-1">
              <p className="text-xs font-medium text-gray-700">Drop Off</p>
              <p className="text-[10px] text-gray-500">Gavin Lake, 08789 Benn...</p>
            </div>
          </div>

          {/* Assign Driver */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <Car className="h-5 w-5 text-orange-500" />
              </div>
              <span className="font-semibold text-gray-800">Assign Driver</span>
            </div>
            <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
              Assign Driver <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
