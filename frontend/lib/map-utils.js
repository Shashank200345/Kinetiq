const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY;

/**
 * Search for locations using Nominatim (OpenStreetMap geocoding)
 * Free, no API key needed
 */
export async function searchLocations(query) {
  if (!query || query.length < 3) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    const data = await res.json();

    return data.map((item) => ({
      display_name: item.display_name,
      address: formatAddress(item),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (err) {
    console.error("Nominatim search error:", err);
    return [];
  }
}

function formatAddress(item) {
  const parts = item.display_name.split(",");
  // Take first 3 parts for a cleaner address
  return parts.slice(0, 3).join(",").trim();
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    const data = await res.json();
    return {
      display_name: data.display_name,
      address: data.display_name.split(",").slice(0, 3).join(",").trim(),
      lat,
      lng,
    };
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return null;
  }
}

/**
 * Get route between two points using OpenRouteService
 * Returns distance, duration, and decoded polyline coordinates
 */
export async function getRoute(pickup, dropoff) {
  if (!ORS_API_KEY) {
    console.error("ORS API key not configured");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${pickup.lng},${pickup.lat}&end=${dropoff.lng},${dropoff.lat}`
    );
    const data = await res.json();

    if (!data.features || data.features.length === 0) return null;

    const feature = data.features[0];
    const summary = feature.properties.summary;

    // ORS returns coordinates as [lng, lat], Leaflet needs [lat, lng]
    const coordinates = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

    return {
      distance_km: (summary.distance / 1000).toFixed(1),
      duration_min: Math.round(summary.duration / 60),
      coordinates, // array of [lat, lng] for the polyline
    };
  } catch (err) {
    console.error("ORS routing error:", err);
    return null;
  }
}

/**
 * Calculate fare based on distance and vehicle type
 */
const PRICING = {
  Mini: { base: 30, perKm: 8, min: 50 },
  Sedan: { base: 50, perKm: 12, min: 80 },
  SUV: { base: 80, perKm: 16, min: 120 },
  Premium: { base: 100, perKm: 20, min: 150 },
};

export function calculateFare(distanceKm, vehicleType = "Sedan") {
  const pricing = PRICING[vehicleType] || PRICING.Sedan;
  const fare = pricing.base + pricing.perKm * parseFloat(distanceKm);
  return Math.max(fare, pricing.min).toFixed(0);
}

export function getVehicleTypes(distanceKm) {
  return Object.entries(PRICING).map(([name, pricing]) => {
    const fare = calculateFare(distanceKm, name);
    return {
      name,
      fare: `₹${fare}`,
      fareNum: parseInt(fare),
      base: pricing.base,
      perKm: pricing.perKm,
    };
  });
}
