"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Phone,
  ArrowRight,
  User,
  Compass,
  ChevronDown,
  Mountain,
  HeartHandshake,
  PhoneCall,
  Globe,
  Utensils,
  HeartPulse,
  ExternalLink,
} from "lucide-react";
import { useAgent } from "../context/AgentContext";
import { WhyTrustUs } from "../components/WhyTrustUs";
import { Testimonials } from "../components/Testimonials";
import logoAsset from "../../assets/tgt-logo.png";

function formatLogoUrl(url: any): string {
  if (!url) return '';
  if (typeof url === 'object' && url.src) return url.src;
  if (typeof url === 'string') {
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
    return `/uploads/${url}`;
  }
  return '';
}

const DEFAULT_ROUTES_FALLBACK = [
  {
    _id: "helicopter-lucknow",
    title: "Kailash Mansarovar Yatra by Helicopter via Lucknow",
    location: "Lucknow - Nepalgunj - Simikot - Hilsa - Mansarovar",
    duration: "10 Days / 9 Nights",
    imageUrl1: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Helicopter Route",
  },
  {
    _id: "overland-kyirong",
    title: "Overland Kailash Mansarovar Yatra via Kyirong",
    location: "Kathmandu - Syabrubesi - Kyirong - Saga - Mansarovar",
    duration: "14 Days / 13 Nights",
    imageUrl1: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Overland Route",
  },
  {
    _id: "lhasa-air-route",
    title: "Kailash Mansarovar Yatra Via Lhasa – Air Route",
    location: "Kathmandu - Lhasa - Shigatse - Saga - Mansarovar",
    duration: "15 Days / 14 Nights",
    imageUrl1: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "Air & Cultural Route",
  },
  {
    _id: "aerial-darshan",
    title: "Kailash Mansarovar Aerial Mountain Flight Darshan",
    location: "Nepalgunj - Mountain Flight - Lake Mansarovar View",
    duration: "1 Day Scenic Darshan",
    imageUrl1: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    category: "kailash",
    tag: "No Trekking | No China Visa",
  },
];

