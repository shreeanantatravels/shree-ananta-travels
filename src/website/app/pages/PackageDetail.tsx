"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
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
  Mountain,
  Navigation,
  Bed,
  Utensils,
  Bus,
  Maximize2,
  X,
  PhoneCall,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Topbar } from "../components/Topbar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SocialShareBar } from "../components/SocialShareBar";
import { ChatbotButton } from "../components/ChatbotButton";
import { PlanTourModal } from "../components/PlanTourModal";
import { PackageRouteMap } from "../components/PackageRouteMap";
import { useState, useEffect } from "react";
import { useAgent } from "../context/AgentContext";
import { getDisplayPhone, getTelHref, getWhatsAppUrl } from "../utils/contactConfig";

export function formatPackageData(pkg: any) {
  if (!pkg) return null;
  const images = [pkg.imageUrl1, pkg.imageUrl2, pkg.imageUrl3, pkg.imageUrl4].filter(Boolean);

  return {
    id: pkg._id?.toString() || pkg.id,
    slug: pkg.slug,
    title: pkg.title || "Tour Package",
    location: pkg.location || "India",
    category: pkg.category || "kailash",
    packageType: pkg.packageType || "pilgrimage",
    price:
      pkg.discountedPrice && pkg.discountedPrice > 0
        ? pkg.discountedPrice
        : pkg.originalPrice && pkg.originalPrice > 0
          ? pkg.originalPrice
          : 0,
    originalPrice:
      pkg.originalPrice && pkg.discountedPrice && pkg.originalPrice > pkg.discountedPrice
        ? pkg.originalPrice
        : null,
    duration: pkg.duration || "Custom Duration",
    badges: Array.isArray(pkg.badges) ? pkg.badges : [],
    images: images,
    description:
      pkg.description ||
      "Handcrafted travel package curated with personalized accommodations, transfers, and guided sightseeing.",
    enableRouteMap:
      pkg.enableRouteMap ??
      (pkg.category === "kailash" || (pkg.itinerary && pkg.itinerary.some((i: any) => !!i.city))),
    enableAltitude:
      pkg.enableAltitude ??
      (pkg.category === "kailash" || (pkg.itinerary && pkg.itinerary.some((i: any) => !!i.altitude))),
    itinerary:
      pkg.itinerary && pkg.itinerary.length > 0
        ? pkg.itinerary.map((i: any, index: number) => ({
            day: i.dayNumber ?? index + 1,
            title: i.title || `Day ${i.dayNumber ?? index + 1}`,
            description: i.description || "",
            city: i.city || "",
            route: i.route || "",
            altitude: i.altitude || "",
            stay: i.stay || "",
            meals: i.meals || "",
            transport: i.transport || "",
          }))
        : [],
    inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
    exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions : [],
    termsAndConditions: Array.isArray(pkg.termsAndConditions)
      ? pkg.termsAndConditions
      : typeof pkg.termsAndConditions === "string" && pkg.termsAndConditions.trim()
        ? [pkg.termsAndConditions]
        : [],
    route: pkg.route || "",
    departure: pkg.departure || "",
    tourStyle: pkg.tourStyle || "",
    routeBannerTitle: pkg.routeBannerTitle || "",
    routeBannerSubtitle: pkg.routeBannerSubtitle || "",
    trustFeatures: Array.isArray(pkg.trustFeatures) ? pkg.trustFeatures : [],
    conciergeTitle: pkg.conciergeTitle || "",
    conciergeSubtitle: pkg.conciergeSubtitle || "",
    registrationSteps: Array.isArray(pkg.registrationSteps) ? pkg.registrationSteps : [],
    registrationTitle: pkg.registrationTitle || "",
    travelEssentials: Array.isArray(pkg.travelEssentials) ? pkg.travelEssentials : [],
    travelEssentialsTitle: pkg.travelEssentialsTitle || "",
    travelEssentialsSubtitle: pkg.travelEssentialsSubtitle || "",
  };
}

