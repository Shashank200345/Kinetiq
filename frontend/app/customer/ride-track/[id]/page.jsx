"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { getRoute } from "@/lib/map-utils";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  MapPin,
  Phone,
  ArrowRight,
  Navigation,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center min-h-[300px]">
      <Loader2 className="h-8 w-8 text-orange-400 animate-spin" />
    </div>
  ),
});

const STATUS_STEPS = [
  { key: "requested", label: "Ride Requested", icon: Clock, desc: "Looking for a driver near you..." },
  { key: "accepted", label: "Driver Matched", icon: CheckCircle2, desc: "A driver has accepted your ride" },
  { key: "driver_arriving", label: "Driver Arriving", icon: Car, desc: "Your driver is on the way" },
  { key: "in_progress", label: "On Trip", icon: Navigation, desc: "Enjoy your ride!" },
  { key: "completed", label: "Completed", icon: CheckCircle2, desc: "You have arrived at your destination" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, desc: "This ride was cancelled" },
];

function getStepIndex(status) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function RideTrackPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ride data
  const fetchRide = useCallback(async () => {
    try {
      const res = await fetch(`/api/rides/${id}`);
      const data = await res.json();
      if (data.ride) {
        setRide(data.ride);

        // Fetch route for map
        if (data.ride.pickup_location && data.ride.dropoff_location) {
          const route = await getRoute(data.ride.pickup_location, data.ride.dropoff_location);
          if (route) setRouteCoords(route.coordinates);
        }
      }
    } catch (err) {
      console.error("Error fetching ride:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRide();
  }, [fetchRide]);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`ride-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `id=eq.${id}` },
        (payload) => {
          setRide((prev) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleCancel = async () => {
    try {
      await fetch(`/api/rides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      setRide((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-gray-700">Ride not found</h2>
        <Link href="/customer/book" className="text-orange-500 text-sm mt-2 inline-block">
          Book a new ride →
        </Link>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(ride.status);
  const isCancelled = ride.status === "cancelled";
  const isCompleted = ride.status === "completed";
  const isActive = !isCancelled && !isCompleted;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          {isCompleted ? "Ride Completed" : isCancelled ? "Ride Cancelled" : "Tracking Ride"}
        </h1>
        <span className="text-xs text-gray-400 font-mono">{id.slice(0, 8)}...</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: Status + Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status Steps */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Ride Status</h3>
            <div className="space-y-0">
              {STATUS_STEPS.filter((s) => s.key !== "cancelled").map((step, i) => {
                const isReached = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex gap-3">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrent && isActive
                          ? "bg-orange-500 text-white"
                          : isReached
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-300"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < 4 && (
                        <div className={`w-0.5 h-8 ${isReached && i < currentStepIdx ? "bg-green-300" : "bg-gray-200"}`} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${
                        isCurrent && isActive ? "text-orange-600" : isReached ? "text-gray-800" : "text-gray-400"
                      }`}>
                        {step.label}
                      </p>
                      {isCurrent && isActive && (
                        <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {isCancelled && (
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 font-medium">Ride was cancelled</span>
              </div>
            )}
          </div>

          {/* Trip Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Trip Details</h3>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 mt-1.5 rounded-full border-2 border-gray-800 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="text-sm text-gray-700">{ride.pickup_location?.address || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Drop-off</p>
                  <p className="text-sm text-gray-700">{ride.dropoff_location?.address || "—"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mt-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-400">Distance</p>
                <p className="text-sm font-semibold text-gray-800">{ride.distance_km || "—"} km</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fare</p>
                <p className="text-sm font-semibold text-orange-500">₹{ride.fare || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Vehicle</p>
                <p className="text-sm font-semibold text-gray-800">{ride.vehicle_type || "Sedan"}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isActive && (
            <button
              onClick={handleCancel}
              className="w-full h-10 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Cancel Ride
            </button>
          )}

          {isCompleted && (
            <Link
              href={`/payment?amount=${ride.fare}`}
              className="w-full h-12 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              Pay ₹{ride.fare} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-xl border border-gray-200">
          <MapView
            pickup={ride.pickup_location}
            dropoff={ride.dropoff_location}
            routeCoords={routeCoords}
          />
        </div>
      </div>
    </div>
  );
}
