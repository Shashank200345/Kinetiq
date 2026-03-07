"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// Mock data matching the screenshot
const mockBookings = [
  { id: 1, rider: "Joe Beer", date: "14 Sept 2023\nat 08:30:00", driver: "Ellen Tromp", vehicleType: "Sedan", status: "Booked", fare: "$885.0" },
  { id: 2, rider: "Heather Ullrich", date: "15 Sept 2023\nat 02:00:00", driver: "Ellen Hilll", vehicleType: "MPV", status: "Cancel", fare: "$885.0" },
  { id: 3, rider: "Heather Walsh", date: "15 Sept 2023\nat 12:30:00", driver: "Howard G.", vehicleType: "Mini", status: "Completed", fare: "$885.0" },
  { id: 4, rider: "Jared Wyman", date: "15 Sept 2023\nat 02:00:00", driver: "Coll Tromp", vehicleType: "MPV", status: "Cancel", fare: "$885.0" },
  { id: 5, rider: "Micheal Hessel", date: "14 Sept 2023\nat 08:30:00", driver: "Sam Effertz", vehicleType: "Sedan", status: "Booked", fare: "$885.0" },
  { id: 6, rider: "Lauren Price", date: "15 Sept 2023\nat 02:00:00", driver: "Miss Merle", vehicleType: "MPV", status: "Cancel", fare: "$885.0" },
  { id: 7, rider: "Abel Gaylord", date: "14 Sept 2023\nat 08:30:00", driver: "Domi Olson", vehicleType: "Sedan", status: "Booked", fare: "$885.0" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Booked": return "text-blue-600";
    case "Completed": return "text-green-600";
    case "Cancel": return "text-red-500";
    default: return "text-gray-600";
  }
};

export default function BookingsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-800">Bookings</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
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

        <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
          Booking Date <Calendar className="h-3.5 w-3.5 text-orange-500" />
        </button>

        <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
          Booking For <ChevronDown className="h-3.5 w-3.5 text-orange-500" />
        </button>

        <button className="h-10 px-5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
          Reset Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Sr.</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Rider ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Booking Date ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Driver ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Vehicle Type ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Status ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Fare ↕</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 px-4 text-sm text-gray-600">{booking.id}.</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{booking.rider}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-sm text-gray-600 whitespace-pre-line">{booking.date}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                    <span className="text-sm text-gray-700">{booking.driver}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-sm text-gray-600">{booking.vehicleType}</td>
                <td className={`py-3.5 px-4 text-sm font-medium ${getStatusStyle(booking.status)}`}>
                  {booking.status}
                </td>
                <td className="py-3.5 px-4 text-sm font-medium text-gray-800">{booking.fare}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4 px-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Showing 1 to 7 of 120 entries</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm text-orange-500 font-medium hover:bg-orange-50 rounded">Previous</button>
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-1.5 text-sm text-orange-500 font-medium hover:bg-orange-50 rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
