"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Loader2, 
  IndianRupee, 
  TrendingUp, 
  Car, 
  Calendar,
  Clock,
  ArrowRight
} from "lucide-react";

export default function DriverEarningsPage() {
  const { user, isLoaded } = useUser();
  const [rides, setRides] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Get driver ID from users table using Clerk ID
      const { data: driverData, error: driverError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (driverError || !driverData) {
        setLoading(false);
        return;
      }

      // 2. Fetch completed/cancelled rides for this driver
      const { data, error } = await supabase
        .from("rides")
        .select(`
          *,
          users!rides_customer_id_fkey (
            name
          )
        `)
        .eq("driver_id", driverData.id)
        .in("status", ["completed", "cancelled"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      // 3. Calculate metrics locally from real data
      const fetchedRides = data || [];
      const earnings = fetchedRides
        .filter((ride) => ride.status === "completed")
        .reduce((sum, ride) => sum + (ride.fare || 0), 0);

      setRides(fetchedRides);
      setTotalEarnings(earnings);
    } catch (err) {
      console.error("Error fetching earnings data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchEarnings();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user, fetchEarnings]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const completedTrips = rides.filter(r => r.status === "completed").length;

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Earnings & History</h1>
          <p className="text-sm text-slate-500 mt-1">Track your income and completed trips</p>
        </div>
        <Link href="/driver/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-slate-400 font-semibold mb-2 flex items-center gap-2">
              <IndianRupee className="h-4 w-4" /> Total Earnings
            </h3>
            <div className="text-4xl font-bold">₹{totalEarnings}</div>
            {totalEarnings > 0 && (
              <p className="text-xs text-green-400 mt-3 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3.5 w-3.5" /> Great job! Keep driving.
              </p>
            )}
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <IndianRupee className="w-32 h-32" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-slate-500 font-semibold mb-2 flex items-center gap-2">
            <Car className="h-4 w-4" /> Total Trips Completed
          </h3>
          <div className="text-4xl font-bold text-slate-800">{completedTrips}</div>
          <div className="mt-3 flex gap-4 text-xs font-medium">
            <span className="text-slate-500">{rides.length} Total Requests</span>
            <span className="text-red-500">{rides.length - completedTrips} Cancelled</span>
          </div>
        </div>
      </div>

      {/* Ride History List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Past Trips</h2>
          <span className="text-sm font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
            {rides.length} records
          </span>
        </div>

        {rides.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Car className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No trips yet</h3>
            <p className="text-slate-500 mt-1">Accept rides on your dashboard to start earning.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rides.map(ride => {
              const isCompleted = ride.status === "completed";
              return (
                <div key={ride.id} className="p-6 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Date & Earnings */}
                    <div className="flex items-center gap-5">
                      <div className="w-14 text-center flex flex-col justify-center items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">
                          {new Date(ride.created_at).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-2xl font-black text-slate-800 leading-none mt-0.5">
                          {new Date(ride.created_at).getDate()}
                        </span>
                      </div>
                      
                      <div className="w-px h-10 bg-slate-200 hidden md:block"></div>

                      <div>
                        {isCompleted ? (
                          <div className="text-xl font-bold text-green-600">₹{ride.fare}</div>
                        ) : (
                          <div className="text-lg font-bold text-red-500 line-through opacity-70">₹{ride.fare}</div>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-1 inline-block ${
                          isCompleted ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
                        }`}>
                          {ride.status}
                        </span>
                        {isCompleted && ride.payment_status === "paid" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-1 ml-2 inline-block bg-blue-50 text-blue-600">
                            Cash out available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Route Details */}
                    <div className="md:text-right flex-1 md:max-w-xs space-y-2">
                      <div className="flex items-center justify-end gap-2 text-sm text-slate-800">
                        <span className="truncate max-w-[120px]" title={ride.pickup_location?.address}>
                          {ride.pickup_location?.address?.split(",")[0] || "Unknown"}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[120px] font-medium" title={ride.dropoff_location?.address}>
                          {ride.dropoff_location?.address?.split(",")[0] || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-end items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5" />
                          {ride.distance_km} km
                        </span>
                        <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">
                          Passenger: {ride.users?.name?.split(" ")[0] || "Guest"}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
