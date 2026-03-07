"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, X, Loader2 } from "lucide-react";
import { searchLocations } from "@/lib/map-utils";

export default function LocationSearch({
  placeholder = "Enter location",
  icon = "pickup", // "pickup" | "dropoff"
  value = "",
  onSelect,
  className = "",
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced search
  const handleSearch = useCallback((q) => {
    setQuery(q);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (q.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchLocations(q);
      setResults(data);
      setIsOpen(data.length > 0);
      setLoading(false);
    }, 400);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location) => {
    setQuery(location.address);
    setIsOpen(false);
    setResults([]);
    onSelect?.(location);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onSelect?.(null);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        {/* Dot indicator */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {icon === "pickup" ? (
            <div className="w-3 h-3 rounded-full border-2 border-gray-800" />
          ) : (
            <div className="w-3 h-3 rounded-full bg-orange-500" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full h-12 pl-10 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 placeholder-gray-400"
        />

        {/* Clear / Loading */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 text-orange-400 animate-spin" />
          ) : query ? (
            <button onClick={handleClear} className="p-0.5 hover:bg-gray-200 rounded-full">
              <X className="h-3.5 w-3.5 text-gray-400" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-[240px] overflow-y-auto">
          {results.map((loc, i) => (
            <button
              key={i}
              onClick={() => handleSelect(loc)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left border-b border-gray-50 last:border-0"
            >
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{loc.address}</p>
                <p className="text-xs text-gray-400 truncate">{loc.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
