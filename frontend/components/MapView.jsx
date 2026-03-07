"use client";

import { useEffect, useRef } from "react";

export default function MapView({ pickup, dropoff, routeCoords, nearbyCabs = [], className = "" }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    // Dynamic import - Leaflet needs `window` (not SSR safe)
    async function initMap() {
      const L = (await import("leaflet")).default;

      // Import CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!mapRef.current) return;

      // If map already initialized, just update
      if (mapInstanceRef.current) {
        updateMap(L);
        return;
      }

      // Default center: India
      const map = L.map(mapRef.current, {
        zoomControl: true,
      }).setView([20.5937, 78.9629], 5);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      mapInstanceRef.current = map;
      updateMap(L);
    }

    function updateMap(L) {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      const bounds = [];

      // Pickup marker
      if (pickup?.lat && pickup?.lng) {
        const pickupIcon = L.divIcon({
          html: '<div style="width:14px;height:14px;background:#1a1a1a;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const marker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(map);
        marker.bindPopup(`<strong>Pickup</strong><br/>${pickup.address || "Pickup point"}`);
        markersRef.current.push(marker);
        bounds.push([pickup.lat, pickup.lng]);
      }

      // Dropoff marker
      if (dropoff?.lat && dropoff?.lng) {
        const dropoffIcon = L.divIcon({
          html: '<div style="width:14px;height:14px;background:#f97316;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const marker = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon }).addTo(map);
        marker.bindPopup(`<strong>Drop-off</strong><br/>${dropoff.address || "Drop-off point"}`);
        markersRef.current.push(marker);
        bounds.push([dropoff.lat, dropoff.lng]);
      }

      // Nearby cabs markers
      if (nearbyCabs && nearbyCabs.length > 0) {
        const cabIcon = L.divIcon({
          html: `<div style="width:28px;height:28px;background:white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15)">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                 </div>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        
        nearbyCabs.forEach(cab => {
          const marker = L.marker([cab.lat, cab.lng], { icon: cabIcon }).addTo(map);
          markersRef.current.push(marker);
          bounds.push([cab.lat, cab.lng]);
        });
      }

      // Route polyline
      if (routeCoords && routeCoords.length > 0) {
        polylineRef.current = L.polyline(routeCoords, {
          color: "#f97316",
          weight: 4,
          opacity: 0.8,
          smoothFactor: 1,
        }).addTo(map);
        bounds.push(...routeCoords);
      }

      // Fit bounds
      if (bounds.length >= 2) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      }
    }

    initMap();

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when props change (without recreating map)
  useEffect(() => {
    async function update() {
      const L = (await import("leaflet")).default;
      if (mapInstanceRef.current) {
        const map = mapInstanceRef.current;

        // Clear old markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        if (polylineRef.current) {
          polylineRef.current.remove();
          polylineRef.current = null;
        }

        const bounds = [];

        if (pickup?.lat && pickup?.lng) {
          const pickupIcon = L.divIcon({
            html: '<div style="width:14px;height:14px;background:#1a1a1a;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
            className: "",
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          const marker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(map);
          marker.bindPopup(`<strong>Pickup</strong><br/>${pickup.address || ""}`);
          markersRef.current.push(marker);
          bounds.push([pickup.lat, pickup.lng]);
        }

        if (dropoff?.lat && dropoff?.lng) {
          const dropoffIcon = L.divIcon({
            html: '<div style="width:14px;height:14px;background:#f97316;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
            className: "",
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          const marker = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon }).addTo(map);
          marker.bindPopup(`<strong>Drop-off</strong><br/>${dropoff.address || ""}`);
          markersRef.current.push(marker);
          bounds.push([dropoff.lat, dropoff.lng]);
        }

        // Nearby cabs markers
        if (nearbyCabs && nearbyCabs.length > 0) {
          const cabIcon = L.divIcon({
            html: `<div style="width:28px;height:28px;background:white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15)">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                   </div>`,
            className: "",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          
          nearbyCabs.forEach(cab => {
            const marker = L.marker([cab.lat, cab.lng], { icon: cabIcon }).addTo(map);
            markersRef.current.push(marker);
            bounds.push([cab.lat, cab.lng]);
          });
        }

        if (routeCoords && routeCoords.length > 0) {
          polylineRef.current = L.polyline(routeCoords, {
            color: "#f97316",
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1,
          }).addTo(map);
        }

        if (bounds.length >= 2) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else if (bounds.length === 1) {
          map.setView(bounds[0], 14);
        }
      }
    }

    update();
  }, [pickup, dropoff, routeCoords, nearbyCabs]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full rounded-xl ${className}`}
      style={{ minHeight: "400px" }}
    />
  );
}
