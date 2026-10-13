"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  ChevronRight,
  Phone,
  MessageSquare,
  BookOpen,
  Compass,
  MapPin,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Topbar } from "../components/Topbar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatbotButton } from "../components/ChatbotButton";

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  author: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  subcategorySlug?: string;
  publishedAt: string;
  readTime: number;
  isFeatured?: boolean;
  tags?: string[];
}

export interface BlogCategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  publishedCount?: number;
  subcategories?: { name: string; slug: string }[];
}

export interface PopularPackageItem {
  _id: string;
  title: string;
  slug: string;
  imageUrl1?: string;
  duration?: string;
  location?: string;
}

interface BlogListingPageProps {
  initialArticles: BlogItem[];
  popularArticles?: BlogItem[];
  featuredArticle: BlogItem | null;
  categories: BlogCategoryItem[];
  popularPackages?: PopularPackageItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  currentSort?: string;
  currentSearch?: string;
}

export default function BlogListingPage({
  initialArticles,
  popularArticles = [],
  featuredArticle,
  categories,
  popularPackages = [],
  pagination,
  currentSort = "latest",
  currentSearch = "",
}: BlogListingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Fallback popular articles: use provided popularArticles, or slice first 3-4 from initialArticles
  const displayPopular = React.useMemo(() => {
    if (popularArticles && popularArticles.length > 0) return popularArticles;
    return initialArticles.slice(0, 4);
  }, [popularArticles, initialArticles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : "",
    );
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/blogs?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : "",
    );
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/blogs?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : "",
    );
    params.set("page", newPage.toString());
    router.push(`/blogs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      <Topbar />
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ── BREADCRUMB & HERO BANNER ─────────────────────────────── */}
        <section className="bg-gradient-to-b from-[#0a1c3d] via-[#0f2b5c] to-[#0a1c3d] text-white pt-10 pb-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-xs text-amber-300/80 font-medium">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </li>
                <li className="text-white font-semibold">
                  Travel Blogs &amp; Guides
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>The Shree Ananta Travel Journal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                Inspiration, Yatra Guides &amp; Expert Itineraries
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
                Handcrafted destination guides, seasonal tips, and holy
                pilgrimage insights curated by the travel experts at Shree
                Ananta Travels.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 1: MOST POPULAR BLOG & STORIES (TripToTemples Style) ── */}
        {displayPopular.length > 0 &&
          pagination.page === 1 &&
          !currentSearch && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
              <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0a1c3d] tracking-tight flex items-center gap-2">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                      Most Popular Blog
                    </span>{" "}
                    &amp; Stories
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Handpicked spiritual narratives, route guides, and
                    pilgrimage literature
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayPopular.map((post) => (
                  <article
                    key={post._id}
                    className="group bg-white rounded-2xl border border-gray-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 block"
                    >
                      <img
                        src={post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#0a1c3d]/90 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {post.category}
                      </span>
                    </Link>

                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span>{post.readTime} min read</span>
                          <span>•</span>
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "Recent"}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                          <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Brand Amber Gold Read More button on the left */}
                      <div className="pt-2 border-t border-gray-100">
                        <Link
                          href={`/blogs/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 hover:text-amber-700 transition-colors group-hover:translate-x-0.5 duration-200"
                        >
                          <span>Read More</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

        {/* ── SECTION 2: 2-COLUMN MAIN FEED + SIDEBAR CATEGORIES ──── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ── LEFT COLUMN: ARTICLES GRID (8 COLS) ──────────────── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Header with Search and Sort */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0a1c3d] tracking-tight">
                    All Travel Articles &amp; Yatra Guides
                  </h2>
                  <p className="text-xs text-gray-500">
                    Showing {initialArticles.length} of {pagination.totalCount}{" "}
                    articles
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                  {/* Search */}
                  <form
                    onSubmit={handleSearchSubmit}
                    className="relative w-full sm:w-48"
                  >
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                  </form>

                  {/* Sort */}
                  <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer focus:outline-hidden"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Articles Grid */}
              {initialArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {initialArticles.map((article) => {
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
                          <span className="absolute top-3 left-3 px-3 py-1 bg-[#0a1c3d]/90 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                            {article.category}
                          </span>
                        </Link>

                        {/* Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2.5">
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

                            <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                              <Link href={`/blogs/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h3>

                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                              {article.excerpt}
                            </p>
                          </div>

                          {/* Brand Amber Gold Read More button on the left */}
                          <div className="pt-2 border-t border-gray-100">
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
                <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
                  <h3 className="text-base font-bold text-gray-800">
                    No articles found
                  </h3>
                  <p className="text-xs text-gray-500">
                    Try modifying your search query.
                  </p>
                </div>
              )}

              {/* Numbered Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pt-6 flex items-center justify-center gap-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => handlePageChange(pg)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        pg === pagination.page
                          ? "bg-[#0a1c3d] text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: SIDEBAR CATEGORIES & PACKAGES (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Explore by Categories (TripToTemples style) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#0a1c3d] tracking-tight flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    Browse Categories
                  </h3>
                  <span className="text-[11px] text-gray-400 font-semibold">
                    {categories.length} Topics
                  </span>
                </div>

                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/blogs/${cat.slug}`}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/60 transition-all text-xs font-bold text-gray-700 hover:text-amber-600"
                    >
                      <span className="truncate">{cat.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {cat.publishedCount !== undefined &&
                          cat.publishedCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 group-hover:bg-amber-200/70 text-gray-600 group-hover:text-amber-900 font-semibold">
                              {cat.publishedCount}
                            </span>
                          )}
                        <span className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all text-xs">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Card 2: Popular Packages (Trending) */}
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
                              pkg.imageUrl1 || "/uploads/shree-ananta-logo.webp"
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

              {/* Card 3: Direct Assistance / Lead Support */}
              <div className="bg-[#0a1c3d] text-white p-6 rounded-2xl shadow-xl space-y-4 border border-[#1e3a6d]">
                <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Need Pilgrimage Guidance?
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Speak directly with our senior yatra coordinators for Kailash
                  Mansarovar, Adi Kailash &amp; Char Dham customized
                  itineraries.
                </p>
                <div className="space-y-2 pt-1">
                  <a
                    href="tel:+919151007751"
                    className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call: +91 917289037447</span>
                  </a>
                  <a
                    href="https://wa.me/919151007751?text=Hi%20Shree%20Ananta%20Travels,%20I%20have%20an%20enquiry%20regarding%20your%20yatra%20packages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Inquiry</span>
                  </a>
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
