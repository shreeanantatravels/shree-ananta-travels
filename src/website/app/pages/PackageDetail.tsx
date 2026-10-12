"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Check,
  X,
  Loader2,
  Clock,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Share2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Compass,
  Award,
  CheckCircle2,
  XCircle,
  Headphones,
  Zap,
  Tag,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Topbar } from "../components/Topbar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SocialShareBar } from "../components/SocialShareBar";
import { ChatbotButton } from "../components/ChatbotButton";
import { PlanTourModal } from "../components/PlanTourModal";
import { useState, useEffect } from "react";
import { useAgent } from "../context/AgentContext";

const getBadgeStyles = (badge: string): string => {
  return "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-orange-500/20";
};

const BADGE_ICONS: Record<string, string> = {
  bestseller: "",
};

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const { siteConfig, agent } = useAgent();

  const [packageData, setPackageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
  });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isHoveredGallery, setIsHoveredGallery] = useState(false);

  // Auto slideshow every 3 seconds for main image
  useEffect(() => {
    if (
      !packageData?.images ||
      packageData.images.length <= 1 ||
      isHoveredGallery
    )
      return;

    const interval = setInterval(() => {
      setActiveImage((prevActive) => {
        const currentImages = packageData.images;
        const currentIndex = currentImages.indexOf(
          prevActive || currentImages[0],
        );
        const nextIndex = (currentIndex + 1) % currentImages.length;
        return currentImages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [packageData?.images, isHoveredGallery]);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    fetch(`/api/packages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const pkg = data.data;
          const rawImages = [
            pkg.imageUrl1,
            pkg.imageUrl2,
            pkg.imageUrl3,
            pkg.imageUrl4,
          ].filter(Boolean);
          const finalImages = rawImages;

          setPackageData({
            title: pkg.title || "Tour Package",
            location: pkg.location || "India",
            price:
              pkg.discountedPrice && pkg.discountedPrice > 0
                ? pkg.discountedPrice
                : pkg.originalPrice && pkg.originalPrice > 0
                  ? pkg.originalPrice
                  : 0,
            originalPrice:
              pkg.originalPrice &&
              pkg.discountedPrice &&
              pkg.originalPrice > pkg.discountedPrice
                ? pkg.originalPrice
                : null,
            duration: pkg.duration || "Custom Duration",
            badges: pkg.badges && Array.isArray(pkg.badges) ? pkg.badges : [],
            images: finalImages,
            rating: typeof pkg.rating === "number" && pkg.rating > 0 ? pkg.rating : null,
            reviews: typeof pkg.reviewCount === "number" && pkg.reviewCount > 0 ? pkg.reviewCount : null,
            description:
              pkg.description ||
              "Handcrafted travel package curated with personalized accommodations, transfers, and guided sightseeing.",
            highlights:
              pkg.highlights && pkg.highlights.length > 0
                ? pkg.highlights
                : [],
            itinerary:
              pkg.itinerary && pkg.itinerary.length > 0
                ? pkg.itinerary.map((i: any) => ({
                    day: i.dayNumber || i.day,
                    title: i.title || `Day ${i.dayNumber || i.day} Sightseeing`,
                    description:
                      i.description ||
                      "Curated day of sightseeing, local experiences, and comfortable stay.",
                  }))
                : [],
            inclusions:
              pkg.inclusions && pkg.inclusions.length > 0
                ? pkg.inclusions
                : [],
            exclusions:
              pkg.exclusions && pkg.exclusions.length > 0
                ? pkg.exclusions
                : [],
            termsAndConditions: Array.isArray(pkg.termsAndConditions)
              ? pkg.termsAndConditions
              : typeof pkg.termsAndConditions === "string" &&
                  pkg.termsAndConditions.trim()
                ? [pkg.termsAndConditions]
                : [],
          });
          setActiveImage(finalImages[0] || "");
        } else {
          setPackageData(null);
        }
      })
      .catch(() => {
        setPackageData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const footer = document.querySelector("footer");
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

      if (scrollY > 350 && footerTop > window.innerHeight + 100) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const expandAllDays = () => {
    if (!packageData) return;
    const allExpanded: Record<number, boolean> = {};
    packageData.itinerary.forEach((item: any) => {
      allExpanded[item.day] = true;
    });
    setExpandedDays(allExpanded);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  const handleWhatsAppShare = () => {
    if (!packageData) return;
    const phone = agent?.whatsapp || siteConfig?.contactPhone || "";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const priceTxt =
      packageData.price && packageData.price > 0
        ? `₹${packageData.price.toLocaleString()} per person`
        : "Price on Request";
    const message = `Hello! 🌟 I'm interested in the "${packageData.title}" package (${packageData.location}).\nDuration: ${packageData.duration}\nPrice: ${priceTxt}.\nPlease share the full itinerary details.\n\nLink: ${typeof window !== "undefined" ? window.location.href : ""}`;
    if (!cleanPhone) {
      if (typeof window !== "undefined") window.location.href = "/contact";
      return;
    }
    const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone);
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col">
        <Topbar />
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-20">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--theme-primary)]/20 border-t-[var(--theme-primary)] animate-spin" />
            <Sparkles className="w-6 h-6 text-[var(--theme-primary)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg animate-pulse">
            Crafting your dream package details...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col">
        <Topbar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Package Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            The travel package you are looking for does not exist or has been
            removed.
          </p>
          <Link
            href="/packages"
            className="px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all hover:opacity-90"
            style={{ background: "var(--theme-primary)" }}
          >
            Explore All Packages
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const phoneNum = siteConfig?.contactPhone || agent?.whatsapp || "";
  const discountPercent = packageData.originalPrice
    ? Math.round(
        ((packageData.originalPrice - packageData.price) /
          packageData.originalPrice) *
          100,
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans selection:bg-[var(--theme-primary)] selection:text-white">
      <Topbar />
      <Navbar />

      {/* ━━━ Hero / Breadcrumb Section ━━━ */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200/80 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 hover:bg-[var(--theme-primary)] hover:text-white dark:hover:bg-[var(--theme-primary)] transition-all group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Tour Packages</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                title="Copy Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Link Copied!" : "Share"}</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-transform active:scale-95 shadow-md shadow-green-600/20"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                <span>Ask on WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  {packageData.location}
                </span>

                {packageData.badges?.includes("bestseller") && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm shadow-red-500/30 border border-red-400">
                    Bestseller
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
                {packageData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {packageData.rating && (
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{packageData.rating}</span>
                    {packageData.reviews && (
                      <span className="opacity-75">
                        ({packageData.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                  <Calendar className="w-4 h-4" />
                  <span>{packageData.duration}</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Customized Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ━━━ Image Showcase Gallery ━━━ */}
        <div
          className="mb-10"
          onMouseEnter={() => setIsHoveredGallery(true)}
          onMouseLeave={() => setIsHoveredGallery(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Primary Main Image (Native 4:5 Aspect Ratio Container) */}
            <div className={`${packageData.images?.length > 1 ? "lg:col-span-7 xl:col-span-6" : "lg:col-span-12 max-w-2xl"} relative w-full max-w-[460px] aspect-[4/5] mx-auto rounded-3xl overflow-hidden shadow-2xl group border border-slate-200 dark:border-gray-800 bg-slate-950`}>
              {activeImage || packageData.images?.[0] ? (
                <img
                  src={activeImage || packageData.images[0]}
                  alt={packageData.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
                  <MapPin className="w-12 h-12 text-[var(--theme-primary)] mb-3 opacity-80" />
                  <span className="font-bold text-2xl leading-tight">
                    {packageData.title}
                  </span>
                  <span className="text-xs text-slate-400 mt-2">
                    {packageData.location}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none flex items-end justify-between z-10">
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-amber-300 mb-1">
                    Featured Destination
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold">
                    {packageData.title}
                  </h3>
                </div>
                {packageData.images?.length > 1 && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold border border-white/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />{" "}
                    Photo Tour
                  </span>
                )}
              </div>

              {/* Slider Controls */}
              {packageData.images?.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const currentIndex = packageData.images.indexOf(
                        activeImage || packageData.images[0],
                      );
                      const prevIndex =
                        (currentIndex - 1 + packageData.images.length) %
                        packageData.images.length;
                      setActiveImage(packageData.images[prevIndex]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-colors z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const currentIndex = packageData.images.indexOf(
                        activeImage || packageData.images[0],
                      );
                      const nextIndex =
                        (currentIndex + 1) % packageData.images.length;
                      setActiveImage(packageData.images[nextIndex]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-colors z-20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery Grid - only rendered when multiple photos exist */}
            {packageData.images?.length > 1 && (
              <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-start">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <span>📸 Photo Gallery</span>
                  <span className="text-gray-400 font-normal">
                    ({packageData.images.length} Photos)
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-3.5 max-w-[460px]">
                  {packageData.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${
                        activeImage === img
                          ? "border-[var(--theme-primary)] scale-[1.02] ring-4 ring-[var(--theme-primary)]/20"
                          : "border-transparent opacity-80 hover:opacity-100 hover:scale-[1.01]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${packageData.title} photo ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                      {activeImage === img && (
                        <div className="absolute inset-0 bg-[var(--theme-primary)]/25 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ━━━ Main Body Layout Grid ━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details, Highlights, Itinerary, Inclusions */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Key Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {packageData.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {packageData.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-400">
                    Tour Style
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {packageData.rating ? `⭐ ${packageData.rating} / 5` : "Curated & Verified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-400">
                    Confirmation
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Instant Booking
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Description */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-md">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Compass className="w-6 h-6 text-[var(--theme-primary)]" />
                <span>Package Overview</span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
                {packageData.description}
              </p>
            </div>

            {/* Day-wise Accordion Itinerary */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[var(--theme-primary)]" />
                    <span>Detailed Day-by-Day Itinerary</span>
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    Click on any day to explore activities & stay schedule
                  </p>
                </div>
                {packageData.itinerary && packageData.itinerary.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={expandAllDays}
                      className="text-xs font-semibold text-[var(--theme-primary)] hover:underline"
                    >
                      Expand All
                    </button>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <button
                      onClick={collapseAllDays}
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:underline"
                    >
                      Collapse All
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {packageData.itinerary && packageData.itinerary.length > 0 ? (
                  packageData.itinerary.map((item: any) => {
                    const isOpen = !!expandedDays[item.day];
                    return (
                      <div
                        key={item.day}
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? "border-[var(--theme-primary)]/40 bg-slate-50/50 dark:bg-gray-800/50 shadow-sm"
                            : "border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700"
                        }`}
                      >
                        <button
                          onClick={() => toggleDay(item.day)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`px-4 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm whitespace-nowrap flex-shrink-0 transition-colors ${
                                isOpen
                                  ? "bg-[var(--theme-primary)] text-white shadow-md"
                                  : "bg-slate-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              Day {item.day}
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate">
                              {item.title}
                            </h3>
                          </div>
                          <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-t border-slate-200/60 dark:border-gray-700/60 font-normal">
                            <p className="mt-2">{item.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                    A customized day-by-day itinerary tailored to your travel dates and preferences is crafted upon request. Contact our team to plan your personalized schedule.
                  </div>
                )}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions Card */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-emerald-50/30 to-white dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-gray-900 rounded-3xl p-6 sm:p-7 border border-emerald-200/70 dark:border-emerald-900/60 shadow-md">
                <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-300 mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span>Package Inclusions</span>
                </h3>
                <ul className="space-y-3">
                  {packageData.inclusions && packageData.inclusions.length > 0 ? (
                    packageData.inclusions.map((inc: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-2xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black shadow-sm">
                          ✓
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {inc}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      Inclusions are tailored to your selected package tier. Contact us for complete inclusions details.
                    </li>
                  )}
                </ul>
              </div>

              {/* Exclusions Card */}
              <div className="bg-gradient-to-br from-rose-50/70 via-rose-50/30 to-white dark:from-rose-950/40 dark:via-rose-950/20 dark:to-gray-900 rounded-3xl p-6 sm:p-7 border border-rose-200/70 dark:border-rose-900/60 shadow-md">
                <h3 className="text-lg font-black text-rose-900 dark:text-rose-300 mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <span>Package Exclusions</span>
                </h3>
                <ul className="space-y-3">
                  {packageData.exclusions && packageData.exclusions.length > 0 ? (
                    packageData.exclusions.map((exc: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs p-3 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-2xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black shadow-sm">
                          ✕
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {exc}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-xs font-medium text-rose-800 dark:text-rose-300 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      Standard exclusions apply (personal expenses, optional activities). Detailed terms provided on inquiry.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Terms & Conditions */}
            {packageData.termsAndConditions &&
              packageData.termsAndConditions.length > 0 && (
                <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-900/50 shadow-md">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-xs">
                      📝
                    </span>
                    <span>Terms & Conditions</span>
                  </h3>
                  <ul className="space-y-3">
                    {packageData.termsAndConditions.map(
                      (term: string, index: number) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {term}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

            {/* Concierge Assistance Banner */}
            <div
              className="rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{
                background:
                  "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, var(--theme-primary)))",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs uppercase font-extrabold text-white/70 tracking-wider">
                      Dedicated Concierge Support
                    </span>
                  </div>
                  <h4 className="text-xl font-bold">
                    Need Customization or Help?
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    Speak with our experienced travel specialists directly.
                  </p>
                </div>
              </div>
              <button
                onClick={handleWhatsAppShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white font-extrabold text-sm hover:bg-white/90 transition-all shadow-lg active:scale-95"
                style={{ color: "#25D366" }}
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget (Desktop) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow-2xl p-6 sticky top-28 space-y-6">
              {/* Pricing Display */}
              <div className="bg-slate-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-slate-200/60 dark:border-gray-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    {packageData.price && packageData.price > 0
                      ? "Best Deal Offer"
                      : "Pricing"}
                  </span>
                  {discountPercent && (
                    <span className="bg-emerald-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>

                {packageData.price && packageData.price > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[var(--theme-primary)] tracking-tight">
                      ₹{packageData.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      / person
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[var(--theme-primary)] tracking-tight">
                      Price on Request
                    </span>
                  </div>
                )}

                {packageData.originalPrice && packageData.originalPrice > 0 && (
                  <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>Original Price:</span>
                    <span className="line-through">
                      ₹{packageData.originalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-95 text-white font-extrabold text-base shadow-xl shadow-[var(--theme-primary)]/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Get Free Instant Quote</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full py-3.5 px-6 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2.5"
                >
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="w-4 h-4 text-white"
                  />
                  <span>Customize on WhatsApp</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-slate-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold">
                    ✓
                  </div>
                  <span>Instant Booking Confirmation</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold">
                    ✓
                  </div>
                  <span>No Hidden Charges & Transparent Pricing</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold">
                    ✓
                  </div>
                  <span>Free Itinerary Customization</span>
                </div>
              </div>

              {/* Direct Call Helper */}
              {phoneNum ? (
                <div className="p-4 bg-slate-100 dark:bg-gray-800/80 rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Have Questions?
                    </p>
                    <a
                      href={`tel:${phoneNum.replace(/[^0-9+]/g, '')}`}
                      className="text-xs font-extrabold text-gray-900 dark:text-white hover:text-[var(--theme-primary)]"
                    >
                      {phoneNum}
                    </a>
                  </div>
                  <button
                    onClick={handleWhatsAppShare}
                    className="p-2.5 bg-[#25D366]/10 dark:bg-gray-700 text-[#25D366] rounded-xl shadow-sm hover:scale-105 transition-transform"
                    aria-label="Ask on WhatsApp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-100 dark:bg-gray-800/80 rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Have Questions?
                    </p>
                    <Link
                      href="/contact"
                      className="text-xs font-extrabold text-[var(--theme-primary)] hover:underline"
                    >
                      Contact our Team
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ━━━ Mobile Floating Sticky Bar ━━━ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300 ease-out ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-slate-200 dark:border-gray-800 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] px-4 py-3">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-wider font-extrabold">
                Starting at
              </p>
              {packageData.price && packageData.price > 0 ? (
                <p className="text-xl font-black text-[var(--theme-primary)] leading-none">
                  ₹{packageData.price.toLocaleString()}
                  <span className="text-[10px] font-normal text-gray-600 dark:text-gray-400 ml-1">
                    / person
                  </span>
                </p>
              ) : (
                <p className="text-base font-black text-[var(--theme-primary)] leading-none">
                  Price on Request
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="p-3 rounded-xl bg-green-600 text-white shadow-md active:scale-95"
                title="Share on WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowQuoteModal(true)}
                className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white font-extrabold py-3 px-6 rounded-xl shadow-lg text-xs tracking-wide active:scale-95"
              >
                Get Free Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      <SocialShareBar title={`${packageData.title} | Shree Ananta Travels`} />
      <Footer />
      <ChatbotButton hidden />

      <PlanTourModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        preselectedPackage={{
          title: packageData.title,
          location: packageData.location,
          price: packageData.price,
          duration: packageData.duration,
        }}
      />
    </div>
  );
}
