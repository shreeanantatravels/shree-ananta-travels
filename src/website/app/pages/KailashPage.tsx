"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  MessageCircle,
  Phone,
  ArrowRight,
  User,
  ChevronDown,
  Mountain,
  HeartPulse,
  Utensils,
  Globe,
  ExternalLink,
  Users,
} from "lucide-react";
import { useAgent, type AgentPackage } from "../context/AgentContext";
import { Topbar } from "../components/Topbar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface KailashPackageItem {
  _id: string;
  title: string;
  location?: string | null;
  duration?: string | null;
  discountedPrice?: number | null;
  originalPrice?: number | null;
  imageUrl1?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  tag?: string | null;
}

const DEFAULT_ROUTES_FALLBACK: KailashPackageItem[] = [
  {
    _id: "helicopter-lucknow",
    title: "Kailash Mansarovar Yatra by Helicopter via Lucknow",
    location: "Lucknow - Nepalgunj - Simikot - Hilsa - Mansarovar",
    duration: "10 Days / 9 Nights",
    discountedPrice: 225000,
    originalPrice: 245000,
    imageUrl1: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Helicopter Route",
  },
  {
    _id: "overland-kyirong",
    title: "Overland Kailash Mansarovar Yatra via Kyirong",
    location: "Kathmandu - Syabrubesi - Kyirong - Saga - Mansarovar",
    duration: "14 Days / 13 Nights",
    discountedPrice: 185000,
    originalPrice: 205000,
    imageUrl1: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Overland Route",
  },
  {
    _id: "lhasa-air-route",
    title: "Kailash Mansarovar Yatra Via Lhasa – Air Route",
    location: "Kathmandu - Lhasa - Shigatse - Saga - Mansarovar",
    duration: "15 Days / 14 Nights",
    discountedPrice: 310000,
    originalPrice: 340000,
    imageUrl1: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Air & Cultural Route",
  },
  {
    _id: "aerial-darshan",
    title: "Kailash Mansarovar Aerial Mountain Flight Darshan",
    location: "Nepalgunj - Mountain Flight - Lake Mansarovar View",
    duration: "1 Day Scenic Darshan",
    discountedPrice: 48000,
    originalPrice: 55000,
    imageUrl1: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "No Trekking | No China Visa",
  },
];


