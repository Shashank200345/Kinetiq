"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  MapPin,
  Clock,
  Car,
  Navigation,
  Loader2,
  CheckCircle,
  IndianRupee,
} from "lucide-react";

export default function DriverDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [incomingRides, setIncomingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchRides = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("rides")
        .select(`
          *,
          users!rides_customer_id_fkey (
            name,
            email
          )
        `)
        .eq("status", "requested")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIncomingRides(data || []);
    } catch (err) {
      console.error("Error fetching incoming rides:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides();

    // Subscribe to new rides or cancelled rides
    const channel = supabase
      .channel("incoming_rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
        },
        (payload) => {
          // If a new ride comes in, or an existing ride changes status (e.g. cancelled/accepted by someone else)
          fetchRides();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRides]);

  const handleAcceptRide = async (rideId) => {
    if (!user) return;
    setAcceptingId(rideId);

    try {
      // 1. Get driver's UUID from the users table based on clerk_id
      let { data: driverData, error: driverError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (driverError || !driverData) {
        // Auto-create driver if not found (fallback since no webhook exists)
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || "driver@cabbooking.com",
            name: user.fullName || "Driver",
            role: "driver",
          })
          .select("id")
          .single();

        if (createError) {
          throw new Error("Failed to create driver account in database.");
        }
        driverData = newUser;
      }

      // 2. Accept the ride
      const res = await fetch(`/api/rides/${rideId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_id: driverData.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect to the active trip screen
      router.push(`/driver/ride/${rideId}`);
    } catch (err) {
      console.error("Error accepting ride:", err);
      alert("Failed to accept ride. Maybe another driver already accepted it.");
    } finally {
      setAcceptingId(null);
      fetchRides();
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Incoming Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Accept a trip to start earning
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-700">Finding trips...</span>
        </div>
      </div>

      {incomingRides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">No requests nearby</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-2">
            Stay online and you'll receive notification when a rider requests a trip in your area.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {incomingRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">₹{ride.fare}</h3>
                  <p className="text-xs text-slate-500 font-medium">{ride.distance_km} km total</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {ride.vehicle_type}
                  </span>
                  <p className="text-xs text-slate-500 mt-1 max-w-[120px] truncate">
                    {ride.users?.name || "Customer"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full border border-slate-800 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pickup</p>
                    <p className="text-sm text-slate-700 font-medium leading-snug line-clamp-2">
                      {ride.pickup_location?.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Drop-off</p>
                    <p className="text-sm text-slate-700 font-medium leading-snug line-clamp-2">
                      {ride.dropoff_location?.address}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAcceptRide(ride.id)}
                disabled={acceptingId === ride.id}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {acceptingId === ride.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Accepting...
                  </>
                ) : (
                  <>
                    Accept Trip <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
