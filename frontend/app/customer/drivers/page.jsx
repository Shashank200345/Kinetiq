"use client";

import { useState } from "react";
import { Search, ChevronDown, Calendar, Star, MoreHorizontal } from "lucide-react";

const mockDrivers = [
  { id: "DVR001", name: "Ellen Tromp", phone: "+1 313-487-0073", rating: 4, trips: 10, earning: "$1,56,896.00" },
  { id: "DVR002", name: "Domi Olson", phone: "+1 313-487-0073", rating: 3, trips: 9, earning: "$1,89,896.00" },
  { id: "DVR003", name: "Howard G.", phone: "+1 313-487-0073", rating: 2, trips: 8, earning: "$1,00,896.00" },
  { id: "DVR004", name: "Coll Tromp", phone: "+1 313-487-0073", rating: 4, trips: 5, earning: "$96,896.00" },
  { id: "DVR005", name: "Sam Effertz", phone: "+1 313-487-0073", rating: 3, trips: 5, earning: "$1,65,896.00" },
  { id: "DVR006", name: "Miss Merle", phone: "+1 313-487-0073", rating: 5, trips: 6, earning: "$1,32,896.00" },
  { id: "DVR007", name: "Domi Olson", phone: "+1 313-487-0073", rating: 5, trips: 9, earning: "$1,59,896.00" },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function DriversPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-800">Driver</h1>

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
          Ratings <ChevronDown className="h-3.5 w-3.5 text-orange-500" />
        </button>

        <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
          Status <ChevronDown className="h-3.5 w-3.5 text-orange-500" />
        </button>

        <button className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
          From Date <Calendar className="h-3.5 w-3.5 text-orange-500" />
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
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Driver ID</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Driver ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Mobile Number ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Ratings ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Total Trips ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Total Earning ↕</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {mockDrivers.map((driver) => (
              <tr key={driver.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 px-4 text-sm font-medium text-gray-800">{driver.id}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{driver.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-sm text-gray-600">{driver.phone}</td>
                <td className="py-3.5 px-4">
                  <StarRating rating={driver.rating} />
                </td>
                <td className="py-3.5 px-4 text-sm text-gray-600 text-center">{String(driver.trips).padStart(2, "0")}</td>
                <td className="py-3.5 px-4 text-sm font-medium text-gray-800">{driver.earning}</td>
                <td className="py-3.5 px-4">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="h-4 w-4 text-orange-500" />
                  </button>
                </td>
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
