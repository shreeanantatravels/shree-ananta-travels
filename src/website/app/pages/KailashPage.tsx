"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Star,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Phone,
  ArrowRight,
  User,
  Calendar,
  Compass,
  ChevronDown,
  Mountain,
  HeartPulse,
  Utensils,
  Globe,
  Clock,
  Sparkles,
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
  highlights?: string[];
}

const DEFAULT_ROUTES_FALLBACK = [
  {
    _id: "helicopter-lucknow",
    title: "Kailash Mansarovar Yatra by Helicopter via Lucknow",
    location: "Lucknow - Nepalgunj - Simikot - Hilsa - Mansarovar",
    duration: "10 Days / 9 Nights",
    discountedPrice: 225000,
    originalPrice: 245000,
    imageUrl1: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Most Popular for Seniors",
    highlights: [
      "Fastest route with minimum road travel",
      "Scenic helicopter flight over Himalayan ranges",
      "Stay in Nepalgunj, Simikot, Purang & Mansarovar",
      "Doctor guidance & oxygen support included",
    ],
  },
  {
    _id: "overland-kyirong",
    title: "Overland Kailash Mansarovar Yatra via Kyirong (Kathmandu)",
    location: "Kathmandu - Syabrubesi - Kyirong - Saga - Mansarovar",
    duration: "14 Days / 13 Nights",
    discountedPrice: 185000,
    originalPrice: 205000,
    imageUrl1: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Best for Acclimatization",
    highlights: [
      "Natural step-by-step altitude adjustment",
      "Drive through scenic Tibetan plateau & Brahmaputra river",
      "Full day Holy Mansarovar Snan & Hawan puja",
      "Complete 3-Day Mount Kailash Parikrama (Kora)",
    ],
  },
  {
    _id: "lhasa-air-route",
    title: "Kailash Mansarovar Yatra Via Lhasa – Air & Cultural Route",
    location: "Kathmandu - Lhasa - Shigatse - Saga - Mansarovar",
    duration: "15 Days / 14 Nights",
    discountedPrice: 310000,
    originalPrice: 340000,
    imageUrl1: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Luxury & Cultural Sightseeing",
    highlights: [
      "Flight into Lhasa with Potala Palace & Jokhang Temple tour",
      "Luxury 4-star hotels during Tibet transit",
      "Scenic drive via Yamdrok Lake & Gyantse fortress",
      "VIP medical team & English/Hindi speaking Tibetan guide",
    ],
  },
  {
    _id: "aerial-darshan",
    title: "Kailash Mansarovar Aerial Mountain Flight Darshan",
    location: "Nepalgunj - Pithoragarh - Kailash Aerial View - Return",
    duration: "1 Day Scenic Darshan",
    discountedPrice: 48000,
    originalPrice: 55000,
    imageUrl1: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Zero Trekking | No China Visa Needed",
    highlights: [
      "Chartered mountain flight close to Holy Mount Kailash",
      "Darshan of Om Parvat & Lake Mansarovar from sky",
      "Ideal for yatris who cannot trek or travel to Tibet",
      "Complete darshan in single day from India/Nepal border",
    ],
  },
];

const DEPARTURE_BATCHES_2026 = [
  { month: "May 2026", dates: "11 May, 22 May", purnima: "29 May (Buddha Purnima)", status: "Filling Fast" },
  { month: "June 2026", dates: "08 Jun, 19 Jun", purnima: "27 Jun (Jyeshtha Purnima)", status: "Popular" },
  { month: "July 2026", dates: "06 Jul, 18 Jul", purnima: "27 Jul (Guru Purnima Special)", status: "Filling Fast" },
  { month: "August 2026", dates: "05 Aug, 16 Aug", purnima: "25 Aug (Shravan / Raksha Bandhan)", status: "High Demand" },
  { month: "September 2026", dates: "02 Sep, 14 Sep", purnima: "24 Sep (Bhadrapada Purnima)", status: "Open" },
];

