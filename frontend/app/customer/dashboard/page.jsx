"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Car,
  ArrowRight,
  Navigation,
  CalendarClock,
  Package,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [rides, setRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRides() {
      if (!user) return;
      try {
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", user.id)
          .single();

        if (userData?.id) {
          const { data } = await supabase
            .from("rides")
            .select("*")
            .eq("customer_id", userData.id)
            .order("created_at", { ascending: false })
            .limit(3);

          setRides(data || []);

          // Check for active ride
          const { data: active } = await supabase
            .from("rides")
            .select("*")
            .eq("customer_id", userData.id)
            .in("status", ["requested", "accepted", "driver_arriving", "in_progress"])
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (active) setActiveRide(active);
        }
      } catch (err) {
        console.error("Failed to fetch rides:", err);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) fetchRides();
  }, [user, isLoaded]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "requested": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Ride Banner */}
      {activeRide && (
        <Link href={`/customer/ride-track/${activeRide.id}`}>
          <div className="bg-orange-500 text-white rounded-xl p-4 flex items-center justify-between hover:bg-orange-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Active Ride</p>
                <p className="text-xs text-orange-100">{activeRide.dropoff_location?.address || "In progress"}</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>
      )}

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hi, {isLoaded && user ? user.firstName : "..."} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Where would you like to go today?</p>
      </div>

      {/* Quick Booking Card */}
      <Link href="/customer/book">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-700" />
                <span className="text-sm text-gray-400">Where from?</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-400">Where to?</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/customer/book" className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all text-center group">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-100 transition-colors">
            <Car className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-sm font-medium text-gray-800">Ride</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Book now</p>
        </Link>

        <Link href="/customer/book" className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all text-center group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-100 transition-colors">
            <CalendarClock className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-800">Schedule</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Plan ahead</p>
        </Link>

        <Link href="/customer/book" className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all text-center group">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-green-100 transition-colors">
            <Package className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-800">Package</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Send items</p>
        </Link>
      </div>

      {/* Saved Places */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Saved Places</h3>
        <div className="space-y-3">
          <Link href="/customer/book" className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Navigation className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Home</p>
              <p className="text-xs text-gray-400 truncate">Add your home address</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
          <div className="border-t border-gray-50" />
          <Link href="/customer/book" className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Work</p>
              <p className="text-xs text-gray-400 truncate">Add your work address</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="text-sm font-semibold text-gray-800">Recent Rides</h3>
          <Link href="/customer/rides" className="text-xs font-medium text-orange-500 hover:text-orange-600">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="px-5 pb-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="px-5 pb-8 text-center">
            <Clock className="h-10 w-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No rides yet</p>
            <Link href="/customer/book" className="text-xs font-medium text-orange-500 hover:text-orange-600 mt-1 inline-block">
              Book your first ride →
            </Link>
          </div>
        ) : (
          <div className="px-5 pb-4 space-y-2">
            {rides.map((ride) => (
              <div key={ride.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {ride.dropoff_location?.address || "Destination"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(ride.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-800">₹{ride.fare || "—"}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getStatusStyle(ride.status)}`}>
                    {ride.status?.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