export default function PackageDetail({ initialPackage }: { initialPackage?: any } = {}) {
  const params = useParams<{ id?: string; slug?: string }>();
  const identifier = params?.slug || params?.id;
  const { siteConfig, agent, packages: allPackages } = useAgent();

  const formattedInitial = initialPackage
    ? formatPackageData(initialPackage)
    : identifier && allPackages?.length
    ? formatPackageData(allPackages.find((p: any) => p.slug === identifier || p._id === identifier))
    : null;

  const [packageData, setPackageData] = useState<any>(formattedInitial);
  const [isLoading, setIsLoading] = useState(!formattedInitial);
  const [activeImage, setActiveImage] = useState<string>(formattedInitial?.images?.[0] || "");
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [relatedPackages, setRelatedPackages] = useState<any[]>(() => {
    if (allPackages?.length && identifier) {
      return allPackages.filter((p: any) => p.slug !== identifier && p._id !== identifier).slice(0, 3);
    }
    return [];
  });
  const [selectedRouteDay, setSelectedRouteDay] = useState<number | null>(null);
  const [showInclusions, setShowInclusions] = useState(false);
  const [showExclusions, setShowExclusions] = useState(false);

  // Keep packageData in sync when initialPackage or identifier changes across navigations
  useEffect(() => {
    if (initialPackage) {
      const formatted = formatPackageData(initialPackage);
      setPackageData(formatted);
      setIsLoading(false);
      setActiveImage(formatted?.images?.[0] || "");
      return;
    }

    if (identifier && allPackages?.length) {
      const match = allPackages.find((p: any) => p.slug === identifier || p._id === identifier);
      if (match) {
        const formatted = formatPackageData(match);
        setPackageData(formatted);
        setIsLoading(false);
        setActiveImage(formatted?.images?.[0] || "");
      }
    }
  }, [initialPackage, identifier, allPackages]);

  // Client-side fallback fetch only if data is not available from SSR or context cache
  useEffect(() => {
    if (initialPackage) {
      setIsLoading(false);
      return;
    }
    if (packageData && (packageData.slug === identifier || packageData.id === identifier)) {
      setIsLoading(false);
      return;
    }
    if (identifier && allPackages?.some((p: any) => p.slug === identifier || p._id === identifier)) {
      setIsLoading(false);
      return;
    }
    if (!identifier) return;

    setIsLoading(true);
    fetch(`/api/packages/${identifier}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const formatted = formatPackageData(data.data);
          setPackageData(formatted);
          setActiveImage(formatted?.images?.[0] || "");
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
  }, [identifier, initialPackage, packageData, allPackages]);

  // Sync related packages
  useEffect(() => {
    if (allPackages?.length && identifier) {
      const filtered = allPackages
        .filter((p: any) => p.slug !== identifier && p._id !== identifier)
        .slice(0, 3);
      setRelatedPackages(filtered);
    } else if (identifier) {
      fetch("/api/packages?isActive=true")
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data)) {
            const filtered = resData.data
              .filter((p: any) => p.slug !== identifier && p._id !== identifier)
              .slice(0, 3);
            setRelatedPackages(filtered);
          }
        })
        .catch(() => {});
    }
  }, [identifier, allPackages]);

  // Handle scroll for sticky bar
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft" && packageData?.images?.length) {
        setLightboxIndex((prev) => ((prev ?? 0) - 1 + packageData.images.length) % packageData.images.length);
      }
      if (e.key === "ArrowRight" && packageData?.images?.length) {
        setLightboxIndex((prev) => ((prev ?? 0) + 1) % packageData.images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, packageData?.images]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const nextOpen = !prev[day];
      if (nextOpen) {
        setSelectedRouteDay(day);
      }
      return { ...prev, [day]: nextOpen };
    });
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
    const priceTxt =
      packageData.price && packageData.price > 0
        ? `₹${packageData.price.toLocaleString()} per person`
        : "Price on Request";
    const message = `Hello Shree Ananta Travels! 🌟\nI am interested in booking / getting a quote for:\n"${packageData.title}"\n📍 Location: ${packageData.location}\n⏳ Duration: ${packageData.duration}\n💰 Pricing: ${priceTxt}\n\nPlease share the detailed quote and departure dates.\n\nLink: ${typeof window !== "undefined" ? window.location.href : ""}`;
    window.open(getWhatsAppUrl(phone, message), "_blank");
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
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
          <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 dark:bg-gray-800 rounded w-28" />
            <div className="h-10 bg-slate-200 dark:bg-gray-800 rounded w-3/4 max-w-2xl" />
            <div className="h-5 bg-slate-200 dark:bg-gray-800 rounded w-1/2 max-w-md" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-gray-800 rounded-3xl" />
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[16/9] bg-slate-200 dark:bg-gray-800 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="h-96 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 space-y-5" />
            </div>
          </div>
        </main>
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
            The travel package you are looking for does not exist or has been removed.
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
  const isKailash = packageData.category === "kailash" || packageData.location?.toLowerCase().includes("kailash");
  const isPriceOnRequest = !packageData.price || packageData.price <= 0;
  const currentActiveImage = activeImage || (packageData.images && packageData.images[0]) || "";
  const currentActiveIndex = packageData.images ? Math.max(0, packageData.images.indexOf(currentActiveImage)) : 0;

  // Auto-advance gallery image every 3 seconds (pauses on hover or when lightbox is open)
  useEffect(() => {
    if (
      !packageData?.images ||
      packageData.images.length <= 1 ||
      isGalleryHovered ||
      lightboxIndex !== null
    ) {
      return;
    }

    const timer = setInterval(() => {
      setActiveImage((prev) => {
        const images = packageData.images;
        if (!images || images.length <= 1) return prev;
        const currentIdx = images.indexOf(prev || images[0]);
        const nextIdx = (currentIdx + 1) % images.length;
        return images[nextIdx];
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [packageData?.images, isGalleryHovered, lightboxIndex]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!packageData?.images || packageData.images.length <= 1) return;
    const images = packageData.images;
    const currentIdx = Math.max(0, images.indexOf(currentActiveImage));
    const prevIdx = (currentIdx - 1 + images.length) % images.length;
    setActiveImage(images[prevIdx]);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!packageData?.images || packageData.images.length <= 1) return;
    const images = packageData.images;
    const currentIdx = Math.max(0, images.indexOf(currentActiveImage));
    const nextIdx = (currentIdx + 1) % images.length;
    setActiveImage(images[nextIdx]);
  };

  // Breadcrumb Category name & link
  const categoryLabel =
    packageData.category === "kailash"
      ? "Kailash Mansarovar"
      : packageData.category === "international"
        ? "International Tours"
        : "Domestic Tours";

  const categoryHref =
    packageData.category === "kailash"
      ? "/kailash-mansarovar"
      : packageData.category === "international"
        ? "/international"
        : "/domestic";

  // Dynamic Type & Category Formatting (handles preset & any custom types added via modal)
  const formatPackageType = (type?: string, cat?: string) => {
    if (!type || type === "other") {
      if (cat === "kailash") return "Kailash Mansarovar Yatra";
      if (cat === "international") return "International Tour";
      return "Domestic Tour";
    }

    // Only the 4 standard dashboard dropdown keys need friendly label mappings
    const SYSTEM_TYPE_MAP: Record<string, string> = {
      pilgrimage: "Pilgrimage / Yatra",
      beach: "Beach Holiday",
      mountain: "Mountain Adventure",
      honeymoon: "Honeymoon Special",
    };

    const clean = type.trim();
    const lower = clean.toLowerCase();

    if (SYSTEM_TYPE_MAP[lower]) {
      return SYSTEM_TYPE_MAP[lower];
    }

    // Any other type is manually entered from dashboard modal: format nicely
    return clean
      .replace(/[-_]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const packageTypeLabel = formatPackageType(packageData.packageType, packageData.category);

  // Dynamic route, departure & style highlights
  const displayRoute = packageData.route || (packageData.itinerary?.[0]?.route ? packageData.itinerary[0].route : packageData.location);
  const displayDeparture = packageData.departure || (packageData.category === "kailash" ? "Lucknow / Kathmandu" : "Ex-India / Multiple Cities");
  const displayTourStyle = packageData.tourStyle || packageTypeLabel;
  const displayPricing = packageData.price && packageData.price > 0 ? `₹${packageData.price.toLocaleString()}` : "Price on Request";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans selection:bg-[var(--theme-primary)] selection:text-white">
      <Topbar />
      <Navbar />

      {/* ━━━ Section A: Breadcrumbs & Header Bar ━━━ */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200/80 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <nav className="flex items-center gap-2 text-gray-500 dark:text-gray-400 truncate">
              <Link href="/" className="hover:text-[var(--theme-primary)] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href={categoryHref} className="hover:text-[var(--theme-primary)] transition-colors font-medium">
                {categoryLabel}
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[240px] sm:max-w-md">
                {packageData.title}
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                title="Copy Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Copied!" : "Share"}</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-transform active:scale-95 shadow-md shadow-green-600/20 cursor-pointer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ Section B: Hero Section ━━━ */}
      <div className="bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950 border-b border-slate-200/80 dark:border-gray-800 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200/60 dark:border-amber-800/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {packageTypeLabel}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {packageData.location}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              {packageData.duration}
            </span>

            {packageData.badges?.includes("bestseller") && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
                {packageData.title}
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:opacity-95 hover:scale-[1.02] active:scale-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, var(--theme-primary)))" }}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Get Free Quote</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                <span>Enquire via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ Section C: Photo Gallery (Featured Hero + 4 Widescreen Thumbnails + Booking Card) ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {packageData.images && packageData.images.length > 1 ? (
          <div className="flex flex-col md:flex-row gap-3.5 lg:gap-4 items-stretch">
            {/* Left Column: Featured Main Image (16:9 ratio, ~65% width) */}
            <div className="w-full md:w-[62%] lg:w-[65%] flex flex-col flex-shrink-0">
              <div
                className="w-full aspect-[16/9] relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-slate-950 group cursor-pointer border border-slate-200 dark:border-gray-800"
                onClick={() => setLightboxIndex(currentActiveIndex)}
                onMouseEnter={() => setIsGalleryHovered(true)}
                onMouseLeave={() => setIsGalleryHovered(false)}
              >
                {currentActiveImage ? (
                  <img
                    key={currentActiveImage}
                    src={currentActiveImage}
                    alt={packageData.title}
                    className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-6">
                    <Mountain className="w-16 h-16 text-amber-400 mb-2 opacity-80" />
                    <p className="text-xl font-bold">{packageData.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{packageData.location}</p>
                  </div>
                )}

                {/* Left (Prev) Arrow Button */}
                {packageData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Previous Photo"
                    aria-label="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                )}

                {/* Right (Next) Arrow Button */}
                {packageData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Next Photo"
                    aria-label="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                )}

                {/* Bottom-left Fullscreen Action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(currentActiveIndex);
                  }}
                  className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-slate-950/75 hover:bg-slate-950 backdrop-blur-md text-xs font-semibold border border-white/20 text-white transition-all shadow-md hover:scale-105 cursor-pointer opacity-90 hover:opacity-100"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">View Fullscreen</span>
                </button>

                {/* Bottom-right photo counter */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-xs font-semibold border border-white/20 text-white shadow-md">
                  <span>{currentActiveIndex + 1} / {packageData.images.length}</span>
                </div>
              </div>

              {/* Mobile Thumbnails Row (Visible only on < md) */}
              <div
                className="grid md:hidden grid-cols-4 gap-2 mt-2.5"
                onMouseEnter={() => setIsGalleryHovered(true)}
                onMouseLeave={() => setIsGalleryHovered(false)}
              >
                {packageData.images.slice(0, 4).map((imgUrl: string, idx: number) => {
                  const isSelected = currentActiveImage === imgUrl;
                  const hasMore = idx === 3 && packageData.images.length > 4;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group bg-slate-900 ${
                        isSelected
                          ? "border-2 border-amber-400 ring-2 ring-amber-400/40 shadow-md opacity-100"
                          : "border border-slate-200 dark:border-gray-800 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${packageData.title} photo ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                      {isSelected && !hasMore && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[8px] uppercase tracking-wider shadow">
                          Active
                        </div>
                      )}
                      {hasMore && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(3);
                          }}
                          className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white cursor-pointer z-10"
                        >
                          <span className="font-extrabold text-xs">+{packageData.images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: 4 Widescreen 16:9 Thumbnails + Yatra Inclusions/Booking Card */}
            <div
              className="hidden md:flex md:w-[38%] lg:w-[35%] flex-col gap-3 justify-between min-w-0"
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
            >
              {/* 2x2 Grid: 4 Thumbnails in 16:9 widescreen */}
              <div className="grid grid-cols-2 gap-2.5 flex-shrink-0">
                {packageData.images.slice(0, 4).map((imgUrl: string, idx: number) => {
                  const isSelected = currentActiveImage === imgUrl;
                  const hasMore = idx === 3 && packageData.images.length > 4;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative aspect-[16/9] rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group bg-slate-900 ${
                        isSelected
                          ? "border-2 border-amber-400 ring-2 ring-amber-400/40 shadow-md opacity-100"
                          : "border border-slate-200 dark:border-gray-800 opacity-80 hover:opacity-100 hover:border-amber-300/70"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${packageData.title} photo ${idx + 1}`}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 transition-colors ${
                          isSelected ? "bg-amber-500/10" : "bg-black/10 group-hover:bg-transparent"
                        }`}
                      />
                      {isSelected && !hasMore && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                          Active
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex(idx);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow z-10"
                        title="Enlarge Image"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                      </button>
                      {hasMore && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(3);
                          }}
                          className="absolute inset-0 bg-black/65 hover:bg-black/80 transition-colors flex flex-col items-center justify-center text-white cursor-pointer z-10"
                        >
                          <span className="font-extrabold text-base">+{packageData.images.length - 4}</span>
                          <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">More Photos</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Card: Dynamic Package Highlights & Quick Action */}
              <div className="flex-1 min-h-[140px] bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 dark:from-gray-900 dark:via-gray-900/90 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      {packageData.category === "kailash" ? "Yatra Inclusions" : "Package Inclusions"}
                    </span>
                    {packageData.duration && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                        {packageData.duration}
                      </span>
                    )}
                  </div>

                  {packageData.inclusions && packageData.inclusions.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                      {packageData.inclusions.slice(0, 3).map((inc: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1" title={inc}>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{packageData.location}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>{packageData.duration}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>Curated Guided Tour</span>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-amber-200/60 dark:border-gray-800 flex items-center gap-2.5">
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs text-white shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    style={{ background: "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, var(--theme-primary)))" }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Get Free Quote</span>
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl font-bold text-xs text-white bg-green-600 hover:bg-green-700 shadow-md active:scale-95 transition-all cursor-pointer flex-shrink-0"
                    title="Enquire on WhatsApp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Single Image fallback (if only 1 image exists) */
          <div
            className="w-full aspect-[16/9] max-h-[500px] relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 group cursor-pointer border border-slate-200 dark:border-gray-800"
            onClick={() => setLightboxIndex(0)}
          >
            {packageData.images?.[0] ? (
              <img
                src={packageData.images[0]}
                alt={packageData.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-6">
                <Mountain className="w-16 h-16 text-amber-400 mb-2 opacity-80" />
                <p className="text-xl font-bold">{packageData.title}</p>
                <p className="text-xs text-slate-400 mt-1">{packageData.location}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between pointer-events-none">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  {isKailash ? "Featured Yatra Photograph" : "Featured Tour Photograph"}
                </span>
                <p className="text-2xl font-black">{packageData.title}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold border border-white/20 text-white pointer-events-auto">
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Fullscreen</span>
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ━━━ Section D: Package Highlights Bar ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3.5 p-3 sm:p-5 bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow-md">
          {/* 1. Duration */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider truncate">
                Duration
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-tight break-words line-clamp-2" title={packageData.duration}>
                {packageData.duration}
              </p>
            </div>
          </div>

          {/* 2. Destination */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
              <Mountain className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider truncate">
                Destination
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-tight break-words line-clamp-2" title={packageData.location}>
                {packageData.location}
              </p>
            </div>
          </div>

          {/* 3. Route */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold flex-shrink-0">
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider truncate">
                Route
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-tight break-words line-clamp-2" title={displayRoute}>
                {displayRoute}
              </p>
            </div>
          </div>

          {/* 4. Departure */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider truncate">
                Departure
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-tight break-words line-clamp-2" title={displayDeparture}>
                {displayDeparture}
              </p>
            </div>
          </div>

          {/* 5. Tour Style */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider truncate">
                Tour Style
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-tight break-words line-clamp-2" title={displayTourStyle}>
                {displayTourStyle}
              </p>
            </div>
          </div>

          {/* 6. Pricing Mode */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider truncate">
                Pricing Mode
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-bold text-emerald-600 dark:text-emerald-400 leading-tight break-words line-clamp-2" title={displayPricing}>
                {displayPricing}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Section E: Sticky Navigation Tabs ━━━ */}
      <div className="sticky top-[68px] sm:top-[74px] z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-y border-slate-200 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2.5">
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
              <a href="#overview" className="px-3 py-1.5 rounded-lg hover:text-[var(--theme-primary)] hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                Overview
              </a>
              {packageData.enableRouteMap !== false && (
                <a href="#route-map" className="px-3 py-1.5 rounded-lg hover:text-[var(--theme-primary)] hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                  Route Map
                </a>
              )}
              <a href="#itinerary" className="px-3 py-1.5 rounded-lg hover:text-[var(--theme-primary)] hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                Itinerary ({packageData.itinerary?.length || 0} Days)
              </a>
              <a href="#inclusions" className="px-3 py-1.5 rounded-lg hover:text-[var(--theme-primary)] hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                Inclusions & Exclusions
              </a>
              {packageData.termsAndConditions?.length > 0 && (
                <a href="#terms" className="px-3 py-1.5 rounded-lg hover:text-[var(--theme-primary)] hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                  Terms & Conditions
                </a>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-bold text-gray-500">
                {isPriceOnRequest ? "Price on Request" : `₹${packageData.price?.toLocaleString()}`}
              </span>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 cursor-pointer"
                style={{ background: "var(--theme-primary)" }}
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ Main Content Body Grid ━━━ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols): Content Sections */}
          <div className="lg:col-span-8 space-y-10">
            {/* ━━━ Section F: Overview ━━━ */}
            <section id="overview" className="scroll-mt-20 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-md">
              <div className="flex items-center gap-2.5 mb-4">
                <Compass className="w-6 h-6 text-[var(--theme-primary)]" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Package Overview
                </h2>
              </div>

              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p className={!isDescExpanded && packageData.description?.length > 400 ? "line-clamp-4" : ""}>
                  {packageData.description}
                </p>

                {packageData.description?.length > 400 && (
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="mt-3 text-xs font-bold text-[var(--theme-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isDescExpanded ? "Show Less" : "Read Full Overview..."}
                  </button>
                )}
              </div>

              {/* Curated Route Feature Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{isKailash ? "🕉️" : "✨"}</span>
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      {packageData.routeBannerTitle || (packageData.route ? `${packageData.title} (${packageData.route})` : packageData.title)}
                    </p>
                    <p className="text-amber-700 dark:text-amber-300">
                      {packageData.routeBannerSubtitle || (packageData.route ? `Curated travel route: ${packageData.route} with complete accommodations, transfers & sightseeing.` : `Handcrafted curated itinerary with complete accommodations, transfers & guided sightseeing in ${packageData.location}.`)}
                    </p>
                  </div>
                </div>
                {packageData.duration && (
                  <span className="px-3 py-1 bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 rounded-lg font-bold self-start sm:self-center whitespace-nowrap">
                    {packageData.duration}
                  </span>
                )}
              </div>
            </section>

            {/* ━━━ Section F.2: Interactive Itinerary Route Map ━━━ */}
            <PackageRouteMap
              packageSlug={packageData.slug || identifier || ""}
              packageTitle={packageData.title}
              enableRouteMap={packageData.enableRouteMap}
              itinerary={packageData.itinerary}
              selectedDay={selectedRouteDay}
              onSelectDay={(day) => setSelectedRouteDay(day)}
              onScrollToDay={(day) => {
                const el = document.getElementById(`itinerary-day-${day}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  setExpandedDays((prev) => ({ ...prev, [day]: true }));
                }
              }}
            />

            {/* ━━━ Section G: Complete Itinerary ━━━ */}
            <section id="itinerary" className="scroll-mt-20 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-6 h-6 text-[var(--theme-primary)]" />
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      Complete {packageData.itinerary?.length ? `${packageData.itinerary.length}-Day` : ""} Itinerary
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Day-by-day detailed schedule and sightseeing plan for {packageData.title}.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <button
                    onClick={expandAllDays}
                    className="text-[var(--theme-primary)] hover:underline cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <button
                    onClick={collapseAllDays}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {packageData.itinerary && packageData.itinerary.length > 0 ? (
                  packageData.itinerary.map((item: any) => {
                    const isOpen = !!expandedDays[item.day];
                    return (
                      <div
                        key={item.day}
                        id={`itinerary-day-${item.day}`}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? "border-[var(--theme-primary)]/40 bg-slate-50/60 dark:bg-gray-800/40 shadow-sm"
                            : "border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                        }`}
                      >
                        {/* Day Card Header */}
                        <button
                          onClick={() => toggleDay(item.day)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition-colors ${
                                isOpen
                                  ? "bg-[var(--theme-primary)] text-white shadow-sm"
                                  : "bg-slate-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              Day {item.day}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate">
                                {item.title}
                              </h3>
                              {(item.city || item.route || item.altitude) && (
                                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate flex items-center gap-1.5">
                                  {[
                                    item.city ? `📍 ${item.city}` : "",
                                    item.route ? item.route : "",
                                    item.altitude ? `⛰️ ${item.altitude}` : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" • ")}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 text-gray-400">
                            {packageData.enableRouteMap !== false && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRouteDay(item.day);
                                  const mapEl = document.getElementById("route-map");
                                  if (mapEl) {
                                    mapEl.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }
                                }}
                                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors cursor-pointer"
                                title="Show this day's route on the interactive map"
                              >
                                <Navigation className="w-3 h-3 text-amber-500" />
                                <span>View on Map</span>
                              </button>
                            )}
                            {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--theme-primary)]" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </button>

                        {/* Day Card Body */}
                        {isOpen && (
                          <div className="px-5 pb-5 pt-3 border-t border-slate-200/60 dark:border-gray-800/80 space-y-4">
                            {/* Structured metadata pills if available */}
                            {(item.route || item.altitude || item.stay || item.meals || item.transport) && (
                              <div className="flex flex-wrap gap-2 pt-1 pb-1 text-xs">
                                {item.route && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                    <span>
                                      <strong className="font-semibold text-indigo-900 dark:text-indigo-200">Route:</strong> {item.route}
                                    </span>
                                  </span>
                                )}
                                {item.altitude && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40 font-medium">
                                    <Mountain className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                    <span>
                                      <strong className="font-semibold text-amber-900 dark:text-amber-200">Altitude:</strong> {item.altitude}
                                    </span>
                                  </span>
                                )}
                                {item.stay && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 font-medium">
                                    <Bed className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                    <span>
                                      <strong className="font-semibold text-emerald-900 dark:text-emerald-200">Stay:</strong> {item.stay}
                                    </span>
                                  </span>
                                )}
                                {item.meals && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 font-medium">
                                    <Utensils className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                                    <span>
                                      <strong className="font-semibold text-purple-900 dark:text-purple-200">Meals:</strong> {item.meals}
                                    </span>
                                  </span>
                                )}
                                {item.transport && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 font-medium">
                                    <Bus className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                    <span>
                                      <strong className="font-semibold text-blue-900 dark:text-blue-200">Transport:</strong> {item.transport}
                                    </span>
                                  </span>
                                )}
                              </div>
                            )}
                            {/* Detailed activities bullets */}
                            {(() => {
                              const rawLines = (item.description || "")
                                .split(/\r?\n/)
                                .map((l: string) => l.trim())
                                .filter((l: string) => l.length > 0);

                              if (rawLines.length === 0) {
                                return (
                                  <p className="text-xs text-gray-400 italic">
                                    Activities schedule tailored for group arrival.
                                  </p>
                                );
                              }

                              return (
                                <ul className="space-y-2.5">
                                  {rawLines.map((line: string, idx: number) => {
                                    const cleanText = line.replace(/^([•\-\*]|\d+[\.\)])\s*/, "").trim();
                                    return (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] mt-2 flex-shrink-0" />
                                        <span>{cleanText || line}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400">Itinerary details being updated.</p>
                )}
              </div>
            </section>

            {/* ━━━ Section H: Inclusions and Exclusions ━━━ */}
            <section id="inclusions" className="scroll-mt-20 space-y-4">
              {/* Section Header with Quick Toggle Both */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[var(--theme-primary)] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 text-[var(--theme-primary)]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      Inclusions & Exclusions
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Transparent breakdown of what is covered in your tour package
                    </p>
                  </div>
                </div>

                {((packageData.inclusions?.length || 0) > 0 || (packageData.exclusions?.length || 0) > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      const shouldOpen = !showInclusions || !showExclusions;
                      setShowInclusions(shouldOpen);
                      setShowExclusions(shouldOpen);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {showInclusions && showExclusions ? (
                      <>
                        <span>Collapse Both</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Expand Both</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* 1. Inclusions Card */}
                <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-3xl p-5 sm:p-6 border border-emerald-200/70 dark:border-emerald-900/50 shadow-md transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-200">
                          Package Inclusions
                        </h3>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          {packageData.inclusions?.length || 0} items included
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowInclusions(!showInclusions)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                    >
                      <span>{showInclusions ? "Hide" : `View All (${packageData.inclusions?.length || 0})`}</span>
                      {showInclusions ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Collapsed Preview Hint */}
                  {!showInclusions && (
                    <div
                      onClick={() => setShowInclusions(true)}
                      className="mt-4 p-3 rounded-2xl bg-white/70 dark:bg-gray-800/60 border border-emerald-100 dark:border-emerald-900/30 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="truncate">
                        {packageData.inclusions?.[0]
                          ? `Includes: ${packageData.inclusions[0]}...`
                          : "Click to see all included items"}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-2 flex-shrink-0 flex items-center gap-1">
                        Show <ChevronDown className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}

                  {/* Expanded Inclusions List */}
                  {showInclusions && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40 space-y-2.5">
                      <ul className="space-y-2.5">
                        {packageData.inclusions?.map((inc: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2.5 bg-white/90 dark:bg-gray-800/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200"
                          >
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => setShowInclusions(false)}
                        className="w-full mt-3 py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/80 dark:bg-gray-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Hide Inclusions</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Exclusions Card */}
                <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-3xl p-5 sm:p-6 border border-rose-200/70 dark:border-rose-900/50 shadow-md transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/20 flex-shrink-0">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-rose-900 dark:text-rose-200">
                          Package Exclusions
                        </h3>
                        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">
                          {packageData.exclusions?.length || 0} items not included
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowExclusions(!showExclusions)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                    >
                      <span>{showExclusions ? "Hide" : `View All (${packageData.exclusions?.length || 0})`}</span>
                      {showExclusions ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Collapsed Preview Hint */}
                  {!showExclusions && (
                    <div
                      onClick={() => setShowExclusions(true)}
                      className="mt-4 p-3 rounded-2xl bg-white/70 dark:bg-gray-800/60 border border-rose-100 dark:border-rose-900/30 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="truncate">
                        {packageData.exclusions?.[0]
                          ? `Excludes: ${packageData.exclusions[0]}...`
                          : "Click to see all excluded items"}
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold ml-2 flex-shrink-0 flex items-center gap-1">
                        Show <ChevronDown className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}

                  {/* Expanded Exclusions List */}
                  {showExclusions && (
                    <div className="mt-4 pt-4 border-t border-rose-200/60 dark:border-rose-900/40 space-y-2.5">
                      <ul className="space-y-2.5">
                        {packageData.exclusions?.map((exc: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2.5 bg-white/90 dark:bg-gray-800/80 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200"
                          >
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                              ✕
                            </span>
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => setShowExclusions(false)}
                        className="w-full mt-3 py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-white/80 dark:bg-gray-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Hide Exclusions</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ━━━ Section Terms & Conditions ━━━ */}
            {packageData.termsAndConditions?.length > 0 && (
              <section id="terms" className="scroll-mt-20 bg-slate-50/50 dark:bg-gray-900/50 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-800 shadow-md">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-gray-800 flex items-center justify-center text-xs">
                    📝
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    Terms & Conditions
                  </h3>
                </div>
                <ul className="space-y-3">
                  {packageData.termsAndConditions.map((term: string, index: number) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Concierge Banner */}
            <div
              className="rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{
                background: "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, var(--theme-primary)))",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs uppercase font-extrabold text-white/80 tracking-wider">
                      {packageData.conciergeTitle || (isKailash ? "Dedicated Yatra Concierge" : "Dedicated Tour Concierge")}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold">
                    {isKailash ? "Have Questions About This Yatra?" : "Have Questions About This Tour?"}
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    {packageData.conciergeSubtitle ||
                      (isKailash
                        ? "Speak directly with our senior pilgrimage coordinators for personalized guidance."
                        : "Speak directly with our holiday travel specialists for personalized assistance.")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleWhatsAppShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white font-extrabold text-sm hover:bg-white/90 transition-all shadow-lg active:scale-95 cursor-pointer"
                style={{ color: "#25D366" }}
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column (4 Cols): Sticky Booking Widget */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow-2xl p-6 space-y-6">
              {/* Pricing Box */}
              <div className="bg-slate-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-slate-200/60 dark:border-gray-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Pricing Mode
                  </span>
                  <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Custom Quote
                  </span>
                </div>

                {packageData.price && packageData.price > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[var(--theme-primary)] tracking-tight">
                      ₹{packageData.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">/ person</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-[var(--theme-primary)] tracking-tight">
                      Price on Request
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Get a personalized quote based on your preferred travel date, room sharing tier, and group size.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-4 px-6 rounded-2xl text-white font-extrabold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, var(--theme-primary)))" }}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Get Free Instant Quote</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full py-3.5 px-6 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-white" />
                  <span>Ask on WhatsApp</span>
                </button>
              </div>

              {/* Trust Features */}
              <div className="pt-4 border-t border-slate-200 dark:border-gray-800 space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                {(packageData.trustFeatures && packageData.trustFeatures.length > 0
                  ? packageData.trustFeatures
                  : isKailash
                    ? [
                        "100% Customized Group & Private Yatras",
                        "Complete Visa, Permits & Documentation",
                        "In-House Sherpas, Cooks & Emergency Oxygen",
                      ]
                    : [
                        "100% Handcrafted Verified Itineraries",
                        "Complete Booking, Hotel & Transfer Support",
                        "24x7 Dedicated Ground Support & Assistance",
                      ]
                ).map((feature: string, idx: number) => {
                  const colors = [
                    "bg-emerald-50 dark:bg-emerald-950 text-emerald-600",
                    "bg-blue-50 dark:bg-blue-950 text-blue-600",
                    "bg-amber-50 dark:bg-amber-950 text-amber-600",
                  ];
                  return (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full ${colors[idx % colors.length]} flex items-center justify-center flex-shrink-0 font-bold`}>
                        ✓
                      </div>
                      <span>{feature}</span>
                    </div>
                  );
                })}
              </div>

              {/* Direct Phone Support */}
              <div className="p-4 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Direct Phone Support
                  </p>
                  <a
                    href={getTelHref(phoneNum)}
                    className="text-xs font-black text-gray-900 dark:text-white hover:text-[var(--theme-primary)]"
                  >
                    {getDisplayPhone(phoneNum)}
                  </a>
                </div>
                <a
                  href={getTelHref(phoneNum)}
                  className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm hover:scale-105 transition-transform"
                  aria-label="Call directly"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ Section K: Related Packages ━━━ */}
        {relatedPackages.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
                  {isKailash ? "Explore More Yatras" : "Explore More Tours"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
                  Similar Curated Tour Packages
                </h3>
              </div>
              <Link
                href="/packages"
                className="text-xs font-bold text-[var(--theme-primary)] hover:underline flex items-center gap-1"
              >
                <span>View All Packages</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPackages.map((rel: any) => {
                const relImg = rel.imageUrl1 || rel.imageUrl2 || "/uploads/shree-ananta-logo.jpg";
                const relPrice =
                  rel.discountedPrice && rel.discountedPrice > 0
                    ? `₹${rel.discountedPrice.toLocaleString()}`
                    : rel.originalPrice && rel.originalPrice > 0
                      ? `₹${rel.originalPrice.toLocaleString()}`
                      : "Price on Request";

                return (
                  <div
                    key={rel._id}
                    className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-gray-800 shadow-md hover:shadow-xl transition-all flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                      <img
                        src={relImg}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                        {rel.duration}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {rel.location}
                        </span>
                        <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[var(--theme-primary)] transition-colors line-clamp-2 mt-1">
                          {rel.title}
                        </h4>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400">Starting at</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white">
                            {relPrice}
                          </p>
                        </div>
                        <Link
                          href={`/packages/${rel.slug || rel._id}`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                          style={{ background: "var(--theme-primary)" }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ━━━ Lightbox Modal ━━━ */}
      {lightboxIndex !== null && packageData.images && (
        <div
          className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => ((prev ?? 0) - 1 + packageData.images.length) % packageData.images.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Previous (Arrow Left)"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Current Image */}
          <div
            className="max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={packageData.images[lightboxIndex]}
              alt={`${packageData.title} view ${lightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => ((prev ?? 0) + 1) % packageData.images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Next (Arrow Right)"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Lightbox Caption & Thumbnails */}
          <div
            className="mt-4 flex items-center gap-3 text-xs text-white/80 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <span>
              Image {lightboxIndex + 1} of {packageData.images.length}
            </span>
            <div className="flex items-center gap-2">
              {packageData.images.map((im: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                    lightboxIndex === i ? "border-amber-400 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={im} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ━━━ Mobile Floating Bottom Bar ━━━ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300 ease-out ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-slate-200 dark:border-gray-800 shadow-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-extrabold">
                {packageData.price && packageData.price > 0 ? "Starting at" : "Pricing"}
              </p>
              {packageData.price && packageData.price > 0 ? (
                <p className="text-xl font-black text-[var(--theme-primary)] leading-none">
                  ₹{packageData.price.toLocaleString()}
                  <span className="text-[10px] font-normal text-gray-500 dark:text-gray-400 ml-1">
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
                className="p-3 rounded-xl bg-green-600 text-white shadow-md active:scale-95 cursor-pointer"
                title="Share on WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowQuoteModal(true)}
                className="text-white font-extrabold py-3 px-5 rounded-xl shadow-lg text-xs tracking-wide active:scale-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, var(--theme-primary)))" }}
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
