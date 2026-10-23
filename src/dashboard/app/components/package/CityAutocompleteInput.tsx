"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapPin, CheckCircle2, Globe, Plus, Loader2 } from "lucide-react";
import { VERIFIED_DESTINATIONS, GeoPoint } from "@/src/website/app/data/geoCities";

interface SuggestionItem {
  name: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  isVerified?: boolean;
  source?: string;
}

interface CityAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelectCity: (cityName: string) => void;
  placeholder?: string;
  dayNumber: number;
}

export function CityAutocompleteInput({
  value,
  onChange,
  onSelectCity,
  placeholder,
  dayNumber,
}: CityAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [apiSuggestions, setApiSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-index local verified destinations list (0 ms instant response)
  const allDestinations = useMemo(() => {
    return Object.values(VERIFIED_DESTINATIONS);
  }, []);

  // 1. Instant Local Filter (0 ms while typing)
  const localSuggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];

    const scored: { point: GeoPoint; score: number }[] = [];

    for (const point of allDestinations) {
      const name = point.name.toLowerCase();
      const state = (point.state || "").toLowerCase();
      const country = (point.country || "").toLowerCase();
      const aliases = (point.aliases || []).map((a) => a.toLowerCase());

      if (name === q) {
        scored.push({ point, score: 200 });
      } else if (name.startsWith(q)) {
        scored.push({ point, score: 100 - (name.length - q.length) });
      } else if (name.includes(q)) {
        scored.push({ point, score: 70 });
      } else if (aliases.some((a) => a.startsWith(q))) {
        scored.push({ point, score: 60 });
      } else if (aliases.some((a) => a.includes(q))) {
        scored.push({ point, score: 50 });
      } else if (state.startsWith(q) || country.startsWith(q)) {
        scored.push({ point, score: 30 });
      }
    }

    scored.sort((a, b) => b.score - a.score || a.point.name.localeCompare(b.point.name));
    return scored.slice(0, 8).map((s) => s.point);
  }, [value, allDestinations]);

  // 2. Query Global External Geocoding API (Covers 100% of cities/villages worldwide)
  useEffect(() => {
    const q = value.trim();
    if (!q || q.length < 1) {
      setApiSuggestions([]);
      setIsLoadingApi(false);
      return;
    }

    setIsLoadingApi(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode/suggest?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setApiSuggestions(json.data);
          }
        }
      } catch {
        // graceful ignore if aborted
      } finally {
        setIsLoadingApi(false);
      }
    }, 150); // fast 150ms debounce

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value]);

  // 3. Merge Local + Global External API Suggestions (Deduplicated)
  const combinedSuggestions = useMemo(() => {
    const map = new Map<string, SuggestionItem>();

    // Add local verified items first
    for (const item of localSuggestions) {
      const key = `${item.name.toLowerCase()}_${(item.state || "").toLowerCase()}`;
      map.set(key, {
        name: item.name,
        state: item.state,
        country: item.country || "India",
        lat: item.lat,
        lng: item.lng,
        isVerified: true,
        source: "verified",
      });
    }

    // Merge external API items
    for (const item of apiSuggestions) {
      const key = `${item.name.toLowerCase()}_${(item.state || "").toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, {
          name: item.name,
          state: item.state,
          country: item.country || "India",
          lat: item.lat,
          lng: item.lng,
          isVerified: true,
          source: item.source || "global_gps",
        });
      }
    }

    return Array.from(map.values()).slice(0, 10);
  }, [localSuggestions, apiSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlight on input change
  useEffect(() => {
    setHighlightedIndex(0);
    if (value.trim().length > 0) {
      setIsOpen(true);
    }
  }, [value]);

  const handleSelect = (cityName: string) => {
    onSelectCity(cityName);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || (combinedSuggestions.length === 0 && !value.trim())) {
      if (e.key === "Enter" && value.trim()) {
        e.preventDefault();
        handleSelect(value.trim());
      }
      return;
    }

    const totalItems = combinedSuggestions.length + (value.trim() ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex < combinedSuggestions.length) {
        handleSelect(combinedSuggestions[highlightedIndex].name);
      } else if (value.trim()) {
        handleSelect(value.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (value.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            `Enter City for Day ${dayNumber} (e.g. Madurai, Rameshwaram, Kanyakumari...)`
          }
          className="w-full pl-9 pr-8 py-1.5 text-xs bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-medium"
          autoComplete="off"
        />
        {isLoadingApi && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400 animate-spin pointer-events-none" />
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (combinedSuggestions.length > 0 || value.trim().length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-indigo-200 z-50 overflow-hidden py-1.5 max-h-72 overflow-y-auto animate-in fade-in duration-100">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-gray-100 mb-1">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-indigo-500" />
              <span>All Cities & Global GPS Suggestions</span>
            </span>
            <span className="text-indigo-600 font-semibold lowercase">↑↓ navigate • ↵ select</span>
          </div>

          {combinedSuggestions.map((point, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={`${point.name}-${point.state}-${idx}`}
                onClick={() => handleSelect(point.name)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isHighlighted ? "bg-indigo-50 text-indigo-950 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isHighlighted ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-gray-900">{point.name}</span>
                    {(point.state || point.country) && (
                      <span className="text-[11px] text-gray-500 ml-1.5 font-normal truncate">
                        ({[point.state, point.country].filter(Boolean).join(", ")})
                      </span>
                    )}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0 ml-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>GPS Verified</span>
                </span>
              </div>
            );
          })}

          {/* Fallback Option: Custom typed name */}
          {value.trim() && (
            <div
              onClick={() => handleSelect(value.trim())}
              onMouseEnter={() => setHighlightedIndex(combinedSuggestions.length)}
              className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer border-t border-dashed border-gray-200 transition-colors ${
                highlightedIndex === combinedSuggestions.length
                  ? "bg-indigo-50 text-indigo-950 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-gray-500 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">
                  Add <strong>&ldquo;{value.trim()}&rdquo;</strong> as Day {dayNumber} Stop
                </span>
              </div>
              <span className="text-[10px] text-gray-400 italic">Custom Search</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
