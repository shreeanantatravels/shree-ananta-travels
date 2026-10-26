"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  ChevronRight,
  Share2,
  Bookmark,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  Compass,
  MapPin,
  List,
  Sparkles,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { PlanTourModal } from '../components/PlanTourModal';
import { type BlogItem } from './BlogListingPage';
import { useAgent } from '../context/AgentContext';
import { getDisplayPhone, getTelHref, getWhatsAppUrl } from '../utils/contactConfig';

function getHeadingText(children: React.ReactNode): string {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  if (React.isValidElement(children) && (children.props as any)?.children) {
    return getHeadingText((children.props as any).children);
  }
  return String(children);
}

export interface BlogDetailArticle extends BlogItem {
  content: string;
  updatedAt?: string;
  tags?: string[];
}

interface BlogDetailPageProps {
  article: BlogDetailArticle;
  relatedArticles: BlogItem[];
}

export default function BlogDetailPage({
  article,
  relatedArticles,
}: BlogDetailPageProps) {
  const [showPlanTourModal, setShowPlanTourModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Parse headings from markdown or HTML content for the Table of Contents
  const tableOfContents = useMemo(() => {
    if (!article.content) return [];
    const items: { id: string; text: string; level: number }[] = [];

    // Check if content has HTML headings: <h2> or <h3>
    const htmlHeadingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let htmlMatch;
    while ((htmlMatch = htmlHeadingRegex.exec(article.content)) !== null) {
      const level = parseInt(htmlMatch[1], 10);
      const rawText = htmlMatch[2].replace(/<[^>]+>/g, '').trim();
      const id = rawText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (rawText) {
        items.push({ id, text: rawText, level });
      }
    }

    if (items.length === 0) {
      // Parse markdown headings ## or ###
      const lines = article.content.split('\n');
      lines.forEach((line) => {
        const match = line.match(/^(#{2,3})\s+(.+)$/);
        if (match) {
          const level = match[1].length; // 2 for h2, 3 for h3
          const rawText = match[2].trim();
          const cleanText = rawText.replace(/^\*+|\*+$/g, '').replace(/^_+|_+$/g, '').trim();
          const id = cleanText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          items.push({ id, text: cleanText, level });
        }
      });
    }

    return items;
  }, [article.content]);

  const handleShareClick = async () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: article.title,
            text: article.excerpt,
            url: window.location.href,
          });
          return;
        } catch {
          // Fall back to clipboard
        }
      }
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const { siteConfig, agent } = useAgent();
  const phone = siteConfig?.contactPhone || agent?.whatsapp || '';
  const displayPhone = getDisplayPhone(phone);
  const telHref = getTelHref(phone);
  const whatsappMsg = `Hi Shree Ananta Travels! I read your article "${article.title}" and would like to plan a tour.`;
  const whatsappUrl = getWhatsAppUrl(phone, whatsappMsg);

  const isUpdated =
    article.updatedAt &&
    new Date(article.updatedAt).getTime() - new Date(article.publishedAt).getTime() > 86400000;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0a1c3d] flex flex-col font-sans selection:bg-[#d4af37]/20">
      <Topbar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* ── Breadcrumb & Article Header ───────────────────────────── */}
        <div className="bg-white border-b border-gray-200/80 pt-8 pb-10">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumbs">
              <ol className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-[#0a1c3d] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-[#0a1c3d] transition-colors">
                    Blogs
                  </Link>
                </li>
                <li>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </li>
                <li>
                  <Link
                    href={`/blogs?category=${article.categorySlug}`}
                    className="hover:text-[#0a1c3d] transition-colors"
                  >
                    {article.category}
                  </Link>
                </li>
                <li>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </li>
                <li className="text-gray-900 font-semibold line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {article.title}
                </li>
              </ol>
            </nav>

            {/* Category badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href={`/blogs?category=${article.categorySlug}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#d4af37]/15 text-[#996515] border border-[#d4af37]/40 hover:bg-[#d4af37]/25 transition-colors"
              >
                {article.category}
              </Link>
              {article.subcategory && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {article.subcategory}
                </span>
              )}
            </div>

            {/* Main Article Title (H1 - Strictly outside image) */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0a1c3d] leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {article.title}
            </h1>

            {/* Excerpt / Lead */}
            {article.excerpt && (
              <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta Row: Author, Publication Date, Read Time, Share */}
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Author attribution */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0a1c3d] to-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {article.author ? article.author.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{article.author}</span>
                    <span className="text-[10px] text-gray-400">Destination Specialist</span>
                  </div>
                </div>

                <span className="text-gray-300 hidden sm:inline">•</span>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {isUpdated && (
                    <span className="text-[10px] text-gray-400">
                      (Updated {new Date(article.updatedAt!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})
                    </span>
                  )}
                </div>

                <span className="text-gray-300 hidden sm:inline">•</span>

                {/* Read time */}
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>

              {/* Share Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareClick}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-[#d4af37]/20 text-gray-700 hover:text-[#0a1c3d] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Large Cover Image (Beneath heading area) ─────────────── */}
        <div className="max-w-5xl mx-auto px-4 -mt-4 pt-8">
          <div className="relative aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-100">
            <img
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          {article.coverImageAlt && (
            <p className="text-[11px] text-gray-400 italic text-center mt-2.5">
              {article.coverImageAlt}
            </p>
          )}
        </div>

        {/* ── Main Content Area: Article & Sidebar ──────────────────── */}
        <div className="max-w-5xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Article Body (8 cols) */}
            <article className="lg:col-span-8 space-y-8">
              {/* Optional Table of Contents for Long Articles */}
              {tableOfContents.length >= 2 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0a1c3d]">
                    <List className="w-4 h-4 text-[#d4af37]" />
                    <span>In This Article (Table of Contents)</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    {tableOfContents.map((item, idx) => (
                      <li
                        key={idx}
                        className={`${item.level === 3 ? 'pl-4' : 'font-semibold'}`}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-gray-600 hover:text-[#b8860b] hover:underline flex items-center gap-1.5 transition-colors"
                        >
                          <span className="text-[#d4af37]">•</span>
                          <span>{item.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rendered Article Body */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-normal">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    table: ({ node, children, ...props }) => (
                      <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full text-left text-sm border-collapse" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ node, children, ...props }) => (
                      <thead className="bg-[#0a1c3d] text-white" {...props}>
                        {children}
                      </thead>
                    ),
                    tbody: ({ node, children, ...props }) => (
                      <tbody className="divide-y divide-gray-100 bg-white text-gray-700" {...props}>
                        {children}
                      </tbody>
                    ),
                    tr: ({ node, children, ...props }) => (
                      <tr className="hover:bg-amber-50/40 transition-colors odd:bg-white even:bg-gray-50/50" {...props}>
                        {children}
                      </tr>
                    ),
                    th: ({ node, children, ...props }) => (
                      <th className="py-3.5 px-4 font-bold border-b border-gray-200 text-xs sm:text-sm tracking-wide text-white" {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ node, children, ...props }) => (
                      <td className="py-3.5 px-4 text-xs sm:text-sm align-top leading-relaxed text-gray-700" {...props}>
                        {children}
                      </td>
                    ),
                    h2: ({ node, children, ...props }) => {
                      const text = getHeadingText(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      return (
                        <h2
                          id={id}
                          className="text-2xl sm:text-3xl font-black text-[#0a1c3d] tracking-tight mt-10 mb-4 pt-4 border-t border-gray-100"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ node, children, ...props }) => {
                      const text = getHeadingText(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      return (
                        <h3
                          id={id}
                          className="text-xl font-bold text-[#0a1c3d] mt-6 mb-3"
                          {...props}
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ node, children, ...props }) => (
                      <p className="text-gray-700 leading-relaxed mb-5 text-[15px] sm:text-base" {...props}>
                        {children}
                      </p>
                    ),
                    blockquote: ({ node, children, ...props }) => (
                      <blockquote
                        className="pl-5 py-3 my-6 border-l-4 border-[#d4af37] bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-r-xl italic text-gray-800 font-medium"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                    strong: ({ node, children, ...props }) => (
                      <strong className="font-extrabold text-gray-900" {...props}>
                        {children}
                      </strong>
                    ),
                    ul: ({ node, children, ...props }) => (
                      <ul className="list-disc pl-6 mb-5 space-y-2 text-gray-700 text-sm sm:text-base" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ node, children, ...props }) => (
                      <ol className="list-decimal pl-6 mb-5 space-y-2.5 text-gray-700 text-sm sm:text-base" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ node, children, ...props }) => (
                      <li className="leading-relaxed pl-1 marker:font-bold marker:text-[#0a1c3d]" {...props}>
                        {children}
                      </li>
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="my-8 border-t-2 border-gray-200" {...props} />
                    ),
                    a: ({ node, href, children, ...props }) => (
                      <Link
                        href={href || '#'}
                        className="text-[#0a1c3d] font-bold underline decoration-[#d4af37] decoration-2 underline-offset-4 hover:text-[#b8860b] transition-colors"
                        {...props}
                      >
                        {children}
                      </Link>
                    ),
                    img: ({ node, src, alt, ...props }) => (
                      <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <img
                          src={src}
                          alt={alt || 'Travel destination'}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                          {...props}
                        />
                        {alt && (
                          <p className="text-xs text-gray-400 italic text-center py-2 bg-gray-50">
                            {alt}
                          </p>
                        )}
                      </div>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-6 border-t border-gray-200/80 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tags:
                  </span>
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-[#d4af37]/15 hover:text-[#996515] transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Internal Booking & Lead CTA Card ─────────────────────── */}
              <div className="bg-gradient-to-br from-[#0a1c3d] via-[#0f2b5c] to-[#040e20] text-white p-8 md:p-10 rounded-3xl border-2 border-[#d4af37]/40 shadow-2xl relative overflow-hidden my-10">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3d375] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plan Your Tour with Shree Ananta Travels</span>
                  </div>

                  <h3
                    className="text-2xl md:text-3xl font-bold text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Inspired by this article? Let our travel specialists design your journey.
                  </h3>

                  <p className="text-sm text-[#f3d375]/90 font-light leading-relaxed max-w-xl">
                    Whether you are planning a sacred pilgrimage to Kailash Mansarovar, a royal holiday in Rajasthan, or an exotic international escape, get transparent quotations and 24/7 dedicated concierge assistance.
                  </p>

                  <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPlanTourModal(true)}
                      className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c59b27] text-[#0a1c3d] font-black rounded-2xl text-xs hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Request a Callback</span>
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-emerald-600/90 border border-white/20 text-white font-bold rounded-2xl text-xs hover:scale-[1.03] transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Right Column: Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Author & Agency Desk Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0a1c3d] text-white flex items-center justify-center font-bold text-base shadow-md">
                    <Compass className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0a1c3d]">Shree Ananta Travels</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Official Editorial Desk</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  India’s premier travel and pilgrimage agency headquartered in East of Kailash, New Delhi. Specialized in Kailash Mansarovar Yatra, domestic holidays, and international tours.
                </p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#b8860b]">
                  <Link href="/about" className="hover:underline flex items-center gap-1">
                    About our agency <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Popular Tour Categories / Quick Links */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Featured Packages &amp; Yatras
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link
                      href="/kailash-mansarovar"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#d4af37]/10 transition-colors group font-semibold text-gray-800"
                    >
                      <span>Kailash Mansarovar Yatra</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#b8860b]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/spiritual"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#d4af37]/10 transition-colors group font-semibold text-gray-800"
                    >
                      <span>Adi Kailash &amp; Char Dham</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#b8860b]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/domestic"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#d4af37]/10 transition-colors group font-semibold text-gray-800"
                    >
                      <span>Domestic Holiday Packages</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#b8860b]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/international"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#d4af37]/10 transition-colors group font-semibold text-gray-800"
                    >
                      <span>International Tours &amp; Visas</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#b8860b]" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Assistance Box */}
              <div className="bg-blue-50/60 p-6 rounded-3xl border border-blue-200/60 text-center space-y-3">
                <Phone className="w-8 h-8 text-[#0a1c3d] mx-auto" />
                <h4 className="text-sm font-bold text-[#0a1c3d]">Need Customized Guidance?</h4>
                <p className="text-xs text-gray-600 font-light">
                  Speak directly with our pilgrimage and holiday specialists.
                </p>
                <a
                  href={telHref}
                  className="block py-2.5 px-4 bg-[#0a1c3d] hover:bg-[#d4af37] text-white hover:text-[#0a1c3d] text-xs font-bold rounded-xl transition-all"
                >
                  Call {displayPhone}
                </a>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Related Articles Section (Editorial 3-column grid) ──── */}
        {relatedArticles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 mt-20 pt-12 border-t border-gray-200/80">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#b8860b]">
                  Recommended Reading
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-black text-[#0a1c3d] mt-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Related Articles &amp; Travel Guides
                </h3>
              </div>
              <Link
                href="/blogs"
                className="text-xs font-bold text-[#0a1c3d] hover:text-[#b8860b] flex items-center gap-1 transition-colors"
              >
                <span>View all articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.slice(0, 3).map((rel) => (
                <article
                  key={rel._id}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-200/80 hover:border-[#d4af37]/60 hover:shadow-xl transition-all duration-300"
                >
                  <Link
                    href={`/blogs/${rel.slug}`}
                    className="relative aspect-[16/9] bg-gray-100 overflow-hidden block"
                  >
                    <img
                      src={rel.coverImage}
                      alt={rel.coverImageAlt || rel.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                        <span className="font-extrabold uppercase tracking-wider text-[#b8860b] text-[11px]">
                          {rel.category}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(rel.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h4
                        className="text-base font-bold text-[#0a1c3d] group-hover:text-[#b8860b] transition-colors leading-snug line-clamp-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        <Link href={`/blogs/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-400 text-[11px]">{rel.author}</span>
                      <Link
                        href={`/blogs/${rel.slug}`}
                        className="font-bold text-[#0a1c3d] group-hover:text-[#b8860b] flex items-center gap-1"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <ChatbotButton />

      <PlanTourModal
        isOpen={showPlanTourModal}
        onClose={() => setShowPlanTourModal(false)}
      />
    </div>
  );
}
