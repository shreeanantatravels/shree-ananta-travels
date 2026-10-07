"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAgent, type AgentPackage } from "../context/AgentContext";
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

    // 2. Include destinations from siteConfig configured for this category
    if (siteConfig?.destinations && siteConfig.destinations.length > 0) {
      siteConfig.destinations.forEach((d) => {
        if (d.category !== category || d.active === false) return;
        const key = d.name.trim().toLowerCase();
        if (!destMap.has(key)) {
          destMap.set(key, {
            name: d.name.trim(),
            count: 0,
            image: d.image || getFallbackImage(d.name),
            minPrice: 0,
            category,
          });
        }
      });
    }

    return Array.from(destMap.values()).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name),
    );
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
            {filteredDestinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/packages?category=${category}&search=${encodeURIComponent(dest.name)}`}
                className={`group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col ${filteredDestinations.length === 1 ? 'w-full max-w-[340px] sm:max-w-md mx-auto' : ''}`}
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />

                  {/* Package Count Badge */}
                  <div className="absolute top-3.5 right-3.5 bg-slate-900/80 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {dest.count} {dest.count === 1 ? "Package" : "Packages"}
                    </span>
                  </div>

                  {/* Category Tag */}
                  <div className="absolute top-3.5 left-3.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                    {category}
                  </div>

                  {/* Title on Overlay */}
                  <div className="absolute bottom-3.5 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-0.5">
                      <MapPin className="w-3.5 h-3.5" /> Destination
                    </div>
                    <h3
                      className="text-2xl font-black text-white tracking-tight drop-shadow-md"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    {dest.minPrice > 0 ? (
                      <div>
                        <span className="text-[11px] text-gray-400 font-semibold block uppercase tracking-wider">
                          Starting From
                        </span>
                        <div
                          className="text-xl font-extrabold"
                          style={{ color: theme.primary }}
                        >
                          {formatPrice(dest.minPrice)}
                          <span className="text-xs text-gray-400 font-normal ml-1">
                            / person
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 font-medium italic">
                        {dest.count > 0
                          ? "Custom Pricing Available"
                          : "Featured Destination"}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>View Packages</span>
                    <div
                      className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110 text-white"
                      style={{ background: theme.primary }}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