export default function KailashPage() {
  const { agent, siteConfig, packages: agentPackages } = useAgent();

  // Dynamically load Kailash packages from database
  const kailashPackages = useMemo(() => {
    const list = (agentPackages || []).filter((p: AgentPackage) => {
      const cat = (p.category || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      const loc = (p.location || "").toLowerCase();
      return (
        cat === "kailash" ||
        cat === "spiritual" ||
        title.includes("kailash") ||
        title.includes("mansarovar") ||
        loc.includes("kailash") ||
        loc.includes("mansarovar")
      );
    });
    return (list.length > 0 ? list : DEFAULT_ROUTES_FALLBACK) as KailashPackageItem[];
  }, [agentPackages]);

  // WhatsApp Helper
  const buildWhatsAppUrl = (message: string) => {
    const rawNumber = agent?.whatsapp || siteConfig?.contactPhone || "7289037447";
    const digits = rawNumber.replace(/\D/g, "");
    const cleanNumber = digits.startsWith("91") ? digits : digits.length === 10 ? `91${digits}` : "917289037447";
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppClick = (eventName: string, message: string) => {
    if (typeof window !== "undefined") {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      if (w.dataLayer) {
        w.dataLayer.push({ event: eventName });
      }
    }
    window.open(buildWhatsAppUrl(message), "_blank");
  };

  // Quick Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    route: "Helicopter via Lucknow",
    month: "Flexible Dates (2026)",
    yatris: "2 Yatris",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      if (w.dataLayer) {
        w.dataLayer.push({ event: "kailash_quick_quote" });
      }
    }
    const msg = `ॐ नमः शिवाय!
Hello Shree Ananta Travels, I want to inquire for Kailash Mansarovar Yatra:

• Name: ${formData.name}
• Phone: ${formData.phone}
• Preferred Route: ${formData.route}
• Target Month: ${formData.month}
• Group Size: ${formData.yatris}

Please share package itinerary and customized pricing details.`;
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  const contactPhone = siteConfig?.contactPhone || agent?.whatsapp || "+91 7289037447";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <Topbar />
      <Navbar />

      <main className="flex-1">
        {/* ── 1. CLEAN HIGH-CONVERTING HERO SECTION ── */}
        <section className="relative min-h-[80vh] lg:min-h-[85vh] flex items-center bg-slate-950 overflow-hidden py-12 lg:py-20">
          {/* Background image & gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2500&auto=format&fit=crop"
              alt="Mount Kailash and Lake Mansarovar"
              className="w-full h-full object-cover object-center filter brightness-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Direct Spiritual Appeal */}
              <div className="lg:col-span-7 text-left space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider backdrop-blur-md">
                  <Mountain className="w-4 h-4 text-amber-400" />
                  <span>ॐ नमः शिवाय | Authorized Pilgrimage Partner</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Kailash Mansarovar <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-300">
                    Yatra 2026 - 2027
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-gray-200 max-w-xl leading-relaxed">
                  Undertake the sacred Parikrama of Mount Kailash and the holy bath at Lake Mansarovar with Shree Ananta Travels. 
                  End-to-end Tibet permits, certified Sherpas, pure vegetarian meals, and high-altitude medical safety.
                </p>

                {/* 4 Clean Trust Pills */}
                <div className="grid grid-cols-2 gap-2.5 max-w-lg pt-1">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Tibet Permits Handled</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white text-xs font-semibold">
                    <HeartPulse className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Oxygen & Medical Support</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white text-xs font-semibold">
                    <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pure Vegetarian Food</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white text-xs font-semibold">
                    <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>NRI Yatra Assistance</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#packages"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>View Packages</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleWhatsAppClick("kailash_hero_chat", "ॐ नमः शिवाय! I want details for Kailash Mansarovar Yatra 2026-2027.")}
                    className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Clean Compact 1-Click Inquiry Form */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-400/30 p-6 sm:p-7 rounded-3xl shadow-2xl relative">
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 inline-block mb-1">
                      Quick Inquiry
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Get Itinerary & Pricing
                    </h2>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Share your details to get day-wise plan & price quote on WhatsApp.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">Your Name</label>
                      <div className="flex items-center bg-black/40 border border-white/15 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-all">
                        <User className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Full Name"
                          className="bg-transparent w-full text-white placeholder-gray-400 text-xs outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">WhatsApp Number</label>
                      <div className="flex items-center bg-black/40 border border-white/15 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-all">
                        <Phone className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                        <span className="text-gray-400 text-xs font-bold mr-1">+91</span>
                        <input
                          required
                          type="tel"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10 Digit Number"
                          className="bg-transparent w-full text-white placeholder-gray-400 text-xs outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">Route</label>
                        <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-2.5 py-2">
                          <select
                            value={formData.route}
                            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                            className="bg-transparent w-full text-white text-xs outline-none appearance-none cursor-pointer font-medium [&>option]:text-gray-900"
                          >
                            <option value="Helicopter via Lucknow">Helicopter Route</option>
                            <option value="Overland via Kyirong">Overland Route</option>
                            <option value="Lhasa Air Route">Lhasa Air Route</option>
                            <option value="Aerial Darshan Flight">Aerial Darshan</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">Month</label>
                        <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-2.5 py-2">
                          <select
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            className="bg-transparent w-full text-white text-xs outline-none appearance-none cursor-pointer font-medium [&>option]:text-gray-900"
                          >
                            <option value="Flexible Dates (2026)">Flexible Dates (2026)</option>
                            <option value="May 2026">May 2026</option>
                            <option value="June 2026">June 2026</option>
                            <option value="July 2026">July 2026</option>
                            <option value="August 2026">August 2026</option>
                            <option value="September 2026">September 2026</option>
                            <option value="2027 Season">2027 Season</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">Group Size</label>
                      <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-2.5 py-2">
                        <Users className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                        <select
                          value={formData.yatris}
                          onChange={(e) => setFormData({ ...formData, yatris: e.target.value })}
                          className="bg-transparent w-full text-white text-xs outline-none appearance-none cursor-pointer font-medium [&>option]:text-gray-900"
                        >
                          <option value="1 Yatri (Solo)">1 Yatri (Solo)</option>
                          <option value="2 Yatris">2 Yatris</option>
                          <option value="3-4 Yatris">3 - 4 Yatris (Family)</option>
                          <option value="5+ Yatris">5+ Yatris (Group)</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 mt-1 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Get Details on WhatsApp</span>
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. TRUST HIGHLIGHT STRIP (Authentic Operational Authority - No Fake Stats) ── */}
        <section className="bg-amber-500 text-slate-950 py-4.5 sm:py-5 border-y border-amber-600/20 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950/10 border border-slate-950/15 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-950">Official Permits</p>
                  <p className="text-[11px] sm:text-xs text-slate-900 font-medium">China Visa & Tibet Liaison</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950/10 border border-slate-950/15 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-950">Certified Sherpas</p>
                  <p className="text-[11px] sm:text-xs text-slate-900 font-medium">Trained High-Altitude Support</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950/10 border border-slate-950/15 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-950">Indian Kitchen</p>
                  <p className="text-[11px] sm:text-xs text-slate-900 font-medium">Fresh Pure Veg & Jain Meals</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950/10 border border-slate-950/15 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-950">Medical Safety</p>
                  <p className="text-[11px] sm:text-xs text-slate-900 font-medium">Oxygen & Oximeter Ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. CLEAN DYNAMIC PACKAGES SECTION (No Cluttered Hardcoded Bullets) ── */}
        <section id="packages" className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-2">
                Available Packages
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Kailash Mansarovar Tour Packages
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium">
                Tap on any package to view the full itinerary or enquire directly on WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kailashPackages.map((pkg: KailashPackageItem) => {
                const pkgTitle = pkg.title || "Kailash Mansarovar Tour Package";
                const pkgDuration = pkg.duration || "12 Days";
                const pkgLocation = pkg.location || "Tibet, Mount Kailash";
                const pkgImg = pkg.imageUrl1 || pkg.imageUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop";
                const pkgPrice = pkg.discountedPrice || pkg.originalPrice;

                return (
                  <div
                    key={pkg._id}
                    className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={pkgImg}
                        alt={pkgTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Duration Badge */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-full border border-white/20">
                        {pkgDuration}
                      </div>

                      {/* Tag if any */}
                      {pkg.tag && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          {pkg.tag}
                        </div>
                      )}

                      {/* Title & Location on Image */}
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <h3 className="text-base font-black text-white leading-tight line-clamp-2">
                          {pkgTitle}
                        </h3>
                        <p className="text-[11px] text-gray-300 flex items-center gap-1 mt-0.5 font-medium truncate">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{pkgLocation}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Clean Price + Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block">Starting From</span>
                          <div className="flex items-baseline gap-1.5">
                            {pkgPrice && pkgPrice > 0 ? (
                              <span className="text-xl font-black text-gray-900 dark:text-white">
                                ₹{pkgPrice.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                Price on Request
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          <span>Permit Liaison</span>
                        </div>
                      </div>

                      {/* Action Buttons: 2 Clean Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/package/${pkg._id}`}
                          className="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleWhatsAppClick("kailash_pkg_inquire", `ॐ नमः शिवाय! I want details for "${pkgTitle}". Please share itinerary and price quote.`)}
                          className="py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Inquire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. KEY ROUTES AT A GLANCE (Compact Visual Cards) ── */}
        <section className="py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-2">
                Route Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Choose the Right Route for Your Travel Style
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Fast & Popular</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Helicopter Route</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    Lucknow to Nepalgunj, Simikot, and Hilsa. 10 Days total. Lowest road journey, ideal for senior citizens.
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsAppClick("kailash_route_heli", "Hello, I want details for Kailash Yatra by Helicopter via Lucknow.")}
                  className="mt-4 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline text-left"
                >
                  <span>Inquire Helicopter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Scenic Drive</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Overland via Kyirong</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    Kathmandu to Kyirong border by coach. 14 Days total. Best natural step-by-step altitude adjustment.
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsAppClick("kailash_route_overland", "Hello, I want details for Overland Kailash Yatra via Kyirong.")}
                  className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline text-left"
                >
                  <span>Inquire Overland</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Comfort & Culture</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Lhasa Air Route</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    Flight to Lhasa with visits to Potala Palace. 15 Days total. Deluxe accommodation and scenic plateau transit.
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsAppClick("kailash_route_lhasa", "Hello, I want details for Kailash Mansarovar via Lhasa Air Route.")}
                  className="mt-4 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline text-left"
                >
                  <span>Inquire Lhasa Route</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">Zero Trekking</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Aerial Darshan Flight</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    Mountain flight close to Mount Kailash. 1 Day return. No trekking and no China visa required.
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsAppClick("kailash_route_aerial", "Hello, I want details for Kailash Aerial Mountain Flight Darshan.")}
                  className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline text-left"
                >
                  <span>Inquire Aerial Flight</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* ── 5. SPECIAL DESK FOR NRIs & INTERNATIONAL YATRIS ── */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase">
                  <Globe className="w-4 h-4" />
                  <span>NRI & Foreign Passport Support</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Traveling from USA, UK, Canada, Australia or Singapore?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                  Shree Ananta Travels provides complete liaison for China Group Visa and Tibet Travel Permits for foreign passport holders.
                </p>
              </div>

              <button
                onClick={() => handleWhatsAppClick("kailash_nri_desk", "Namaste! I am an NRI / Foreign Passport holder. Please share guidelines for Kailash Mansarovar Yatra.")}
                className="py-3 px-6 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact NRI Desk</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── 6. CLEAN CONCISE FAQS ── */}
        <section className="py-14 bg-white dark:bg-gray-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-1">
                Common Questions
              </span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Kailash Mansarovar FAQs
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "What is the best route for senior citizens or parents?",
                  a: "The Helicopter Route via Lucknow / Nepalgunj minimizes road transit and is best for seniors. For seniors who cannot trek at all, the 1-Day Aerial Darshan flight offers mountain darshan without entering Tibet.",
                },
                {
                  q: "How are Tibet Travel Permits and China Visas handled?",
                  a: "You only provide your passport copy. Shree Ananta Travels manages the complete group documentation with the Tibet Tourism Bureau and Embassy.",
                },
                {
                  q: "Can I rent a pony / horse for the 3-day Parikrama?",
                  a: "Yes, local Tibetan ponies and porters are arranged at Yam Dwar on a direct rental basis to comfortably assist yatris who cannot trek the full distance on foot.",
                },
                {
                  q: "What kind of food is provided during the yatra?",
                  a: "Fresh, hot pure vegetarian and Jain meals (dal, rice, roti, sabzi, khichdi, porridge, soups, and warm water) are prepared daily by our dedicated Indian cooks.",
                },
                {
                  q: "How many months in advance should I register?",
                  a: "We recommend planning 3 to 6 months in advance so Tibet travel permits and group visa formalities can be processed comfortably before the season begins.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 [&_summary::-webkit-details-marker]:hidden overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-gray-900 dark:text-white font-bold text-sm outline-none select-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 transition duration-300 group-open:-rotate-180 text-gray-500 group-open:text-amber-600 shrink-0" />
                  </summary>
                  <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. FINAL FAST ENQUIRY CTA ── */}
        <section className="py-14 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white text-center px-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Plan Your Sacred Yatra?
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-md mx-auto">
              Speak directly with our pilgrimage specialists for personalized dates, group discounts, and route selection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleWhatsAppClick("kailash_footer_chat", "ॐ नमः शिवाय! I am ready to plan my Kailash Mansarovar Yatra. Please assist me with packages.")}
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
              <a
                href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-100 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Specialist: {contactPhone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── 8. STICKY MOBILE CTA BAR ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-2.5 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-50 flex gap-2.5 shadow-2xl">
        <button
          onClick={() => handleWhatsAppClick("kailash_mobile_quote", "ॐ नमः शिवाय! I need details and pricing for Kailash Mansarovar Yatra.")}
          className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Quote</span>
        </button>
        <a
          href={`tel:${contactPhone.replace(/\s+/g, "")}`}
          className="flex-1 bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span>Call Specialist</span>
        </a>
      </div>
    </div>
  );
}
