"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MapPin,
  Compass,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Navigation,
  Plane,
  Mountain,
  Layers,
  Info,
  Calendar,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import {
  findPackageRoute,
  PackageRouteData,
  RouteLocation,
  RouteSegment,
} from "../data/packageRoutes";
import { buildDynamicRouteFromItinerary } from "../data/geoCities";

interface PackageRouteMapProps {
  packageSlug: string;
  packageTitle: string;
  enableRouteMap?: boolean;
  itinerary?: Array<any>;
  selectedDay?: number | null;
  onSelectDay?: (day: number | null) => void;
  onScrollToDay?: (day: number) => void;
}

const DAY_FOCUS_MAP: Record<number, string> = {
  1: "lucknow",
  2: "nepalgunj",
  3: "hilsa",
  4: "purang",
  5: "mansarovar",
  6: "darchen",
  7: "dirapuk",
  8: "dolma-la",
  9: "zuthulpuk",
  10: "lucknow",
  11: "lucknow",
};

export function PackageRouteMap({
  packageSlug,
  packageTitle,
  enableRouteMap,
  itinerary = [],
  selectedDay = null,
  onSelectDay,
  onScrollToDay,
}: PackageRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const polylinesRef = useRef<Record<string, any>>({});
  const leafletLibRef = useRef<any>(null);

  const [activeLocation, setActiveLocation] = useState<RouteLocation | null>(null);
  const [currentDay, setCurrentDay] = useState<number | null>(selectedDay);
  const [mapType, setMapType] = useState<"topo" | "osm">("topo");
  const [tileLayerRef, setTileLayerRef] = useState<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Retrieve route dataset (static curated or dynamically synthesized)
  const [routeData, setRouteData] = useState<PackageRouteData | null>(() =>
    findPackageRoute(packageSlug, packageTitle)
  );
  const [isBuildingDynamic, setIsBuildingDynamic] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const staticRoute = findPackageRoute(packageSlug, packageTitle);
    if (staticRoute) {
      setRouteData(staticRoute);
      setIsBuildingDynamic(false);
      return;
    }

    // Build dynamically from itinerary if route map is not explicitly disabled
    if (enableRouteMap !== false && itinerary && itinerary.length > 0) {
      setIsBuildingDynamic(true);
      buildDynamicRouteFromItinerary(packageSlug, packageTitle, itinerary)
        .then((dynamicRoute) => {
          if (isMounted) {
            setRouteData(dynamicRoute);
            setIsBuildingDynamic(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsBuildingDynamic(false);
        });
    } else {
      setRouteData(null);
      setIsBuildingDynamic(false);
    }

    return () => {
      isMounted = false;
    };
  }, [packageSlug, packageTitle, itinerary, enableRouteMap]);

  // Sync external selectedDay prop changes
  useEffect(() => {
    if (selectedDay !== undefined) {
      setCurrentDay(selectedDay);
    }
  }, [selectedDay]);

  const handleDayChange = (day: number | null) => {
    setCurrentDay(day);
    if (onSelectDay) onSelectDay(day);
  };

  // ━━━ Initialize Leaflet Map ━━━
  useEffect(() => {
    let isMounted = true;

    if (!routeData || !mapContainerRef.current) return;

    // Load Leaflet CSS dynamically if not present
    const cssId = "leaflet-stylesheet";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // Dynamically import Leaflet (client-only)
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      leafletLibRef.current = L;

      // Prevent re-initialization if map instance exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map with center on first location or central coordinates
      const firstCoord = routeData.locations[0]?.coordinates || [28.5, 81.5];
      const map = L.map(mapContainerRef.current, {
        center: firstCoord,
        zoom: 7,
        zoomControl: false,
        scrollWheelZoom: false, // Prevents page scroll trapping on touch / mouse
        attributionControl: false,
      });

      // Esri World Topographic tiles (rich Himalayan terrain, mountains & natural relief, NO API key required)
      const topoTile = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
        }
      );

      topoTile.addTo(map);
      setTileLayerRef(topoTile);

      mapInstanceRef.current = map;

      // ━━━ Draw Segments (Polylines) ━━━
      const polylinesMap: Record<string, any> = {};

      routeData.segments.forEach((seg: RouteSegment) => {
        const isRoad = seg.mode === "road";
        const isFlight = seg.mode === "flight";
        const isHeli = seg.mode === "helicopter";
        const isTrek = seg.mode === "trek";

        const baseColor = isRoad
          ? "#D97706" // Gold/Amber
          : isFlight
          ? "#2563EB" // Royal Blue
          : isHeli
          ? "#7C3AED" // Purple
          : "#059669"; // Emerald Trek

        const dashArray = isRoad ? undefined : isFlight ? "8, 8" : isHeli ? "4, 6" : "6, 6";
        const weight = isTrek ? 4 : isRoad ? 4.5 : 3.5;

        // Subtle glow backdrop polyline
        const glowLine = L.polyline(seg.path, {
          color: baseColor,
          weight: weight + 3,
          opacity: 0.25,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        // Core path line
        const polyline = L.polyline(seg.path, {
          color: baseColor,
          weight: weight,
          opacity: 0.9,
          dashArray: dashArray,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        polyline.on("click", () => {
          const firstDay = seg.dayNumbers[0] || null;
          handleDayChange(firstDay);
        });

        // Hover tooltip
        const modeLabel = isRoad
          ? "🚗 Road Travel"
          : isFlight
          ? "✈️ Flight"
          : isHeli
          ? "🚁 Helicopter"
          : "🥾 Sacred Trek";

        polyline.bindTooltip(
          `<div class="text-xs font-sans">
            <p class="font-bold text-gray-900">${seg.title}</p>
            <p class="text-gray-600 text-[11px]">${modeLabel}${seg.distance ? ` • ${seg.distance}` : ""}</p>
            <p class="text-[10px] text-amber-600 font-semibold mt-0.5">Day(s): ${seg.dayNumbers.join(", ")}</p>
          </div>`,
          { sticky: true, className: "custom-leaflet-tooltip" }
        );

        polylinesMap[seg.id] = { polyline, glowLine, baseColor, weight, dashArray, seg };
      });

      polylinesRef.current = polylinesMap;

      // ━━━ Draw Markers ━━━
      const markersMap: Record<string, any> = {};

      routeData.locations.forEach((loc: RouteLocation, index: number) => {
        const isStart = loc.type === "start";
        const isSacred = loc.type === "sacred_site";
        const isPass = loc.type === "mountain_pass";

        const iconHtml = `
          <div class="route-marker-container group" style="transform: translate(-50%, -50%);">
            <div class="relative flex items-center justify-center">
              <!-- Halo / Ping for key sites -->
              ${
                isSacred || isPass
                  ? '<div class="absolute -inset-1.5 rounded-full bg-amber-400/40 animate-ping opacity-60"></div>'
                  : ""
              }
              <!-- Pin Circle -->
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg border-2 border-white transition-transform duration-200 group-hover:scale-125 cursor-pointer ${
                isStart
                  ? "bg-slate-900 text-amber-400 ring-2 ring-slate-900"
                  : isPass
                  ? "bg-red-600 text-white ring-2 ring-red-400"
                  : isSacred
                  ? "bg-amber-500 text-slate-950 ring-2 ring-amber-400"
                  : "bg-amber-400 text-slate-950 ring-2 ring-amber-300"
              }">
                ${index + 1}
              </div>
              <!-- Floating label above pin -->
              <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold shadow-md border border-white/20 pointer-events-none">
                ${loc.name}
              </div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(map);

        marker.on("click", () => {
          setActiveLocation(loc);
          if (loc.dayNumbers && loc.dayNumbers.length > 0) {
            handleDayChange(loc.dayNumbers[0]);
          }
        });

        markersMap[loc.id] = { marker, loc };
      });

      markersRef.current = markersMap;

      // ━━━ Fit Bounds to Entire Route ━━━
      const allCoords: [number, number][] = [];
      routeData.locations.forEach((l) => allCoords.push(l.coordinates));
      routeData.segments.forEach((s) => s.path.forEach((p) => allCoords.push(p)));

      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      setIsMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [routeData]);

  // Re-calculate map size when toggling fullscreen
  useEffect(() => {
    if (mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen]);

  // ━━━ Switch Tile Providers (Topographic vs Standard OSM) ━━━
  const toggleMapTile = () => {
    if (!mapInstanceRef.current || !leafletLibRef.current) return;
    const L = leafletLibRef.current;
    const map = mapInstanceRef.current;

    if (tileLayerRef) {
      map.removeLayer(tileLayerRef);
    }

    if (mapType === "topo") {
      const osmTile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      setTileLayerRef(osmTile);
      setMapType("osm");
    } else {
      const topoTile = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
        }
      ).addTo(map);
      setTileLayerRef(topoTile);
      setMapType("topo");
    }
  };

  // ━━━ Reset / Fit Route Bounds ━━━
  const handleResetView = useCallback(() => {
    if (!mapInstanceRef.current || !leafletLibRef.current || !routeData) return;
    const L = leafletLibRef.current;
    const map = mapInstanceRef.current;

    handleDayChange(null);
    setActiveLocation(null);

    const allCoords: [number, number][] = [];
    routeData.locations.forEach((l) => allCoords.push(l.coordinates));
    routeData.segments.forEach((s) => s.path.forEach((p) => allCoords.push(p)));

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [routeData]);

  // ━━━ Highlight Selected Day on Map ━━━
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !routeData) return;

    const polylines = polylinesRef.current;
    const markers = markersRef.current;

    // 1. Update Polylines Styling
    Object.values(polylines).forEach((item: any) => {
      const { polyline, glowLine, baseColor, weight, dashArray, seg } = item;
      const isSegmentInDay = currentDay === null || seg.dayNumbers.includes(currentDay);

      if (currentDay === null) {
        // Reset all lines to active state
        polyline.setStyle({
          color: baseColor,
          weight: weight,
          opacity: 0.9,
          dashArray: dashArray,
        });
        glowLine.setStyle({
          color: baseColor,
          weight: weight + 3,
          opacity: 0.25,
        });
      } else if (isSegmentInDay) {
        // Highlight active day segment
        polyline.setStyle({
          color: "#F59E0B",
          weight: weight + 2.5,
          opacity: 1,
          dashArray: dashArray,
        });
        glowLine.setStyle({
          color: "#F59E0B",
          weight: weight + 6,
          opacity: 0.5,
        });
        polyline.bringToFront();
      } else {
        // Dim other segments
        polyline.setStyle({
          color: baseColor,
          weight: Math.max(2, weight - 1),
          opacity: 0.25,
          dashArray: dashArray,
        });
        glowLine.setStyle({
          opacity: 0.05,
        });
      }
    });

    // 2. Focus and zoom map to active day if specific day is selected
    if (currentDay !== null && leafletLibRef.current) {
      const L = leafletLibRef.current;
      const dayCoords: [number, number][] = [];

      routeData.locations
        .filter((loc) => loc.dayNumbers.includes(currentDay))
        .forEach((loc) => dayCoords.push(loc.coordinates));

      routeData.segments
        .filter((seg) => seg.dayNumbers.includes(currentDay))
        .forEach((seg) => seg.path.forEach((p) => dayCoords.push(p)));

      if (dayCoords.length > 0) {
        const bounds = L.latLngBounds(dayCoords);
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 13,
          animate: true,
        });
      }

      // Automatically set the best target location for the selected day
      const targetLocId = DAY_FOCUS_MAP[currentDay];
      const focusLoc =
        (targetLocId && routeData.locations.find((l) => l.id === targetLocId)) ||
        routeData.locations.find((l) => l.dayNumbers[0] === currentDay) ||
        routeData.locations.find((l) => l.dayNumbers.includes(currentDay));

      if (focusLoc) {
        setActiveLocation(focusLoc);
      }
    }
  }, [currentDay, isMapReady, routeData]);

  // Handle zoom in / out
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // ━━━ If No Route Data Exists or Route Map Disabled ━━━
  if (enableRouteMap === false && !findPackageRoute(packageSlug, packageTitle)) {
    return null;
  }

  if (isBuildingDynamic) {
    return (
      <section
        id="route-map"
        className="scroll-mt-20 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-md"
      >
        <div className="flex items-center justify-center flex-col gap-3 py-12">
          <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          <p className="text-xs font-bold text-gray-600 dark:text-gray-300 animate-pulse">
            Generating Dynamic GPS Itinerary Map for {packageTitle}...
          </p>
        </div>
      </section>
    );
  }

  if (!routeData) {
    if (enableRouteMap !== true) return null;

    return (
      <section
        id="route-map"
        className="scroll-mt-20 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-md"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <Navigation className="w-6 h-6 text-[var(--theme-primary)]" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Travel Route & Map
          </h2>
        </div>
        <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/60 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <p className="font-bold text-gray-900 dark:text-white text-base mb-1">
              Interactive Route Survey in Progress
            </p>
            <p className="leading-relaxed">
              Detailed GPS coordinates and interactive route terrain mapping for{" "}
              <strong>{packageTitle}</strong> are currently being finalized. Please consult the
              comprehensive day-by-day itinerary below for exact transit routes, flight
              connections, and halts.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Find relevant itinerary day info for active location or selected day
  const activeItineraryDay =
    currentDay !== null
      ? itinerary.find((i: any) => (i.dayNumber ?? i.day) === currentDay)
      : activeLocation && activeLocation.dayNumbers.length > 0
      ? itinerary.find((i: any) => (i.dayNumber ?? i.day) === activeLocation.dayNumbers[0])
      : null;

  return (
    <section
      id="route-map"
      className={`scroll-mt-20 bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-gray-800 shadow-md transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none p-4" : ""
      }`}
    >
      {/* ━━━ Header Bar ━━━ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Navigation className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Interactive Itinerary Route Map
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real geographic route with terrain waypoints, transport modes, and elevations.
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {routeData.totalDistance && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700">
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>{routeData.totalDistance}</span>
            </span>
          )}

          {routeData.maxAltitude && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              <Mountain className="w-3.5 h-3.5 text-amber-600" />
              <span>{routeData.maxAltitude}</span>
            </span>
          )}

          <button
            onClick={handleResetView}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="Reset to Full Route"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* ━━━ Day Filter Pills ━━━ */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            Filter Route by Itinerary Day:
          </span>
          {currentDay !== null && (
            <button
              onClick={() => handleDayChange(null)}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Show Complete Route ({routeData.locations.length} Stops)
            </button>
          )}
        </div>

        <div
          className="flex items-center gap-1.5 overflow-x-auto thin-scrollbar pb-2 pt-0.5 text-xs scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
          onWheel={(e) => {
            if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          <button
            onClick={() => handleDayChange(null)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentDay === null
                ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm"
                : "bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700"
            }`}
          >
            🌟 All Route
          </button>

          {Array.from(
            { length: Math.max(1, itinerary?.length || 0, ...routeData.locations.flatMap((l) => l.dayNumbers)) },
            (_, i) => i + 1
          ).map((dayNum) => {
            const hasSegments = routeData.segments.some((s) => s.dayNumbers.includes(dayNum));
            const hasLocations = routeData.locations.some((l) => l.dayNumbers.includes(dayNum));
            if (!hasSegments && !hasLocations) return null;

            const isSelected = currentDay === dayNum;
            return (
              <button
                key={dayNum}
                onClick={() => handleDayChange(dayNum)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-sm scale-105"
                    : "bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700"
                }`}
              >
                <span>Day {dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━━ Interactive Map Container (compact, balanced height) ━━━ */}
      <div
        className={`relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 dark:border-gray-800 shadow-inner bg-slate-100 dark:bg-slate-950 transition-all ${
          isFullscreen ? "h-[calc(100vh-140px)]" : "h-[300px] sm:h-[350px] lg:h-[390px]"
        }`}
      >
        {/* Leaflet DOM Anchor */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* ━━━ Floating Top Controls (Right) ━━━ */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-white border border-slate-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-white border border-slate-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMapTile}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-white border border-slate-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={`Switch to ${mapType === "topo" ? "OpenStreetMap" : "Topographic Terrain"}`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-white border border-slate-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          >
            {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* ━━━ Transport Modes Legend (Bottom-Left) ━━━ */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-lg text-[11px] max-w-[280px]">
          <p className="font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-[9px] mb-1.5">
            Transport Modes Legend
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-gray-800 dark:text-gray-200 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded bg-[#D97706] inline-block" />
              <span>🚗 Road Highway</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded border-b-2 border-dashed border-[#2563EB] inline-block" />
              <span>✈️ Domestic Flight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded border-b-2 border-dotted border-[#7C3AED] inline-block" />
              <span>🚁 Helicopter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded border-b-2 border-dashed border-[#059669] inline-block" />
              <span>🥾 Holy Trekking</span>
            </div>
          </div>
        </div>

        {/* ━━━ Hint Tooltip (Top-Left) ━━━ */}
        <div className="hidden sm:flex absolute top-3 left-3 z-20 items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20 shadow">
          <Info className="w-3 h-3 text-amber-400" />
          <span>Click any marker or line to view stop details & itinerary links</span>
        </div>
      </div>

      {/* ━━━ Interactive Location / Day Details Drawer ━━━ */}
      {(activeLocation || activeItineraryDay) && (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md flex-shrink-0 mt-0.5">
              {currentDay !== null ? `D${currentDay}` : activeLocation ? routeData.locations.findIndex((l) => l.id === activeLocation.id) + 1 : "★"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {currentDay !== null && activeItineraryDay
                    ? `Day ${currentDay}: ${activeItineraryDay.title}`
                    : activeLocation
                    ? `${activeLocation.name}${activeLocation.hindiName ? ` (${activeLocation.hindiName})` : ""}`
                    : "Route Information"}
                </h4>
                {currentDay !== null ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                    Day {currentDay} Sector
                  </span>
                ) : activeLocation?.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                    {activeLocation.badge}
                  </span>
                ) : null}
                {activeLocation?.altitude && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    🏔️ {activeLocation.altitude}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {activeLocation?.description || activeItineraryDay?.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {activeLocation && (
                  <>
                    <span>📍 Key Stop: {activeLocation.name} ({activeLocation.coordinates[0].toFixed(3)}° N, {activeLocation.coordinates[1].toFixed(3)}° E)</span>
                    <span>•</span>
                  </>
                )}
                <span>
                  {currentDay !== null
                    ? `Itinerary Day ${currentDay} of 11`
                    : `Active in Itinerary Day(s): ${activeLocation?.dayNumbers.join(", ")}`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick jump to Itinerary button */}
          {onScrollToDay && (
            <button
              onClick={() => onScrollToDay(currentDay || (activeLocation?.dayNumbers[0] ?? 1))}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:opacity-95 transition-all active:scale-95 cursor-pointer flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--theme-primary, #F59E0B), var(--theme-secondary, #D97706))" }}
            >
              <span>View Day {currentDay || (activeLocation?.dayNumbers[0] ?? 1)} Itinerary Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Custom Styles for Leaflet DivIcons & Tooltips */}
      <style>{`
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-leaflet-tooltip {
          background: rgba(15, 23, 42, 0.92) !important;
          color: white !important;
          border: 1px solid rgba(251, 191, 36, 0.4) !important;
          border-radius: 10px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4) !important;
          padding: 8px 12px !important;
        }
        .custom-leaflet-tooltip p {
          color: white !important;
        }
        .custom-leaflet-tooltip .text-gray-900 {
          color: #FBBF24 !important;
        }
        .custom-leaflet-tooltip .text-gray-600 {
          color: #E2E8F0 !important;
        }
        .custom-leaflet-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.92) !important;
        }
        .leaflet-container {
          font-family: inherit !important;
        }
      `}</style>
    </section>
  );
}
export default PackageRouteMap;
