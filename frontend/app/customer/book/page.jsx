"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import LocationSearch from "@/components/LocationSearch";
import { getRoute, calculateFare, getVehicleTypes, reverseGeocode } from "@/lib/map-utils";
import {
  ArrowRight,
  Car,
  Shield,
  Clock,
  MapPin,
  Navigation,
  Loader2,
  Route,
} from "lucide-react";

// Dynamic import MapView (Leaflet needs window)
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center min-h-[400px]">
      <div className="text-center text-gray-400">
        <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

const vehicleIcons = {
  Mini: Car,
  Sedan: Car,
  SUV: Car,
  Premium: Shield,
};

export default function BookRidePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("Sedan");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [nearbyCabs, setNearbyCabs] = useState([]);

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          if (locationData) {
            setPickup(locationData);
            
            // Generate some simulated nearby cabs around the pickup location
            const cabs = Array.from({ length: 5 }).map((_, i) => {
              // Add small random offsets to lat/lng
              const latOffset = (Math.random() - 0.5) * 0.02;
              const lngOffset = (Math.random() - 0.5) * 0.02;
              return {
                id: i,
                lat: latitude + latOffset,
                lng: longitude + lngOffset,
              };
            });
            setNearbyCabs(cabs);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Fetch route when both locations are set
  useEffect(() => {
    async function fetchRoute() {
      if (!pickup || !dropoff) {
        setRouteData(null);
        setRouteCoords(null);
        return;
      }

      setLoading(true);
      const route = await getRoute(pickup, dropoff);
      if (route) {
        setRouteData(route);
        setRouteCoords(route.coordinates);
      }
      setLoading(false);
    }

    fetchRoute();
  }, [pickup, dropoff]);

  const vehicles = routeData
    ? getVehicleTypes(routeData.distance_km)
    : getVehicleTypes(0);

  const currentFare = routeData
    ? calculateFare(routeData.distance_km, selectedVehicle)
    : null;

  const handleBookRide = async () => {
    if (!pickup || !dropoff || !routeData || !user) return;

    setBooking(true);
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          pickup: {
            address: pickup.address,
            lat: pickup.lat,
            lng: pickup.lng,
          },
          dropoff: {
            address: dropoff.address,
            lat: dropoff.lat,
            lng: dropoff.lng,
          },
          vehicleType: selectedVehicle,
          distanceKm: parseFloat(routeData.distance_km),
          fare: parseInt(currentFare),
        }),
      });

      const data = await res.json();
      if (data.ride) {
        router.push(`/customer/ride-track/${data.ride.id}`);
      }
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-800">Book a Ride</h1>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: Booking Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Location Inputs */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-1">
            <LocationSearch
              placeholder="Enter pickup location"
              icon="pickup"
              value={pickup?.address || ""}
              onSelect={(loc) => setPickup(loc)}
            />
            <div className="flex items-center pl-[22px]">
              <div className="w-px h-3 bg-gray-300" />
            </div>
            <LocationSearch
              placeholder="Enter drop-off location"
              icon="dropoff"
              value={dropoff?.address || ""}
              onSelect={(loc) => setDropoff(loc)}
            />
          </div>

          {/* Route Info */}
          {loading && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
              <span className="text-sm text-gray-500">Calculating route...</span>
            </div>
          )}

          {routeData && !loading && (
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Route className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{routeData.distance_km} km</p>
                  <p className="text-xs text-gray-500">~{routeData.duration_min} min</p>
                </div>
              </div>
              <p className="text-xl font-bold text-orange-500">₹{currentFare}</p>
            </div>
          )}

          {/* Vehicle Selection */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Choose Ride</h3>
            <div className="space-y-2">
              {vehicles.map((v) => {
                const carImages = {
                  Mini: "/cars/mini.png",
                  Sedan: "/cars/sedan.png",
                  SUV: "/cars/suv.png",
                  Premium: "/cars/premium.png",
                };
                const etaMap = { Mini: "2 min", Sedan: "3 min", SUV: "5 min", Premium: "4 min" };
                const seatsMap = { Mini: "4", Sedan: "4", SUV: "6", Premium: "4" };
                return (
                  <div
                    key={v.name}
                    onClick={() => setSelectedVehicle(v.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedVehicle === v.name
                        ? "bg-orange-50 border-2 border-orange-300 shadow-sm"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    {/* Car Image */}
                    <div className="w-16 h-12 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={carImages[v.name]}
                        alt={v.name}
                        className="w-full h-full object-contain"
                        style={v.name === "Sedan" ? { transform: "scaleX(-1)" } : {}}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${selectedVehicle === v.name ? "text-orange-600" : "text-gray-800"}`}>
                          {v.name}
                        </p>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {seatsMap[v.name]} seats
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {etaMap[v.name]} away · ₹{v.base} base + ₹{v.perKm}/km
                      </p>
                    </div>

                    {/* Price */}
                    <span className={`text-sm font-bold flex-shrink-0 ${
                      selectedVehicle === v.name ? "text-orange-500" : "text-gray-700"
                    }`}>
                      {routeData ? v.fare : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBookRide}
            disabled={!pickup || !dropoff || !routeData || booking}
            className={`w-full h-12 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              pickup && dropoff && routeData && !booking
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {booking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Booking...
              </>
            ) : (
              <>
                Confirm Ride <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-xl border border-gray-200">
          <MapView
            pickup={pickup}
            dropoff={dropoff}
            routeCoords={routeCoords}
            nearbyCabs={nearbyCabs}
          />

          {/* Route summary overlay */}
          {routeData && pickup && dropoff && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-800" />
                    <span className="text-xs text-gray-600 truncate max-w-[180px]">{pickup.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-xs text-gray-600 truncate max-w-[180px]">{dropoff.address}</span>
                  </div>
                </div>
                <div className="text-right pl-4">
                  <p className="text-lg font-bold text-gray-800">₹{currentFare}</p>
                  <p className="text-xs text-gray-400">{routeData.distance_km} km · ~{routeData.duration_min} min</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
