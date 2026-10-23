"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Navigation, RotateCcw, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { buildDynamicRouteFromItinerary } from "@/src/website/app/data/geoCities";
import type { PackageRouteData, RouteSegment, RouteLocation } from "@/src/website/app/data/packageRoutes";

interface RouteMapLivePreviewProps {
  itinerary: Array<{
    id?: string;
    dayNumber: number;
    title?: string;
    description?: string;
    city?: string;
    route?: string;
  }>;
  packageTitle?: string;
  packageSlug?: string;
}

export function RouteMapLivePreview({
  itinerary,
  packageTitle = "Tour Route",
  packageSlug = "preview-slug",
}: RouteMapLivePreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const leafletLibRef = useRef<any>(null);

  const [routeData, setRouteData] = useState<PackageRouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Filter valid itinerary days with cities
  const daysWithCities = itinerary.filter(
    (d) => Boolean(d.city && d.city.trim())
  );

  // 1. Build route geometry dynamically whenever itinerary changes
  useEffect(() => {
    let isCancelled = false;

    if (daysWithCities.length === 0) {
      setRouteData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      buildDynamicRouteFromItinerary(packageSlug, packageTitle, itinerary)
        .then((data) => {
          if (!isCancelled) {
            setRouteData(data);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        });
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [itinerary, packageSlug, packageTitle]);

  // 2. Initialize Leaflet instance (Container is permanently mounted)
  useEffect(() => {
    let isMounted = true;
    if (!mapContainerRef.current) return;

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;
      leafletLibRef.current = L;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: [22.5937, 78.9629], // Center of India
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      // OpenStreetMap Standard Free Tiles (100% Free, NO API key required, NO watermark)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      // Dedicated layer group for live route markers & polylines
      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
      setIsMapInitialized(true);

      // Observe container resize to auto-update Leaflet size
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      // Double-trigger size invalidation to handle modal animations
      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 500);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Render markers & segments whenever routeData updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletLibRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !L || !layerGroup) return;

    // Clear old route layers
    layerGroup.clearLayers();

    if (!routeData || routeData.locations.length === 0) {
      return;
    }

    const allCoords: [number, number][] = [];

    // Draw Polylines (Roads / connecting highway lines)
    routeData.segments.forEach((seg: RouteSegment) => {
      if (!seg.path || seg.path.length === 0) return;

      // Glow backdrop line
      L.polyline(seg.path, {
        color: "#6366F1",
        weight: 6,
        opacity: 0.25,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(layerGroup);

      // Core route line
      L.polyline(seg.path, {
        color: "#4F46E5",
        weight: 3.5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(layerGroup);

      seg.path.forEach((p) => allCoords.push(p));
    });

    // Draw Numbered City Markers
    routeData.locations.forEach((loc: RouteLocation, idx: number) => {
      const isStart = idx === 0;
      const isEnd = idx === routeData.locations.length - 1 && routeData.locations.length > 1;
      const dayNumbersText = loc.dayNumbers ? loc.dayNumbers.join(", ") : `${idx + 1}`;
      const pinColor = isStart ? "#10B981" : isEnd ? "#EF4444" : "#4F46E5";

      const iconHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          background: ${pinColor};
          color: white;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
          font-size: 10px;
          font-weight: 800;
          font-family: system-ui, sans-serif;
          cursor: pointer;
        ">
          ${idx + 1}
          <div style="
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 5px solid ${pinColor};
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "live-map-custom-pin",
        html: iconHtml,
        iconSize: [26, 31],
        iconAnchor: [13, 31],
        popupAnchor: [0, -28],
      });

      const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(layerGroup);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 120px; padding: 2px;">
          <div style="font-size: 10px; font-weight: 700; color: #4F46E5; text-transform: uppercase;">
            Day ${dayNumbersText}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #111827; margin-top: 2px;">
            ${loc.name}
          </div>
          ${loc.hindiName ? `<div style="font-size: 10px; color: #6B7280;">${loc.hindiName}</div>` : ""}
        </div>
      `;

      marker.bindPopup(popupContent);
      allCoords.push(loc.coordinates);
    });

    // Fit map view to encompass all markers with padding
    if (allCoords.length > 0) {
      setTimeout(() => {
        try {
          map.invalidateSize();
          const bounds = L.latLngBounds(allCoords);
          map.fitBounds(bounds, { padding: [35, 35], maxZoom: 12 });
        } catch {
          // ignore if unmounted
        }
      }, 100);
    }
  }, [routeData]);

  const handleCenterMap = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = leafletLibRef.current;
    if (!map || !L || !routeData || routeData.locations.length === 0) return;

    map.invalidateSize();
    const allCoords: [number, number][] = [];
    routeData.locations.forEach((l) => allCoords.push(l.coordinates));
    routeData.segments.forEach((s) => s.path.forEach((p) => allCoords.push(p)));

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 12 });
    }
  }, [routeData]);

  return (
    <div className="rounded-xl overflow-hidden border border-indigo-200 shadow-xs bg-white">
      {/* Mini Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-white text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              daysWithCities.length > 0 ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
            }`}
          />
          <span className="font-semibold text-gray-200">Live Route Map:</span>
          {daysWithCities.length > 0 ? (
            <span className="text-emerald-300 font-bold">
              {routeData?.locations.length || daysWithCities.length} Stop
              {(routeData?.locations.length || daysWithCities.length) > 1 ? "s" : ""} Connected
            </span>
          ) : (
            <span className="text-gray-400">Ready for stops</span>
          )}

          {routeData?.totalDistance && (
            <span className="hidden sm:inline-block text-gray-400 border-l border-gray-700 pl-2">
              🛣️ {routeData.totalDistance}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-1 text-[10px] text-amber-300 font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Plotting route...</span>
            </span>
          )}
          {daysWithCities.length > 0 && (
            <button
              type="button"
              onClick={handleCenterMap}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
              title="Reset Map View & Fit All Stops"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Fit View</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Container - Permanently mounted so Leaflet always initializes */}
      <div className="relative w-full bg-slate-100" style={{ height: "280px" }}>
        <div ref={mapContainerRef} className="w-full h-full z-0" style={{ minHeight: "280px" }} />

        {/* Empty state overlay if no cities added yet */}
        {daysWithCities.length === 0 && (
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
            <div className="bg-white/95 rounded-xl px-4 py-3 shadow-lg border border-indigo-100 max-w-sm flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1.5 shadow-2xs">
                <Navigation className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-gray-800">Live Connected Route Preview</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Type your first city above (e.g. <em>Madurai, Jaipur, Delhi</em>) and watch your route connect live!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
