"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Phone,
  MessageSquare,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  BookOpen,
  User,
  Mail,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "../components/Topbar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatbotButton } from "../components/ChatbotButton";

export interface CategoryArticleItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  author: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  readTime: number;
}

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  heading?: string;
  description?: string;
}

export interface PopularPackageItem {
  _id: string;
  title: string;
  slug: string;
  imageUrl1?: string;
  duration?: string;
  location?: string;
}

interface CategoryListingPageProps {
  category: CategoryData;
  articles: CategoryArticleItem[];
  popularPackages?: PopularPackageItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function CategoryListingPage({
  category,
  articles,
  popularPackages = [],
  pagination,
}: CategoryListingPageProps) {
  // Read more / less expansion for long category description
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Lead inquiry form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    setIsSubmittingLead(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          phone: leadForm.phone.trim(),
          email: leadForm.email.trim(),
          message:
            leadForm.message.trim() ||
            `Inquiry from ${category.name} Blog Category Page`,
          source: `Category Page: ${category.name}`,
          destination: category.name,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setLeadSuccess(true);
      toast.success("Thank you! Our travel expert will contact you shortly.");
      setLeadForm({ name: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      toast.error("Unable to send enquiry. Please call us directly.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const pageTitle = category.heading?.trim() || `${category.name} Yatra Blogs`;
  const rawDescription = category.description?.trim() || "";
  const isLongDescription = rawDescription.length > 220;
  const displayDescription =
    isLongDescription && !isDescExpanded
      ? `${rawDescription.slice(0, 220)}...`
      : rawDescription;

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      <Topbar />
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ── BREADCRUMBS ────────────────────────────────────────── */}
        <div className="bg-gray-50/70 border-b border-gray-200/60 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium flex-wrap">
              <Link href="/" className="hover:text-amber-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Link
                href="/blogs"
                className="hover:text-amber-600 transition-colors"
              >
                Blogs
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="text-gray-900 font-semibold">
                {category.name}
              </span>
            </nav>
          </div>
        </div>

        {/* ── CATEGORY HERO HEADER (Clean White Header) ─────────── */}
        <section className="bg-white border-b border-gray-100 pt-8 pb-10 sm:pt-12 sm:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Category H1 Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0a1c3d] tracking-tight leading-tight mb-4">
                {pageTitle}
              </h1>

              {/* Descriptive Travel Literature */}
              {rawDescription ? (
                <div className="space-y-3">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                    {displayDescription}
                  </p>

                  {/* Brand Amber Gold Read More button on the left */}
                  {isLongDescription && (
                    <div className="text-left pt-1">
                      <button
                        type="button"
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="inline-flex items-center gap-1.5 text-sm font-extrabold text-amber-600 hover:text-amber-700 cursor-pointer transition-colors"
                      >
                        <span>
                          {isDescExpanded ? "Read Less" : "Read More"}
                        </span>
                        {isDescExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                  Explore verified travel guides, spiritual narratives, route
                  advice, and pilgrimage updates for {category.name} curated by
                  Shree Ananta Travels.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT: 2-COLUMN (ARTICLES + STICKY LEAD FORM) ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ── LEFT COLUMN: ARTICLES (8 COLS) ────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a1c3d] tracking-tight">
                  Registration, Stay and other information about {category.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {articles.length} article
                  {articles.length === 1 ? "" : "s"} in this category
                </p>
              </div>

              {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => {
                    const formattedDate = article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "Recent";

                    return (
                      <article
                        key={article._id}
                        className="group bg-white rounded-2xl border border-gray-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                      >
                        {/* Cover Image */}
                        <Link
                          href={`/blogs/${article.slug}`}
                          className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 block"
                        >
                          <img
                            src={article.coverImage}
                            alt={article.coverImageAlt || article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-3 left-3 px-3 py-1 bg-[#0a1c3d]/90 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                            {article.category || category.name}
                          </span>
                        </Link>

                        {/* Article Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2.5">
                            {/* Meta info: Date & Read Time */}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                {formattedDate}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                {article.readTime} min read
                              </span>
                            </div>

                            {/* Article Title */}
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                              <Link href={`/blogs/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h3>

                            {/* Excerpt */}
                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                              {article.excerpt}
                            </p>
                          </div>

                          {/* Brand Amber Gold Read More button on the left (TripToTemples style) */}
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            <Link
                              href={`/blogs/${article.slug}`}
                              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-amber-600 hover:text-amber-700 transition-colors group-hover:translate-x-0.5 duration-200"
                            >
                              <span>Read More</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Upcoming Guides for {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Our Himalayan travel writers and pilgrimage guides are
                    preparing new articles for {category.name}. Have immediate
                    questions? Send us an inquiry!
                  </p>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: STICKY LEAD CAPTURE FORM (4 COLS) ─ */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Lead Enquiry Card */}
                <div className="bg-[#0a1c3d] rounded-2xl shadow-xl overflow-hidden border border-[#1e3a6d]">
                  {/* Card Header */}
                  <div className="p-5 sm:p-6 pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Reach out to us
                    </h3>
                    <p className="text-xs text-amber-300 font-medium mt-1">
                      Have An Enquiry? Write To Us...
                    </p>
                  </div>

                  {/* Form Body */}
                  <form
                    onSubmit={handleLeadSubmit}
                    className="p-5 sm:p-6 space-y-3.5"
                  >
                    {leadSuccess ? (
                      <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2 text-white">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <h4 className="text-sm font-bold">Enquiry Received!</h4>
                        <p className="text-xs text-emerald-200">
                          Our yatra specialist will connect with you within 30
                          minutes.
                        </p>
                        <button
                          type="button"
                          onClick={() => setLeadSuccess(false)}
                          className="mt-2 text-xs text-amber-300 underline font-semibold hover:text-white"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                            Name <span className="text-amber-400">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              required
                              value={leadForm.name}
                              onChange={(e) =>
                                setLeadForm({
                                  ...leadForm,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Your Full Name"
                              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white/15"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                            Mobile Number{" "}
                            <span className="text-amber-400">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            <input
                              type="tel"
                              required
                              value={leadForm.phone}
                              onChange={(e) =>
                                setLeadForm({
                                  ...leadForm,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="+91 98765 43210"
                              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white/15"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                            Email (Optional)
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            <input
                              type="email"
                              value={leadForm.email}
                              onChange={(e) =>
                                setLeadForm({
                                  ...leadForm,
                                  email: e.target.value,
                                })
                              }
                              placeholder="name@example.com"
                              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white/15"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                            Your Enquiry / Travel Dates
                          </label>
                          <textarea
                            rows={3}
                            value={leadForm.message}
                            onChange={(e) =>
                              setLeadForm({
                                ...leadForm,
                                message: e.target.value,
                              })
                            }
                            placeholder={`Interested in ${category.name} tour package, travel dates, or questions...`}
                            className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white/15 leading-relaxed"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingLead}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          {isSubmittingLead ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 text-gray-900" />
                              <span>Submit Enquiry</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </form>

                  {/* Quick Direct Connect Strip */}
                  <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white">
                    <a
                      href="tel:+919151007751"
                      className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold">+91 917289037447</span>
                    </a>
                    <a
                      href={`https://wa.me/919151007751?text=Hi%20Shree%20Ananta%20Travels,%20I%20am%20interested%20in%20${encodeURIComponent(category.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Popular Packages Card (Trending) */}
                {popularPackages.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <h4 className="text-sm font-extrabold text-[#0a1c3d] tracking-tight flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      Popular Packages
                    </h4>

                    <div className="space-y-3.5 divide-y divide-gray-100">
                      {popularPackages.map((pkg) => (
                        <Link
                          key={pkg._id}
                          href={`/packages/${pkg.slug || pkg._id}`}
                          className="group/pkg flex items-center gap-3 pt-3 first:pt-0"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                            <img
                              src={
                                pkg.imageUrl1 ||
                                "/uploads/shree-ananta-logo.webp"
                              }
                              alt={pkg.title}
                              className="w-full h-full object-cover group-hover/pkg:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-gray-900 group-hover/pkg:text-amber-600 transition-colors line-clamp-2 leading-snug">
                              {pkg.title}
                            </h5>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
                              View Details →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust Badge Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Why Shree Ananta Travels?
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>
                        Government registered & official yatra operator
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>
                        Verified VIP darshan passes & helipad priority
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>24/7 mountain assistance & pure Satvik meals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
}