export default function MansarovarLanding() {
  const { agent, siteConfig, packages: agentPackages } = useAgent();

  // WhatsApp helper
  const buildWhatsAppUrl = (message: string) => {
    const rawNumber = agent?.whatsapp || siteConfig?.contactPhone || "";
    const digits = rawNumber.replace(/\D/g, "");
    if (!digits) return "/contact";
    const whatsappNumber = digits.startsWith("91") ? digits : (digits.length === 10 ? `91${digits}` : digits);
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppClick = (eventName: string, message: string) => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: eventName });
    }
    window.open(buildWhatsAppUrl(message), "_blank");
  };

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    package: "Helicopter Route (10 Days via Lucknow)",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "mansarovar_form_submit" });
    }
    const msg = `ॐ नमः शिवाय! I want details for Kailash Mansarovar Yatra 2026 - 2027.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nPreferred Route: ${formData.package}\n\nPlease share the detailed itinerary, upcoming departure batches, and all-inclusive pricing quote.`;
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  // Filter Kailash packages from database or fallback
  const dbKailash = (agentPackages || []).filter((p) => {
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
  const apiKailash = dbKailash.length > 0 ? dbKailash : DEFAULT_ROUTES_FALLBACK;

  const handleCallClick = () => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "mansarovar_call_click_navbar" });
    }
    const rawNumber = agent?.whatsapp || siteConfig?.contactPhone || "";
    const digits = rawNumber.replace(/\D/g, "");
    if (!digits) {
      window.location.href = "/contact";
      return;
    }
    const cleanTel = digits.startsWith("91") ? digits : (digits.length === 10 ? `91${digits}` : digits);
    window.location.href = `tel:+${cleanTel}`;
  };

  const rawLogo = siteConfig?.logoUrl || agent?.logo || '/uploads/shree-ananta-logo.jpg';
  const logoUrl = formatLogoUrl(rawLogo) || formatLogoUrl(logoAsset);
  const displayName = siteConfig?.companyName || agent?.businessName || "Shree Ananta Travels";

  return (
    <div className="bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      {/* 0. CUSTOM HIGH-CONVERTING NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/45 backdrop-blur-md border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo / Brand */}
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center overflow-hidden bg-white flex-shrink-0 shadow-lg" style={{ border: '2px solid var(--theme-primary)' }}>
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-black text-base md:text-xl tracking-tight hidden sm:block group-hover:text-amber-400 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                {displayName}
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-7 text-white/90 text-sm font-bold uppercase tracking-wider">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <a href="#packages" className="hover:text-amber-400 transition-colors">Packages</a>
              <a href="#routes" className="hover:text-amber-400 transition-colors">Routes</a>
              <a href="#journey" className="hover:text-amber-400 transition-colors">Journey</a>
              <a href="#faq" className="hover:text-amber-400 transition-colors">FAQs</a>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={handleCallClick}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors border border-white/20 backdrop-blur-sm"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                Call Expert
              </button>
              <button 
                onClick={() => handleWhatsAppClick("mansarovar_nav_whatsapp", "ॐ नमः शिवाय! I need details about Kailash Mansarovar Yatra 2026 - 2027.")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm hover:bg-[#20BA5A] transition-colors shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION WITH EMBEDDED LEAD CAPTURE FORM */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[90vh] flex items-center border-b border-gray-800">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2500&auto=format&fit=crop"
            alt="Mount Kailash and Lake Mansarovar Holy Yatra"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-900/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-white/20 shadow-lg">
                <Mountain className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Your Sacred Journey Begins Here ॐ नमः शिवाय | Authorized Pilgrimage Partner</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Kailash Mansarovar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 block mt-2">
                  Yatra 2026 - 2027
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed font-medium">
                Experience the ultimate spiritual awakening. Plan your sacred
                journey to Mount Kailash & Lake Mansarovar with India's trusted
                Yatra experts — complete with official Tibet permits, certified Sherpas, and hot pure vegetarian Indian meals.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-sm">
                    Tibet Permits & China Visa
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                  <Utensils className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-sm">
                    Indian Cook & Pure Veg
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                  <HeartPulse className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-sm">
                    Oxygen & Sherpa Care
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Glassmorphism Form */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">
                {/* Subtle Amber Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/30 blur-[60px] rounded-full pointer-events-none"></div>

                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 relative z-10 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Get Yatra Details
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm mb-6 relative z-10 font-medium leading-relaxed">
                  Share your details to receive route comparison, 2026-2027 season departure advisory, and pricing instantly on WhatsApp.
                </p>

                <form
                  onSubmit={handleFormSubmit}
                  className="space-y-4 relative z-10"
                >
                  <div>
                    <div className="relative flex items-center bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-amber-400 focus-within:bg-black/40 transition-all shadow-inner">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Full Name"
                        className="bg-transparent w-full text-white placeholder-gray-400 text-sm outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative flex items-center bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-amber-400 focus-within:bg-black/40 transition-all shadow-inner">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-400 text-sm font-bold mr-2">
                        +91
                      </span>
                      <input
                        required
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Mobile Number"
                        className="bg-transparent w-full text-white placeholder-gray-400 text-sm outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative flex items-center bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-amber-400 focus-within:bg-black/40 transition-all shadow-inner">
                      <Compass className="w-5 h-5 text-gray-400 mr-3" />
                      <select
                        value={formData.package}
                        onChange={(e) =>
                          setFormData({ ...formData, package: e.target.value })
                        }
                        className="bg-transparent w-full text-white text-sm outline-none appearance-none cursor-pointer font-medium [&>option]:text-gray-900"
                      >
                        <option value="Helicopter Route (10 Days via Lucknow)">
                          Helicopter Route (10 Days via Lucknow)
                        </option>
                        <option value="Overland Kailash Yatra (14 Days via Kyirong)">
                          Overland Kailash Yatra (14 Days via Kyirong)
                        </option>
                        <option value="Lhasa Air Route (15 Days with Potala Palace)">
                          Lhasa Air Route (15 Days with Potala Palace)
                        </option>
                        <option value="Aerial Darshan Flight (1 Day Scenic Darshan)">
                          Aerial Darshan Flight (1 Day Scenic Darshan)
                        </option>
                        <option value="Not Sure - Need Expert Guidance">
                          Not Sure - Need Expert Guidance
                        </option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 mt-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get Details on WhatsApp
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-5 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Your information is
                  100% secure with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AUTHENTIC TRUST STRIP */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-8 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 sm:gap-16 text-center">
          {[
            { icon: ShieldCheck, text: "Official Tibet Permits" },
            { icon: Utensils, text: "Pure Veg Indian Kitchen" },
            { icon: HeartPulse, text: "Oxygen & Sherpa Care" },
            { icon: MessageCircle, text: "24/7 Expert Guidance" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. YATRA OPTIONS / PACKAGES */}
      <section id="packages" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200 dark:border-amber-800">
              <Compass className="w-3.5 h-3.5" />
              <span>Available Packages</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
                Yatra Path
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Select a package below to view itinerary highlights or instantly get the complete itinerary and pricing details on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiKailash.map((pkg: any) => {
              const isDatabaseId = pkg._id && !pkg._id.includes('-');
              return (
                <div
                  key={pkg._id}
                  className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={pkg.imageUrl1 || pkg.imageUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop"}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white shadow-lg">
                      {pkg.duration || "Multi-Day Yatra"}
                    </div>
                    {pkg.tag && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md">
                        {pkg.tag}
                      </div>
                    )}
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 line-clamp-2 leading-tight">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-300 text-xs flex items-center gap-1.5 font-medium line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />{" "}
                        {pkg.location || "Mount Kailash & Lake Mansarovar"}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Inclusions */}
                    <div className="space-y-2 mb-6 text-xs text-gray-600 dark:text-gray-300 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>China Group Visa & Tibet Permits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Pure Vegetarian Indian Kitchen</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Oxygen Cylinder & Sherpa Support</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-2">
                      {isDatabaseId ? (
                        <Link
                          href={`/package/${pkg._id}`}
                          className="flex-1 py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : null}
                      <button
                        onClick={() =>
                          handleWhatsAppClick(
                            "mansarovar_pkg_click",
                            `ॐ नमः शिवाय! I want details for "${pkg.title}". Please share complete itinerary, departure dates and pricing.`,
                          )
                        }
                        className={`${isDatabaseId ? 'flex-1' : 'w-full'} py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_14px_0_rgba(37,211,102,0.2)] hover:scale-[1.02] active:scale-95`}
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

      {/* 4. KEY ROUTES AT A GLANCE (Route Comparison Cards) */}
      <section id="routes" className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-block mb-3">
              Route Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Choose the Right Route for Your Travel Style
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 font-medium">
              Every yatri has unique preferences. Compare the 4 distinct routes to find your ideal pilgrimage experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Helicopter Route */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/60 flex flex-col justify-between hover:shadow-lg hover:border-amber-400/50 transition-all">
              <div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-md inline-block">
                  Fast & Popular
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                  Helicopter Route
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">
                  Lucknow to Nepalgunj, Simikot, and Hilsa. 10 Days total. Lowest road journey, ideal for senior citizens.
                </p>
              </div>
              <button
                onClick={() => handleWhatsAppClick("mansarovar_route_heli", "Hello, I want details for Kailash Yatra by Helicopter Route (Lucknow to Nepalgunj, Simikot, Hilsa).")}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
              >
                <span>Inquire Helicopter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Overland via Kyirong */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/60 flex flex-col justify-between hover:shadow-lg hover:border-emerald-400/50 transition-all">
              <div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md inline-block">
                  Scenic Drive
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                  Overland via Kyirong
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">
                  Kathmandu to Kyirong border by coach. 14 Days total. Best natural step-by-step altitude adjustment.
                </p>
              </div>
              <button
                onClick={() => handleWhatsAppClick("mansarovar_route_overland", "Hello, I want details for Overland Kailash Yatra via Kyirong.")}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
              >
                <span>Inquire Overland</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Lhasa Air Route */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/60 flex flex-col justify-between hover:shadow-lg hover:border-purple-400/50 transition-all">
              <div>
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-md inline-block">
                  Comfort & Culture
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                  Lhasa Air Route
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">
                  Flight to Lhasa with visits to Potala Palace. 15 Days total. Deluxe accommodation and scenic plateau transit.
                </p>
              </div>
              <button
                onClick={() => handleWhatsAppClick("mansarovar_route_lhasa", "Hello, I want details for Kailash Mansarovar via Lhasa Air Route.")}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
              >
                <span>Inquire Lhasa Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Aerial Darshan Flight */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/60 flex flex-col justify-between hover:shadow-lg hover:border-blue-400/50 transition-all">
              <div>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-md inline-block">
                  Zero Trekking
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                  Aerial Darshan Flight
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">
                  Mountain flight close to Mount Kailash. 1 Day return. No trekking and no China visa required.
                </p>
              </div>
              <button
                onClick={() => handleWhatsAppClick("mansarovar_route_aerial", "Hello, I want details for Kailash Aerial Mountain Flight Darshan (Zero Trekking, No China Visa).")}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
              >
                <span>Inquire Aerial Flight</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPECIAL DESK FOR NRIs & INTERNATIONAL YATRIS */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>NRI & Foreign Passport Support</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Traveling from USA, UK, Canada, Australia or Singapore?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-medium leading-relaxed">
                Shree Ananta Travels provides complete liaison for China Group Visa and Tibet Travel Permits for foreign passport holders.
              </p>
            </div>

            <button
              onClick={() => handleWhatsAppClick("mansarovar_nri_desk", "Namaste! I am an NRI / Foreign Passport holder. Please share guidelines and documents needed for Kailash Mansarovar Yatra 2026-2027.")}
              className="py-3.5 px-6 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact NRI Desk</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <WhyTrustUs />

      {/* 7. JOURNEY / EXPERIENCE SECTION */}
      <section id="journey" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Journey <span className="text-amber-500">With Us</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
              A seamless, guided pilgrimage experience from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Consultation & Booking",
                desc: "Expert guidance on selecting the best route, season batch, and physical preparation.",
              },
              {
                step: "2",
                title: "Documentation & Visa",
                desc: "Complete liaison for Tibet Travel Permits, China Group Visa, and foreign travel clearance.",
              },
              {
                step: "3",
                title: "The Sacred Yatra",
                desc: "Guided travel with experienced Sherpas, pure veg Indian food, oxygen care, and comfortable stays.",
              },
              {
                step: "4",
                title: "Return Journey",
                desc: "Safe return with divine blessings, holy Mansarovar water, and lifelong memories.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center relative hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-white dark:bg-gray-700 shadow-md text-amber-500 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-16 -right-8 w-16 border-t-2 border-dashed border-gray-300 dark:border-gray-600 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <Testimonials />

      {/* 9. COMMON QUESTIONS / FAQS */}
      <section id="faq" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-block mb-3">
              Common Questions
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Kailash Mansarovar FAQs
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">
              Everything you need to know about preparing for and undertaking this sacred pilgrimage.
            </p>
          </div>
          <div className="space-y-4">
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
              {
                q: "Can NRIs and foreign passport holders join this Yatra?",
                a: "Yes! Foreign passport holders (USA, UK, Canada, Australia, etc.) and NRIs can easily join with appropriate China Group Visa processing arranged by our team.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 [&_summary::-webkit-details-marker]:hidden overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 p-5 sm:p-6 text-gray-900 dark:text-white font-bold text-base sm:text-lg outline-none select-none">
                  <span>{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-open:bg-amber-100 dark:group-open:bg-amber-900/30 transition-colors shrink-0">
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition duration-300 group-open:-rotate-180 text-gray-500 group-open:text-amber-600" />
                  </div>
                </summary>
                <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-white dark:bg-gray-900">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CONVERTING CTA */}
      <section className="relative py-24 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-center px-4 overflow-hidden mb-[70px] md:mb-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        <div className="relative max-w-3xl mx-auto z-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Plan Your Kailash Mansarovar Yatra?
          </h2>
          <p className="text-amber-50 text-lg sm:text-xl mb-10 font-medium leading-relaxed">
            Talk to our senior pilgrimage specialists and get complete package details, date schedules, and custom itinerary options instantly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                handleWhatsAppClick(
                  "mansarovar_whatsapp_click_footer",
                  "ॐ नमः शिवाय! I am ready to plan my Kailash Mansarovar Yatra 2026 - 2027. Please assist me with packages and booking guidance.",
                )
              }
              className="w-full sm:w-auto px-10 py-5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95"
            >
              <MessageCircle className="w-6 h-6" />
              Get Details on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* 11. STICKY MOBILE ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-[9999] flex gap-3 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
        <button
          onClick={() =>
            handleWhatsAppClick(
              "mansarovar_whatsapp_click_sticky",
              "ॐ नमः शिवाय! I need help planning Kailash Mansarovar Yatra 2026 - 2027.",
            )
          }
          className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex justify-center items-center gap-2 transition-colors shadow-md"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
        <button
          onClick={() => {
            if (typeof window !== "undefined" && (window as any).dataLayer) {
              (window as any).dataLayer.push({
                event: "mansarovar_call_click_sticky",
              });
            }
            const rawNumber = agent?.whatsapp || siteConfig?.contactPhone || "";
            const digits = rawNumber.replace(/\D/g, "");
            window.location.href = `tel:+91${digits.replace(/^91/, "")}`;
          }}
          className="flex-1 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex justify-center items-center gap-2 transition-colors shadow-md"
        >
          <PhoneCall className="w-5 h-5" />
          Call Now
        </button>
      </div>
    </div>
  );
}
