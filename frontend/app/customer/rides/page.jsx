"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Calendar,
  IndianRupee,
  Navigation,
  CheckCircle,
  XCircle,
  Clock,
  Car
} from "lucide-react";

export default function CustomerRideHistory() {
  const { user, isLoaded } = useUser();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Get the local customer ID based on Clerk ID
      const { data: customerData, error: customerError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (customerError || !customerData) {
        setLoading(false);
        return;
      }

      // 2. Fetch all rides for this customer, ordered by newest first
      const { data, error } = await supabase
        .from("rides")
        .select(`
          *,
          users!rides_driver_id_fkey (
            name,
            phone
          )
        `)
        .eq("customer_id", customerData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRides(data || []);
    } catch (err) {
      console.error("Error fetching ride history:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchRides();
    } else if (isLoaded && !user) {
      setLoading(false); // User logged out
    }
  }, [isLoaded, user, fetchRides]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Rides</h1>
          <p className="text-sm text-slate-500 mt-1">
            View your ride history and past receipts
          </p>
        </div>
        <Link 
          href="/customer/dashboard" 
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {rides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">No rides yet</h2>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
            You haven't booked any rides with Kinetiq yet. When you do, they'll appear here.
          </p>
          <Link
            href="/customer/book"
            className="inline-block bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Book a Ride Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => {
            const isCompleted = ride.status === "completed";
            const isCancelled = ride.status === "cancelled";
            const isActive = !isCompleted && !isCancelled;

            return (
              <div 
                key={ride.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header (Status & Date) */}
                <div className="bg-slate-50 px-5 py-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {isCancelled && <XCircle className="h-5 w-5 text-red-500" />}
                    {isActive && <Clock className="h-5 w-5 text-blue-500" />}
                    <span className={`font-semibold ${
                      isCompleted ? "text-green-700" : 
                      isCancelled ? "text-red-700" : "text-blue-700"
                    }`}>
                      {ride.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(ride.created_at)}</span>
                  </div>
                </div>

                {/* Body (Locations & Details) */}
                <div className="p-5 grid md:grid-cols-[1fr_auto] gap-6">
                  <div className="space-y-4">
                    {/* Route Timeline */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 mt-1.5 rounded-full border-2 border-slate-800 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Pickup</p>
                          <p className="text-sm text-slate-800 mt-0.5 line-clamp-1">
                            {ride.pickup_location?.address || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="w-0.5 h-4 bg-slate-200 ml-[4px]" />
                      <div className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Drop-off</p>
                          <p className="text-sm text-slate-800 mt-0.5 line-clamp-1">
                            {ride.dropoff_location?.address || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Driver info if exists */}
                    {ride.users && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg inline-flex mt-2">
                        <span className="font-medium">Driver:</span> {ride.users.name}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Actions */}
                  <div className="flex flex-col justify-between items-end md:border-l md:border-slate-100 md:pl-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                        {isCancelled ? "Cancelled" : "Total Fare"}
                      </p>
                      <div className={`text-2xl font-bold ${isCancelled ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        ₹{ride.fare}
                      </div>
                      {isCompleted && ride.payment_status === "paid" && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block mt-1">PAID</span>
                      )}
                      {isCompleted && ride.payment_status !== "paid" && (
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block mt-1">PENDING</span>
                      )}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      {isActive ? (
                        <Link
                          href={`/customer/ride-track/${ride.id}`}
                          className="text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View Live Status
                        </Link>
                      ) : (
                        <Link
                          href={`/customer/ride-track/${ride.id}`}
                          className="text-sm font-semibold bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
