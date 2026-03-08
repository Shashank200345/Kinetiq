"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { getRoute } from "@/lib/map-utils";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Navigation,
  CheckCircle,
  Phone,
  User,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center min-h-[300px]">
      <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
    </div>
  ),
});

export default function DriverTripPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef(null);
  const routeIndexRef = useRef(0);

  // Fetch ride data including customer info
  const fetchRide = useCallback(async () => {
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
        .eq("id", id)
        .single();

      if (error) throw error;

      setRide(data);

      if (data.pickup_location && data.dropoff_location) {
        const route = await getRoute(data.pickup_location, data.dropoff_location);
        if (route) setRouteCoords(route.coordinates);
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

  // Real-time subscription to catch cancellations or changes
  useEffect(() => {
    const channel = supabase
      .channel(`driver-ride-${id}`)
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

  // Real-time GPS Tracking
  useEffect(() => {
    let watchId;
    
    // Only track if the driver is arriving or the trip is in progress
    if (ride && (ride.status === "driver_arriving" || ride.status === "in_progress")) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // Optimistically update the driver's own screen
            setRide((prev) => ({ ...prev, current_location: currentLocation }));

            // Send to database for customer to see
            try {
              await fetch(`/api/rides/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ current_location: currentLocation }),
              });
            } catch (err) {
              console.error("Location sync error:", err);
            }
          },
          (err) => {
            console.error("GPS Error:", err);
            // Ignore error 2 (Position Unavailable) if we are just waiting for the Sensor override
          },
          // Relaxed settings so Chrome's manual sensor override works smoothly
          { enableHighAccuracy: false, maximumAge: 0, timeout: 20000 }
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [ride?.status, id, isSimulating]);

  // Simulation Logic (Auto-drive along route)
  useEffect(() => {
    if (isSimulating && routeCoords?.length > 0 && ride && (ride.status === "driver_arriving" || ride.status === "in_progress")) {
      // Find where we are or start at 0
      routeIndexRef.current = 0;
      
      simulationRef.current = setInterval(async () => {
        if (routeIndexRef.current >= routeCoords.length) {
          clearInterval(simulationRef.current);
          setIsSimulating(false);
          return;
        }

        const nextPoint = routeCoords[routeIndexRef.current];
        const currentLocation = { lat: nextPoint[0], lng: nextPoint[1] };
        
        setRide((prev) => ({ ...prev, current_location: currentLocation }));

        try {
          await fetch(`/api/rides/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ current_location: currentLocation }),
          });
        } catch (err) {
          console.error("Simulation sync error:", err);
        }

        // Advance 2 points at a time for speed, adjust as needed
        routeIndexRef.current += 2;
      }, 2000); // Update every 2 seconds
    }

    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [isSimulating, routeCoords, id, ride?.status]);

  const updateRideStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/rides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRide((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleManualMapClick = async (coords) => {
    if (isSimulating) return; // Don't allow manual clicks while auto-driving

    console.log("MAP CLICK RECEIVED IN DRIVER COMPONENT", coords, ride?.status);
    // Only allow manual driving if accepted, arriving, or in progress
    if (ride && (ride.status === "accepted" || ride.status === "driver_arriving" || ride.status === "in_progress")) {
      console.log("RIDE STATUS IS VALID, UPDATING OPTIMISTICALLY");
      const currentLocation = { lat: coords.lat, lng: coords.lng };
      
      // Optimistically update the driver's own screen
      setRide((prev) => ({ ...prev, current_location: currentLocation }));

      // Sync to database so the customer sees the car move
      try {
        console.log("PATCHING TO DATABASE:", currentLocation);
        await fetch(`/api/rides/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_location: currentLocation }),
        });
      } catch (err) {
        console.error("Location sync error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-slate-700">Trip not found</h2>
        <Link href="/driver/dashboard" className="text-green-500 text-sm mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const isCancelled = ride.status === "cancelled";
  const isCompleted = ride.status === "completed";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isCompleted ? "Trip Completed" : isCancelled ? "Trip Cancelled" : "Active Trip"}
          </h1>
          <p className="text-sm text-slate-500 font-mono mt-1">ID: {id.slice(0, 8)}</p>
        </div>
        <Link href="/driver/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          ← Dashboard
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Details and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Passenger</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{ride.users?.name || "Customer"}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">4.9 ★</span>
                    <span>New rider</span>
                  </div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                <Phone className="h-5 w-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Locations</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 mt-1.5 rounded-full border-2 border-slate-800 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Pickup</p>
                  <p className="text-sm text-slate-800 mt-0.5 font-medium">{ride.pickup_location?.address || "—"}</p>
                </div>
              </div>
              <div className="w-0.5 h-6 bg-slate-200 ml-[4px]" />
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Drop-off</p>
                  <p className="text-sm text-slate-800 mt-0.5 font-medium">{ride.dropoff_location?.address || "—"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Est. Earnings</p>
                <p className="text-lg font-bold text-green-600">₹{ride.fare}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Distance</p>
                <p className="text-lg font-bold text-slate-800">{ride.distance_km} km</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Trip Actions</h3>
            
            {ride.status === "accepted" && (
              <button
                onClick={() => updateRideStatus("driver_arriving")}
                disabled={updating}
                className="w-full bg-slate-800 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : "Start Navigation (Arriving)"}
              </button>
            )}

            {ride.status === "driver_arriving" && (
              <button
                onClick={() => updateRideStatus("in_progress")}
                disabled={updating}
                className="w-full bg-orange-500 text-white font-semibold py-3.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : "Passenger Picked Up (Start Trip)"}
              </button>
            )}

            {ride.status === "in_progress" && (
              <button
                onClick={() => updateRideStatus("completed")}
                disabled={updating}
                className="w-full bg-green-500 text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : "Complete Trip (Drop-off)"}
              </button>
            )}

            {/* Simulation Toggle for specific active ride states */}
            {(ride.status === "driver_arriving" || ride.status === "in_progress") && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`w-full font-semibold py-2.5 rounded-xl transition-colors border-2 ${
                    isSimulating 
                      ? "border-red-500 text-red-600 bg-red-50 hover:bg-red-100" 
                      : "border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  {isSimulating ? "Stop Simulation" : "Auto-Drive (DevTest)"}
                </button>
                <p className="text-xs text-center text-slate-400 mt-2">
                  Automatically drives the car along the route for testing Live Tracking.
                </p>
              </div>
            )}
            
            {isCompleted && ride.payment_status !== "paid" && (
              <div className="bg-orange-50 text-orange-700 p-4 rounded-xl flex items-center gap-3 border border-orange-200">
                <Loader2 className="h-6 w-6 animate-spin" />
                <div>
                  <p className="font-bold">Trip Completed</p>
                  <p className="text-sm">Waiting for customer to pay ₹{ride.fare}...</p>
                </div>
              </div>
            )}

            {isCompleted && ride.payment_status === "paid" && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-200">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <p className="font-bold">Payment Received!</p>
                  <p className="text-sm">Earnings added to your wallet. You are free to take new trips.</p>
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 border border-red-200 font-semibold">
                This trip was cancelled.
              </div>
            )}
          </div>
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-3 relative h-[600px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <MapView
            pickup={ride.pickup_location}
            dropoff={ride.dropoff_location}
            routeCoords={routeCoords}
            driverLocation={ride.current_location}
            onMapClick={handleManualMapClick}
          />
        </div>
      </div>
    </div>
  );
}
