"use client";
import React, { useState } from "react";
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
  HeartHandshake,
  PhoneCall,
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

export default function MansarovarLanding() {
  const { agent, siteConfig, packages: agentPackages } = useAgent();

  // WhatsApp helper
  const buildWhatsAppUrl = (message: string) => {
    const rawNumber = agent?.whatsapp || siteConfig?.contactPhone || "";
    const digits = rawNumber.replace(/\D/g, "");
    const whatsappNumber = digits.startsWith("91") ? digits : `91${digits}`;
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
    package: "Overland Kailash Mansarovar Yatra",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "mansarovar_form_submit" });
    }
    const msg = `Helllo, I want details for Kailash Mansarovar Yatra.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nPreference: ${formData.package}\n\nPlease share itinerary, available dates and pricing.`;
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  // Filter Kailash packages for custom ad-focused rendering
  const apiKailash = (agentPackages || []).filter(
    (p) => p.category === "kailash",
  );

  const handleCallClick = () => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "mansarovar_call_click_navbar" });
    }
    const rawNumber = agent?.whatsapp || siteConfig?.contactPhone || "";
    const digits = rawNumber.replace(/\D/g, "");
    window.location.href = `tel:+91${digits.replace(/^91/, "")}`;
  };

  const rawLogo = siteConfig?.logoUrl || agent?.logo || '/uploads/shree-ananta-logo.jpg';
  const logoUrl = formatLogoUrl(rawLogo) || formatLogoUrl(logoAsset);
  const displayName = siteConfig?.companyName || agent?.businessName || "Shree Ananta Travels";

  return (
    <div className="bg-white dark:bg-gray-950 font-sans">
      {/* 0. CUSTOM LANDING NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center gap-2">
              {/* Logo / Brand */}
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center overflow-hidden bg-white flex-shrink-0 shadow-lg" style={{ border: '2px solid var(--theme-primary)' }}>
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
              {!siteConfig?.logoUrl && !agent?.logo && (
                <span className="text-white font-black text-xl tracking-tight hidden sm:block" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {displayName}
                </span>
              )}
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8 text-white/90 text-sm font-bold uppercase tracking-wider">
              <a href="#packages" className="hover:text-amber-400 transition-colors">Packages</a>
              <a href="#journey" className="hover:text-amber-400 transition-colors">Journey</a>
              <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={handleCallClick}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors border border-white/20 backdrop-blur-sm"
              >
                <PhoneCall className="w-4 h-4" />
                Call Expert
              </button>
              <button 
                onClick={() => handleWhatsAppClick("mansarovar_nav_whatsapp", "Helllo, I need details about Kailash Mansarovar Yatra.")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm hover:bg-[#20BA5A] transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION WITH EMBEDDED FORM */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-[90vh] flex items-center border-b border-gray-800">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2500&auto=format&fit=crop"
            alt="Kailash Mansarovar"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-900/50"></div> */}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 border border-white/20 shadow-lg">
                <Mountain className="w-4 h-4" />
                <span>Your Sacred Journey Begins Here</span>
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Kailash Mansarovar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 block mt-2">
                  Yatra Packages
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed font-medium">
                Experience the ultimate spiritual awakening. Plan your sacred
                journey to Mount Kailash & Lake Mansarovar with India's most
                trusted Yatra experts.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-sm">
                    100% Safe & Secure
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                  <HeartHandshake className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-sm">
                    Expert Indian Guides
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-sm">Premium Stays</span>
                </div>
              </div>
            </div>

            {/* Right: Glassmorphism Form */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">
                {/* subtle glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/30 blur-[60px] rounded-full pointer-events-none"></div>

                <h3 className="text-3xl font-black text-white mb-2 relative z-10 tracking-tight">
                  Get Yatra Details
                </h3>
                <p className="text-gray-300 text-sm mb-6 relative z-10 font-medium">
                  Share your details to get the full itinerary, dates, and
                  pricing instantly on WhatsApp.
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
                        <option value="Overland Kailash Mansarovar Yatra">
                          Overland Kailash Yatra
                        </option>
                        <option value="Kailash Mansarovar Yatra by Helicopter">
                          Helicopter Yatra
                        </option>
                        <option value="Kailash Aerial Darshan">
                          Aerial Darshan
                        </option>
                        <option value="Not Sure - Need Guidance">
                          Not Sure - Need Guidance
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
                  <ShieldCheck className="w-3.5 h-3.5" /> Your information is
                  100% secure with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-8 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 sm:gap-16 text-center">
          {[
            { icon: ShieldCheck, text: "Experienced Yatra Support" },
            { icon: HeartHandshake, text: "Indian Support Staff" },
            { icon: CheckCircle2, text: "End-to-End Assistance" },
            { icon: MessageCircle, text: "WhatsApp Expert Guidance" },
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

      {/* 3. YATRA OPTIONS / CUSTOM LANDING PACKAGES */}
      {apiKailash.length > 0 && (
        <section id="packages" className="py-24 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Compass className="w-3.5 h-3.5" />
                <span>Available Routes</span>
              </div>
              <h2
                className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Choose Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
                  Yatra Path
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                Select a package below to instantly get the complete itinerary
                and pricing details on WhatsApp.
              </p>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {apiKailash.map((pkg) => (
                <div
                  key={pkg._id}
                  className="w-[300px] sm:w-[340px] md:w-[360px] shrink-0 snap-center bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col cursor-pointer group"
                  onClick={() =>
                    handleWhatsAppClick(
                      "mansarovar_pkg_click",
                      `Helllo, I want details for ${pkg.title}. Please share itinerary and pricing.`,
                    )
                  }
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={pkg.imageUrl1 || ""}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-lg">
                      {pkg.duration}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-300 text-sm flex items-center gap-1.5 font-medium">
                        <MapPin className="w-4 h-4 text-amber-400" />{" "}
                        {pkg.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-6 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2">
                        4.9/5 (Top Rated)
                      </span>
                    </div>

                    <div className="mt-auto">
                      <button className="w-full py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(37,211,102,0.2)] group-hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:scale-[1.02] active:scale-95">
                        <MessageCircle className="w-5 h-5" />
                        Get Details on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. WHY CHOOSE US */}
      <WhyTrustUs />

      {/* 5. JOURNEY / EXPERIENCE SECTION */}
      <section id="journey" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Journey <span className="text-amber-500">With Us</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              A seamless pilgrimage experience from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Consultation & Booking",
                desc: "Expert guidance on selecting the right package and travel dates.",
              },
              {
                step: "2",
                title: "Documentation & Visa",
                desc: "Complete assistance with permits, visa, and medical documentation.",
              },
              {
                step: "3",
                title: "The Sacred Yatra",
                desc: "Guided travel, comfortable stays, and dedicated support staff.",
              },
              {
                step: "4",
                title: "Return Journey",
                desc: "Safe return with divine blessings and beautiful memories.",
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

      {/* 6. SOCIAL PROOF */}
      <Testimonials />

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Everything you need to know about the Yatra.
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What are the available Kailash Mansarovar Yatra options?",
                a: "We offer Overland Yatra via Kyirong, Helicopter Yatra via Simikot/Hilsa, and Aerial Darshan flights. The availability depends on border openings and season.",
              },
              {
                q: "How can I get package details?",
                a: 'Click on any "Get Details on WhatsApp" button to instantly chat with our Yatra experts who will share the full itinerary, pricing, and available dates.',
              },
              {
                q: "Is support available during the journey?",
                a: "Yes, our packages include end-to-end guidance, experienced tour managers, and dedicated support staff to assist you throughout the spiritual journey.",
              },
              {
                q: "What information should I provide for a package enquiry?",
                a: "Just provide your name, contact number, preferred travel dates, and the number of yatris (passengers). Our team will customize the options for you.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 [&_summary::-webkit-details-marker]:hidden overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900 dark:text-white font-bold text-lg outline-none">
                  {faq.q}
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-open:bg-amber-100 dark:group-open:bg-amber-900/30 transition-colors">
                    <ChevronDown className="w-5 h-5 transition duration-300 group-open:-rotate-180 text-gray-500 group-open:text-amber-600" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium bg-white dark:bg-gray-900">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="relative py-24 bg-gradient-to-br from-amber-500 to-amber-600 text-center px-4 overflow-hidden mb-[70px] md:mb-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        <div className="relative max-w-3xl mx-auto z-10">
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Plan Your Kailash Mansarovar Yatra?
          </h2>
          <p className="text-amber-50 text-xl mb-10 font-medium">
            Talk to our Yatra experts and get package, date and itinerary
            details instantly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                handleWhatsAppClick(
                  "mansarovar_whatsapp_click_footer",
                  "Helllo, I am ready to plan my Kailash Mansarovar Yatra. Please assist me with packages.",
                )
              }
              className="w-full sm:w-auto px-10 py-5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-2xl font-black text-lg uppercase tracking-wider transition-all shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95"
            >
              <MessageCircle className="w-6 h-6" />
              Get Details on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* 9. STICKY MOBILE CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-[9999] flex gap-3 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
        <button
          onClick={() =>
            handleWhatsAppClick(
              "mansarovar_whatsapp_click_sticky",
              "Helllo, I need help planning Kailash Mansarovar Yatra.",
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
