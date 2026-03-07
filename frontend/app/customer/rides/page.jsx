"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Car, Clock, MapPin, Filter, ChevronDown } from "lucide-react";

export default function MyRidesPage() {
  const { user, isLoaded } = useUser();
  const [rides, setRides] = useState([]);
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
            .order("created_at", { ascending: false });

          setRides(data || []);
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">My Rides</h1>
        <button className="flex items-center gap-2 h-9 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
          <Filter className="h-3.5 w-3.5" /> Filter <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : rides.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Car className="h-16 w-16 text-gray-200 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 mb-1">No rides yet</h3>
          <p className="text-sm text-gray-400">Your ride history will appear here after your first trip.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {ride.vehicle_type || "Standard"} Ride
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(ride.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">₹{ride.fare || "—"}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusStyle(ride.status)}`}>
                    {ride.status?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-2 pl-1">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 mt-1 rounded-full border-2 border-gray-700 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    {ride.pickup_location?.address || "Pickup location"}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 mt-1 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    {ride.dropoff_location?.address || "Drop-off location"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