export default function KailashPage() {
  const { agent, siteConfig, packages: agentPackages } = useAgent();

  // Filter packages specifically for Kailash Mansarovar from DB
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

  // WhatsApp helper
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

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    route: "Kailash Yatra by Helicopter via Lucknow",
    month: "July 2026 (Guru Purnima Special)",
    yatris: "2 Yatris",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      if (w.dataLayer) {
        w.dataLayer.push({ event: "mansarovar_quote_submit" });
      }
    }
    const msg = `ॐ नमः शिवाय!
Hello Shree Ananta Travels, I want to book/inquire for Kailash Mansarovar Yatra 2026-2027:

• Name: ${formData.name}
• Phone: ${formData.phone}
• Preferred Route: ${formData.route}
• Target Month: ${formData.month}
• Group Size: ${formData.yatris}

Please share available batch dates, detailed day-wise itinerary, and exact pricing.`;
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  const contactPhone = siteConfig?.contactPhone || agent?.whatsapp || "+91 7289037447";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <Topbar />
      <Navbar />

      {/* ── TOP NOTIFICATION TICKER (Competitor Benchmark) ── */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 font-bold">
            <span className="bg-red-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full animate-pulse">
              Open Now
            </span>
            <span>Kailash Mansarovar Yatra 2026 - 2027 Registrations Open | Full Moon (Purnima) Batches Filling Fast</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Call Specialist: {contactPhone}
            </a>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* ── 1. HERO SECTION WITH EMBEDDED QUICK QUOTE FORM ── */}
        <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-slate-950 overflow-hidden py-16 lg:py-24">
          {/* Background image & atmospheric overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2500&auto=format&fit=crop"
              alt="Holy Mount Kailash and Sacred Lake Mansarovar"
              className="w-full h-full object-cover object-center scale-105 filter brightness-70 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Value Proposition */}
              <div className="lg:col-span-7 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider backdrop-blur-md">
                  <Mountain className="w-4 h-4 text-amber-400" />
                  <span>ॐ नमः शिवाय | Authorized Pilgrimage Partner</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Kailash Mansarovar <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-300">
                    Yatra 2026 - 2027
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed font-normal">
                  Experience the ultimate sacred Parikrama of Mount Kailash (Gang Rinpoche) and the holy dip in Lake Mansarovar. 
                  Comprehensive China/Tibet permits, certified high-altitude Sherpas, daily sattvic Indian meals, and 24/7 medical oxygen care.
                </p>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-white text-xs sm:text-sm font-bold">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>100% Tibet Travel Permit Assistance</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-white text-xs sm:text-sm font-bold">
                    <HeartPulse className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Oxygen Kit & Doctor Support</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-white text-xs sm:text-sm font-bold">
                    <Utensils className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Pure Veg & Jain Sattvic Food</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-white text-xs sm:text-sm font-bold">
                    <Globe className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>NRI & Foreign Passport Support</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href="#routes"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl hover:scale-102 flex items-center gap-2"
                  >
                    <span>View All Packages</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleWhatsAppClick("mansarovar_hero_whatsapp", "ॐ नमः शिवाय! I want full details and batch dates for Kailash Mansarovar Yatra 2026-2027.")}
                    className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-102 flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Instant WhatsApp Inquiry</span>
                  </button>
                </div>
              </div>

              {/* Right Column: High-Converting Embedded Form */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900/90 backdrop-blur-2xl border-2 border-amber-400/40 p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />
                  
                  <div className="mb-5 relative z-10">
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block mb-2">
                      Priority Booking 2026-2027
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Get Yatra Itinerary & Quote
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1">
                      Fill the form to receive day-wise itinerary, dates, and prices on WhatsApp within 10 minutes.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-3.5 relative z-10">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Full Name</label>
                      <div className="relative flex items-center bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:border-amber-400 transition-all">
                        <User className="w-4 h-4 text-amber-400 mr-2.5 shrink-0" />
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Full Name"
                          className="bg-transparent w-full text-white placeholder-gray-400 text-xs sm:text-sm outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">WhatsApp Mobile Number</label>
                      <div className="relative flex items-center bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:border-amber-400 transition-all">
                        <Phone className="w-4 h-4 text-amber-400 mr-2.5 shrink-0" />
                        <span className="text-gray-400 text-xs sm:text-sm font-bold mr-1.5">+91</span>
                        <input
                          required
                          type="tel"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10 Digit Number"
                          className="bg-transparent w-full text-white placeholder-gray-400 text-xs sm:text-sm outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">Preferred Route</label>
                        <div className="relative flex items-center bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 focus-within:border-amber-400 transition-all">
                          <select
                            value={formData.route}
                            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                            className="bg-transparent w-full text-white text-xs outline-none appearance-none cursor-pointer font-medium [&>option]:text-gray-900 [&>option]:bg-white"
                          >
                            <option value="Kailash Yatra by Helicopter via Lucknow">Helicopter (via Lucknow)</option>
                            <option value="Overland Kailash Yatra via Kyirong">Overland (via Kyirong)</option>
                            <option value="Kailash Yatra via Lhasa (Air Route)">Lhasa Air Route</option>
                            <option value="Kailash Aerial Darshan (Flight)">Aerial Darshan Flight</option>
                            <option value="Need Specialist Guidance">Not Sure - Guide Me</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">Target Month / Batch</label>
                        <div className="relative flex items-center bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 focus-within:border-amber-400 transition-all">
                          <select
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            className="bg-transparent w-full text-white text-xs outline-none appearance-none cursor-pointer font-medium [&>option]:text-gray-900 [&>option]:bg-white"
                          >
                            <option value="May 2026 (Buddha Purnima)">May 2026 (Buddha Purnima)</option>
                            <option value="June 2026 (Jyeshtha Purnima)">June 2026</option>
                            <option value="July 2026 (Guru Purnima Special)">July 2026 (Guru Purnima)</option>
                            <option value="August 2026 (Shravan / Raksha Bandhan)">August 2026 (Shravan)</option>
                            <option value="September 2026 (Bhadrapada Purnima)">September 2026</option>
                            <option value="Advance 2027 Booking">2027 Advance Booking</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Number of Yatris</label>
                      <div className="relative flex items-center bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 focus-within:border-amber-400 transition-all">
                        <Users className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                        <select
                          value={formData.yatris}
                          onChange={(e) => setFormData({ ...formData, yatris: e.target.value })}
                          className="bg-transparent w-full text-white text-xs outline-none appearance-none cursor-pointer font-medium [&>option]:text-gray-900 [&>option]:bg-white"
                        >
                          <option value="1 Yatri (Solo)">1 Yatri (Solo)</option>
                          <option value="2 Yatris (Couple / Friends)">2 Yatris</option>
                          <option value="3-4 Yatris (Family)">3 - 4 Yatris</option>
                          <option value="5-8 Yatris (Group)">5 - 8 Yatris</option>
                          <option value="9+ Yatris (Large Group)">9+ Yatris (Corporate / Sangh)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 mt-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Get Itinerary & Pricing on WhatsApp</span>
                    </button>
                  </form>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 100% Privacy Protected
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Clock className="w-3.5 h-3.5" /> Quote in ~10 mins
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. TRUST & STATS STRIP ── */}
        <section className="bg-amber-500 text-slate-950 py-6 border-y border-amber-600/30 shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="border-r border-slate-950/15 last:border-none">
                <p className="text-2xl sm:text-3xl font-black">10+ Years</p>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mt-0.5">Yatra Leadership</p>
              </div>
              <div className="border-r border-slate-950/15 last:border-none">
                <p className="text-2xl sm:text-3xl font-black">1,500+</p>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mt-0.5">Devotees Guided</p>
              </div>
              <div className="border-r border-slate-950/15 last:border-none">
                <p className="text-2xl sm:text-3xl font-black">100%</p>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mt-0.5">Sattvic Indian Meals</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black">24x7</p>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mt-0.5">Oxygen & Medical Care</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. DYNAMIC PACKAGES SECTION (Directly Loaded from Database) ── */}
        <section id="routes" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-3 border border-amber-400/20">
                <Compass className="w-3.5 h-3.5" />
                <span>Curated Pilgrimage Packages</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Kailash Mansarovar <span className="text-amber-600 dark:text-amber-400">Yatra Packages</span>
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-300 mt-3 font-medium">
                Choose the route that fits your schedule, age group, and physical comfort. Every package includes government permit handling, accommodation, meals, and medical coverage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kailashPackages.map((pkg: KailashPackageItem) => {
                const pkgTitle = pkg.title || "Kailash Mansarovar Tour Package";
                const pkgDuration = pkg.duration || "12 Days";
                const pkgLocation = pkg.location || "Tibet, Mount Kailash";
                const pkgImg = pkg.imageUrl1 || pkg.imageUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop";
                const pkgPrice = pkg.discountedPrice || pkg.originalPrice;

                return (
                  <div
                    key={pkg._id}
                    className="bg-white dark:bg-gray-950 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
                  >
                    {/* Image Container */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                      <img
                        src={pkgImg}
                        alt={pkgTitle}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Tag */}
                      <div className="absolute top-3.5 left-3.5 bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        {pkg.tag || "Spiritual Special"}
                      </div>

                      {/* Duration */}
                      <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20">
                        {pkgDuration}
                      </div>

                      {/* Title overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-xl font-black text-white leading-tight line-clamp-2">
                          {pkgTitle}
                        </h3>
                        <p className="text-xs text-gray-300 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{pkgLocation}</span>
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      {/* Price Section */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Package Price</p>
                          <div className="flex items-baseline gap-2">
                            {pkgPrice && pkgPrice > 0 ? (
                              <>
                                <span className="text-2xl font-black text-gray-900 dark:text-white">
                                  ₹{pkgPrice.toLocaleString()}
                                </span>
                                {pkg.originalPrice && pkg.originalPrice > pkgPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{pkg.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                                Price on Request / 2026 Batch
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">4.9/5</span>
                        </div>
                      </div>

                      {/* Inclusions list */}
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>China Group Visa & Tibet Travel Permit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Pure Vegetarian Food prepared by Indian Cook</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Oxygen Cylinders & High-Altitude Medical Kit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Dedicated Hindi/English Speaking Tour Leader</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="pt-2 flex items-center gap-2.5">
                        <Link
                          href={`/package/${pkg._id}`}
                          className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>View Itinerary</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleWhatsAppClick("mansarovar_card_whatsapp", `ॐ नमः शिवाय! I want full itinerary & pricing for "${pkgTitle}". Please assist.`)}
                          className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                          title="Inquire on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
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

        {/* ── 4. TRIP TO TEMPLES BENCHMARK: ROUTE COMPARISON MATRIX ── */}
        <section className="py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
                Route Comparison Guide
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Which Kailash Yatra Route Is Best For You?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Understanding the key differences in duration, travel mode, and physical fitness needed for each route.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Feature</th>
                    <th className="p-4 sm:p-5 text-amber-400">Helicopter Route</th>
                    <th className="p-4 sm:p-5">Overland via Kyirong</th>
                    <th className="p-4 sm:p-5">Lhasa Air Route</th>
                    <th className="p-4 sm:p-5">Aerial Darshan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm font-medium">
                  <tr>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">Starting Point</td>
                    <td className="p-4 text-amber-600 dark:text-amber-400 font-semibold">Lucknow / Nepalgunj</td>
                    <td className="p-4">Kathmandu</td>
                    <td className="p-4">Kathmandu / Lhasa</td>
                    <td className="p-4">Nepalgunj Airport</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">Duration</td>
                    <td className="p-4 font-bold">10 Days / 9 Nights</td>
                    <td className="p-4">14 Days / 13 Nights</td>
                    <td className="p-4">15 Days / 14 Nights</td>
                    <td className="p-4 font-bold text-emerald-600">1 Day Return</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">Physical Trekking</td>
                    <td className="p-4">3 Days (Pony option available)</td>
                    <td className="p-4">3 Days (Pony option available)</td>
                    <td className="p-4">3 Days (Pony option available)</td>
                    <td className="p-4 font-bold text-emerald-600">0 Km (No Trekking)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">China Visa / Permit</td>
                    <td className="p-4">Group Visa & Tibet Permit</td>
                    <td className="p-4">Group Visa & Tibet Permit</td>
                    <td className="p-4">Group Visa & Tibet Permit</td>
                    <td className="p-4 font-bold text-emerald-600">No China Visa Required</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">Best Suited For</td>
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">Seniors & Busy Professionals</td>
                    <td className="p-4">Scenic Lovers & Fit Yatris</td>
                    <td className="p-4">Luxury & Cultural Travelers</td>
                    <td className="p-4">Seniors Who Cannot Trek</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 5. TRIP TO TEMPLES BENCHMARK: DEPARTURE BATCHES & FULL MOON (PURNIMA) CALENDAR ── */}
        <section id="batches" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-3.5 py-1 rounded-full border border-emerald-400/20">
                Fixed Departures 2026 - 2027
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Upcoming Departure Batches & Full Moon Dates
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Doing sacred Snan at Lake Mansarovar on Purnima (Full Moon) is considered most auspicious. Reserve your slot early as permits take 35-45 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEPARTURE_BATCHES_2026.map((batch, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md hover:border-amber-400/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-black text-gray-900 dark:text-white">{batch.month}</span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        batch.status === "Filling Fast" ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {batch.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Batches: <strong className="text-gray-900 dark:text-white">{batch.dates}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Full Moon: <strong className="text-amber-600 dark:text-amber-400">{batch.purnima}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWhatsAppClick("mansarovar_batch_click", `Hello, I want to book my slot for the ${batch.month} (${batch.purnima}) batch of Kailash Mansarovar Yatra.`)}
                    className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Reserve Batch Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. SPECIAL DESK FOR NRIs & INTERNATIONAL DEVOTEES ── */}
        <section id="nri-desk" className="py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                  <Globe className="w-4 h-4" />
                  <span>Dedicated NRI & Foreign Passport Desk</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Special Assistance for NRIs & International Devotees
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Holding a USA, UK, Canadian, Australian, Singaporean, or European Passport? 
                  Shree Ananta Travels provides complete end-to-end liaison with the Tibet Tourism Bureau (TTB), Foreign Affairs Office, and Chinese Embassy in Kathmandu for your Tibet Travel Permit and China Group Visa.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <p className="font-bold text-amber-400 text-sm">Hassle-Free Visa</p>
                    <p className="text-xs text-gray-300 mt-1">Kathmandu Embassy group biometric & visa endorsement assistance.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <p className="font-bold text-amber-400 text-sm">US/UK/Canada Friendly</p>
                    <p className="text-xs text-gray-300 mt-1">Direct wire transfer options & NRI advisory helpline.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <p className="font-bold text-amber-400 text-sm">Kathmandu Concierge</p>
                    <p className="text-xs text-gray-300 mt-1">Airport pickup, 5-star transit hotel, and Pashupatinath VIP darshan.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/15 text-center space-y-4">
                <Globe className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Speak with an NRI Yatra Specialist</h3>
                <p className="text-xs text-gray-300">
                  Call our international desk directly or message us on WhatsApp with your passport country for custom guidelines.
                </p>
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => handleWhatsAppClick("mansarovar_nri_whatsapp", "Namaste! I am an NRI holding a foreign passport. I need details for Kailash Mansarovar Yatra permit and visa process.")}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp NRI Desk
                  </button>
                  <a
                    href="tel:+917289037447"
                    className="w-full py-3 bg-white hover:bg-gray-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 block"
                  >
                    <Phone className="w-4 h-4" /> Call: +91 7289037447
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. THE SACRED 6-STEP YATRA JOURNEY FLOW ── */}
        <section id="journey" className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Pilgrimage Flow
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Sacred Journey from Start to Finish
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 font-medium">
                Step-by-step guidance so you can focus entirely on your spiritual devotion without logistics worries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Registration & Permit Filing", desc: "Submit passport copy and advance deposit. We file your name with Tibet Tourism Bureau." },
                { step: "02", title: "Assembly & Medical Briefing", desc: "Arrive in Kathmandu/Lucknow. Meet fellow yatris, tour leader, and undergo acclimatization briefing." },
                { step: "03", title: "Tibet Entry & Acclimatization", desc: "Cross the border into Tibet. Rest days at Kyirong/Purang to adapt naturally to high altitude." },
                { step: "04", title: "Mansarovar Snan & Puja", desc: "Arrive at Sacred Lake Mansarovar (15,000 ft). Perform holy snan, Hawan, and view Mount Kailash." },
                { step: "05", title: "3-Day Kailash Parikrama (Kora)", desc: "Trek from Yam Dwar through Dirapuk (North Face), Dolma La Pass (18,600 ft), and Zuthulphuk. Ponies & porters available." },
                { step: "06", title: "Safe Return with Divine Blessings", desc: "Conclude the yatra, receive holy Gangajal from Mansarovar, and return safely to India." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
                >
                  <span className="text-3xl font-black text-amber-500 block mb-2">{item.step}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. MEDICAL & FITNESS PREPARATION GUIDELINES ── */}
        <section className="py-16 bg-gray-100 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-3 py-1 rounded-full">
                  Health & Safety Protocol
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  High-Altitude Medical Care & Preparation
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Mount Kailash Parikrama reaches a maximum elevation of 18,600 feet at Dolma La Pass. 
                  Our experienced medical protocol ensures safety for every devotee.
                </p>
                <div className="pt-2">
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <span>Talk to our medical consultant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Oxygen & Gamow Bags</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Continuous supply of oxygen cylinders and hyperbaric chambers carried in support vehicles.</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Age Eligibility (18-70 Yrs)</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Yatris between 18 and 70 years in normal physical health are eligible under Tibet Tourism regulations.</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Hygienic Sattvic Cooking</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Hot nutritious khichdi, dal, roti, soups prepared fresh twice a day to maintain body warmth and stamina.</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Emergency Evacuation</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Arrangements with Nepalese and Chinese authorities for immediate helicopter retrieval if required.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. DEVOTEE TESTIMONIALS & TRUST ── */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Devotee Experiences
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                What Yatris Say About Shree Ananta Travels
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Our helicopter yatra via Lucknow was completely effortless. The Sherpa team took care of my 62-year-old mother with extraordinary devotion. The hot Indian food in Tibet was a blessing.",
                  name: "Rajesh & Savita Sharma",
                  city: "Delhi NCR",
                  route: "Helicopter Route 2024",
                },
                {
                  quote: "As an NRI from California, I was worried about my US passport visa. Shree Ananta Travels handled all approvals smoothly in Kathmandu. Mount Kailash darshan changed my life.",
                  name: "Dr. Vikram Patel",
                  city: "San Jose, USA",
                  route: "NRI Desk Yatri",
                },
                {
                  quote: "Doing Parikrama and Mansarovar Snan on Guru Purnima was my lifelong dream. The oxygen monitoring and warm sleeping bags made us feel safe throughout.",
                  name: "Smt. Meenakshi Iyer",
                  city: "Bengaluru",
                  route: "Overland via Kyirong",
                },
              ].map((t, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.city} • <span className="text-amber-600 dark:text-amber-400 font-bold">{t.route}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. COMPREHENSIVE KAILASH FAQS ACCORDION ── */}
        <section id="faqs" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Answers for Kailash Mansarovar Yatris
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Clear and transparent answers to the most common queries.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  q: "What is the best route for senior citizens or parents?",
                  a: "The Helicopter Route via Lucknow / Nepalgunj is the most recommended for seniors because it minimizes long road transit. For seniors who cannot trek at high altitude, the 1-Day Aerial Darshan flight is the safest option requiring zero physical exertion and no China visa.",
                },
                {
                  q: "How are the China Group Visa and Tibet Travel Permit arranged?",
                  a: "You only need to submit your original passport (with at least 6 months validity) and photographs. Shree Ananta Travels handles the entire processing with the Tibet Tourism Bureau and the Chinese Embassy in Kathmandu.",
                },
                {
                  q: "Can I do the Mount Kailash Parikrama on horse or pony?",
                  a: "Yes. For yatris who find the 42 km 3-day parikrama difficult on foot, local Tibetan ponies and porters are arranged at Yam Dwar on a direct rental basis to assist you comfortably across the pass.",
                },
                {
                  q: "What type of food is provided during the yatra?",
                  a: "We deploy experienced Indian kitchen staff who prepare fresh, hot vegetarian and Jain food daily (poha, porridge, khichdi, dal, rice, chapati, soups, tea, and warm water).",
                },
                {
                  q: "What happens if someone feels altitude sickness (AMS)?",
                  a: "Our tour managers carry oxygen cylinders, pulse oximeters, and first-aid kits at all times. If a yatri experiences severe symptoms, they are immediately brought down to lower altitude by our support vehicle with dedicated escorts.",
                },
                {
                  q: "How many months in advance should I book my Kailash Yatra?",
                  a: "It is strongly advised to book 3 to 6 months in advance. The Chinese authorities issue permits based on fixed batch quotas, and Purnima (Full Moon) batches fill up very quickly.",
                },
                {
                  q: "What is the cancellation and refund policy?",
                  a: "In case border regulations change or unforeseen geopolitical reasons prevent travel, the advance deposit is either refunded after nominal processing fees or adjusted towards the subsequent batch as per devotee preference.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 [&_summary::-webkit-details-marker]:hidden overflow-hidden shadow-xs"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 p-5 sm:p-6 text-gray-900 dark:text-white font-bold text-base sm:text-lg outline-none select-none">
                    <span>{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-open:bg-amber-100 dark:group-open:bg-amber-900/40 transition-colors">
                      <ChevronDown className="w-4 h-4 transition duration-300 group-open:-rotate-180 text-gray-600 dark:text-gray-300 group-open:text-amber-600" />
                    </div>
                  </summary>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-gray-50/50 dark:bg-gray-900/40">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. FINAL HIGH-CONVERSION CTA ── */}
        <section className="relative py-20 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white text-center px-4 overflow-hidden">
          <div className="relative max-w-3xl mx-auto z-10 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3.5 py-1 rounded-full border border-white/20">
              ॐ नमः शिवाय
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Begin Your Journey to the Abode of Lord Shiva
            </h2>
            <p className="text-amber-100 text-base sm:text-lg max-w-xl mx-auto font-medium">
              Join hundreds of blessed devotees on Kailash Mansarovar Yatra 2026-2027. Speak directly with our pilgrimage specialists now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleWhatsAppClick("mansarovar_footer_whatsapp", "ॐ नमः शिवाय! I am ready to plan my Kailash Mansarovar Yatra. Please assist me with packages.")}
                className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-102 flex items-center justify-center gap-2.5 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </button>
              <a
                href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-slate-950 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-102 flex items-center justify-center gap-2.5"
              >
                <Phone className="w-5 h-5" />
                <span>Call Specialist: {contactPhone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── 12. STICKY MOBILE CTA BAR ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-50 flex gap-3 shadow-2xl">
        <button
          onClick={() => handleWhatsAppClick("mansarovar_sticky_whatsapp", "ॐ नमः शिवाय! I need details and pricing for Kailash Mansarovar Yatra.")}
          className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex justify-center items-center gap-2 transition-colors shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Quote</span>
        </button>
        <a
          href={`tel:${contactPhone.replace(/\s+/g, "")}`}
          className="flex-1 bg-slate-900 hover:bg-black text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex justify-center items-center gap-2 transition-colors shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span>Call Specialist</span>
        </a>
      </div>
    </div>
  );
}
