"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAgent, type AgentPackage } from "../context/AgentContext";
import { toDestinationSlug } from "@/lib/utils/slugify";
import { Topbar } from "../components/Topbar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatbotButton } from "../components/ChatbotButton";
import {
  MapPin,
  Search,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  Compass,
} from "lucide-react";

/* ── Theme map ─────────────────────────────────────────────────── */
const THEMES: Record<
  string,
  { primary: string; gradient: string; accent: string }
> = {
  gold: {
    primary: "#0f2b5c",
    gradient: "linear-gradient(135deg,#0f2b5c 0%,#d4af37 100%)",
    accent: "#d4af37",
  },
  navy: {
    primary: "#1e3a8a",
    gradient: "linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%)",
    accent: "#3b82f6",
  },
  red: {
    primary: "#be123c",
    gradient: "linear-gradient(135deg,#9f1239 0%,#e11d48 100%)",
    accent: "#f43f5e",
  },
  cyan: {
    primary: "#0e7490",
    gradient: "linear-gradient(135deg,#0e7490 0%,#06b6d4 100%)",
    accent: "#22d3ee",
  },
  default: {
    primary: "#0f2b5c",
    gradient: "linear-gradient(135deg,#0f2b5c 0%,#d4af37 100%)",
    accent: "#d4af37",
  },
};

/* ── Fallback Images ─────────────────────────────────────────────── */
const getFallbackImage = (_name: string): string => "";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export interface UniqueDestinationItem {
  name: string;
  count: number;
  image: string;
  minPrice: number;
  category: "domestic" | "international";
}

interface Props {
  category: "domestic" | "international";
}

export default function DestinationsCategoryPage({ category }: Props) {
  const { agent, packages, siteConfig } = useAgent();
  const [search, setSearch] = useState("");

  const theme = THEMES[agent?.theme || "default"] || THEMES.default;
  const isDomestic = category === "domestic";
  const pageTitle = isDomestic
    ? "Domestic Destinations"
    : "International Destinations";
  const pageSubtitle = isDomestic
    ? "Discover Incredible India — Handcrafted holiday packages for India's most stunning getaways."
    : "Explore The World — Premier international destinations & luxury holiday packages.";

  /* ── Group packages & siteConfig destinations dynamically for this category ── */
  const categoryDestinations = useMemo(() => {
    const destMap = new Map<string, UniqueDestinationItem>();

    // 1. Process packages belonging to this category
    (packages || []).forEach((pkg: AgentPackage) => {
      if (!pkg.location) return;
      const pkgCat =
        pkg.category === "international" ? "international" : "domestic";
      if (pkgCat !== category) return;

      const rawLoc = pkg.location.trim();
      if (!rawLoc) return;
      const key = rawLoc.toLowerCase();
      const price =
        pkg.discountedPrice && pkg.discountedPrice > 0
          ? pkg.discountedPrice
          : pkg.originalPrice;

      if (destMap.has(key)) {
        const item = destMap.get(key)!;
        item.count += 1;
        if (price > 0 && (item.minPrice === 0 || price < item.minPrice)) {
          item.minPrice = price;
        }
        if (
          pkg.imageUrl1 &&
          (!item.image ||
            item.image.includes("unsplash.com/photo-1488646953014"))
        ) {
          item.image = pkg.imageUrl1;
        }
      } else {
        destMap.set(key, {
          name: rawLoc,
          count: 1,
          image: pkg.imageUrl1 || pkg.imageUrl2 || getFallbackImage(rawLoc),
          minPrice: price || 0,
          category,
        });
      }
    });

    // 2. Enhance destination images from siteConfig if available
    if (siteConfig?.destinations && siteConfig.destinations.length > 0) {
      siteConfig.destinations.forEach((d) => {
        if (d.category !== category || d.active === false) return;
        const key = d.name.trim().toLowerCase();
        if (destMap.has(key)) {
          const item = destMap.get(key)!;
          if ((!item.image || item.image.includes("unsplash.com")) && d.image) {
            item.image = d.image;
          }
        }
      });
    }

    // Only show destinations that have actual packages! (Eliminates empty 0-package placeholders)
    return Array.from(destMap.values())
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [packages, siteConfig, category]);

  /* ── Filter destinations based on search input ── */
  const filteredDestinations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categoryDestinations;
    return categoryDestinations.filter((d) => d.name.toLowerCase().includes(q));
  }, [categoryDestinations, search]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-[var(--theme-primary)]/30">
      <Topbar />
      <Navbar />

      <style>{`
        @keyframes text-reveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee-up {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative w-full min-h-[320px] md:min-h-[400px] bg-gray-900 overflow-hidden flex items-center justify-center">
        {/* Animated marquee background grid */}
        <div
          className="absolute inset-0 z-0 flex gap-4 p-4 transform scale-[1.05] opacity-70"
          style={{ transformOrigin: "center" }}
        >
          <div
            className="flex-1 flex flex-col gap-4"
            style={{ animation: "marquee-up 45s linear infinite" }}
          >
            {[
              ...filteredDestinations,
              ...filteredDestinations,
              ...filteredDestinations,
            ].map((dest, i) => (
              <div
                key={`col1-${i}`}
                className="w-full rounded-2xl shadow-sm overflow-hidden shrink-0"
              >
                <img
                  src={dest.image}
                  className="w-full h-44 object-cover"
                  alt=""
                />
              </div>
            ))}
          </div>
          <div
            className="flex-1 flex flex-col gap-4"
            style={{ animation: "marquee-down 55s linear infinite" }}
          >
            {[
              ...filteredDestinations,
              ...filteredDestinations,
              ...filteredDestinations,
            ]
              .reverse()
              .map((dest, i) => (
                <div
                  key={`col2-${i}`}
                  className="w-full rounded-2xl shadow-sm overflow-hidden shrink-0"
                >
                  <img
                    src={dest.image}
                    className="w-full h-56 object-cover"
                    alt=""
                  />
                </div>
              ))}
          </div>
          <div
            className="hidden md:flex flex-1 flex-col gap-4"
            style={{ animation: "marquee-up 50s linear infinite" }}
          >
            {[
              ...filteredDestinations,
              ...filteredDestinations,
              ...filteredDestinations,
            ].map((dest, i) => (
              <div
                key={`col3-${i}`}
                className="w-full rounded-2xl shadow-sm overflow-hidden shrink-0"
              >
                <img
                  src={dest.image}
                  className="w-full h-48 object-cover"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-950 via-gray-900/60 to-gray-950/40"></div>

        {/* Foreground Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center flex flex-col items-center py-12">
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-white/80 mb-5 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full border border-white/20 shadow-sm backdrop-blur-md"
            style={{ animation: "text-reveal 0.6s ease-out forwards" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Destinations
          </Link>

          <div
            className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-white text-xs font-bold uppercase tracking-widest mb-4 border border-white/20 shadow-sm"
            style={{
              opacity: 0,
              animation: "text-reveal 0.8s ease-out forwards 0.2s",
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {filteredDestinations.length}{" "}
              {filteredDestinations.length === 1
                ? "Destination"
                : "Destinations"}{" "}
              Available
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              opacity: 0,
              animation: "text-reveal 1s ease-out forwards 0.4s",
            }}
          >
            {pageTitle}
          </h1>

          <p
            className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md"
            style={{
              opacity: 0,
              animation: "text-reveal 1.2s ease-out forwards 0.6s",
            }}
          >
            {pageSubtitle}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Popular {isDomestic ? "Domestic" : "International"} Locations
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select a destination to browse exclusive packages
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${isDomestic ? "domestic" : "international"} location...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none shadow-sm"
              style={{ borderColor: search ? theme.primary : undefined }}
            />
          </div>
        </div>

        {/* Destination Cards Grid */}
        {filteredDestinations.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${filteredDestinations.length === 1 ? 'justify-items-center' : ''}`}>
            {filteredDestinations.map((dest) => {
              const isKailash = (dest.name || '').toLowerCase().includes('kailash');
              const destSlug = (dest as any).slug || toDestinationSlug(dest.name);
              const cardHref = isKailash ? '/kailash-mansarovar' : `/${category}/${destSlug}`;
              return (
              <Link
                key={dest.name}
                href={cardHref}
                className={`group relative bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full ${filteredDestinations.length === 1 ? 'w-full max-w-[340px] sm:max-w-md mx-auto' : ''}`}
              >
                {/* Image Container (Clean, Unobstructed Photo) */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 shrink-0">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={250}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Category Tag (Top-Left) */}
                  <div
                    className="absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10 pointer-events-none"
                    style={{ background: 'var(--theme-gradient)' }}
                  >
                    {category}
                  </div>

                  {/* Package Count Badge (Top-Right) */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm pointer-events-none border border-white/10">
                    <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {dest.count} {dest.count === 1 ? "Tour" : "Tours"}
                    </span>
                  </div>
                </div>

                {/* Body (Cleanly Below Photo) */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Destination Label */}
                    <div
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: 'var(--theme-primary)' }}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>Destination</span>
                    </div>

                    {/* Destination Name / Title */}
                    <h3
                      className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug line-clamp-1 group-hover:text-[var(--theme-primary)] transition-colors mb-1.5"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {dest.name}
                    </h3>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                      Handcrafted packages &amp; sightseeing
                    </p>
                  </div>

                  {/* Footer: Price & CTA */}
                  <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
                    <div>
                      {dest.minPrice > 0 ? (
                        <div>
                          <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium block">
                            Starting from
                          </span>
                          <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                            {formatPrice(dest.minPrice)}
                            <span className="text-[11px] text-gray-400 font-normal ml-1">
                              /person
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium block">
                            Starting from
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
                            Price on Request
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className="inline-flex items-center gap-1 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm group-hover:shadow group-hover:scale-105 active:scale-95 shrink-0"
                      style={{ background: 'var(--theme-gradient)' }}
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📍</div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
              No destinations found
            </h3>
            <p className="text-xs text-gray-500">
              Try adjusting your search query.
            </p>
          </div>
        )}
      </div>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
