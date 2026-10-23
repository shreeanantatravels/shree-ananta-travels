// @ts-nocheck
"use client";
import Link from 'next/link';
import { ArrowUpRight, MapPin, Clock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAgent } from '../context/AgentContext';

interface DealItem {
  id: string;
  slug?: string;
  tag: string;
  headline: string;
  location?: string;
  duration?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
}

interface DealCardProps {
  deal: DealItem;
  className?: string;
}

function DealCard({ deal, className = '' }: DealCardProps) {
  const [imgSrc, setImgSrc] = useState(deal.image);
  useEffect(() => { setImgSrc(deal.image); }, [deal.image]);

  const packageHref = `/packages/${deal.slug || deal.id}`;

  return (
    <div
      className={`group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 h-full ${className}`}
    >
      {/* ── Image Section (Clean, Unobstructed Photo) ── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 shrink-0">
        <Link
          href={packageHref}
          aria-label={`View ${deal.headline} tour package`}
          className="block w-full h-full relative overflow-hidden"
        >
          <img
            src={imgSrc}
            alt={deal.headline}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80')}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <span className="sr-only">{deal.headline}</span>
        </Link>

        {/* Tag (Top-Left) */}
        <div
          className="absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10 pointer-events-none"
          style={{ background: 'var(--theme-gradient)' }}
        >
          {deal.tag || 'Trending'}
        </div>

        {/* Duration Badge (Top-Right) */}
        {deal.duration && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm pointer-events-none border border-white/10">
            <Clock size={11} className="text-amber-400" />
            <span>{deal.duration}</span>
          </div>
        )}
      </div>

      {/* ── Content Section (Cleanly Separated Below Photo) ── */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          {deal.location && (
            <div
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--theme-primary)' }}
            >
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{deal.location}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[var(--theme-primary)] transition-colors mb-2">
            <Link href={packageHref} className="hover:underline">
              {deal.headline}
            </Link>
          </h3>

          {/* Rating / Social Proof */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center text-amber-500">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-gray-800 dark:text-gray-200">4.9</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>Curated Package</span>
          </div>
        </div>

        {/* ── Footer: Price & CTA ── */}
        <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 block font-medium">Starting from</span>
            <div className="flex items-baseline gap-1.5">
              {deal.price && deal.price > 0 ? (
                <>
                  <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    ₹{deal.price.toLocaleString('en-IN')}
                  </span>
                  {deal.originalPrice && deal.originalPrice > deal.price && (
                    <span className="text-[11px] text-gray-400 line-through">
                      ₹{deal.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
                  Price on Request
                </span>
              )}
            </div>
          </div>

          <Link
            href={packageHref}
            aria-label={`View itinerary for ${deal.headline}`}
            className="inline-flex items-center gap-1 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 shrink-0"
            style={{ background: 'var(--theme-gradient)' }}
          >
            <span>View Itinerary</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function TrendingPackages() {
  const { packages: agentPackages, isLoading } = useAgent();

  const apiTrending = (agentPackages || [])
    .filter(p => p.isTrending)
    .map(p => ({
      id: p._id,
      slug: p.slug,
      tag: 'Trending',
      headline: p.title,
      location: p.location,
      duration: p.duration,
      price: p.discountedPrice ?? p.originalPrice,
      originalPrice: p.discountedPrice ? p.originalPrice : undefined,
      discount: p.discountedPrice
        ? Math.round(((p.originalPrice - p.discountedPrice) / p.originalPrice) * 100)
        : undefined,
      image: p.imageUrl1 || '',
    }));

  const displayPackages = apiTrending;

  if (isLoading || displayPackages.length === 0) return null;

  return (
    <section id="packages" className="py-16 bg-gray-50 dark:bg-gray-800/40">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--theme-primary)' }}
            >
              Curated Itineraries &amp; Holy Yatras
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Tour Packages for{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'var(--theme-gradient)' }}
              >
                Domestic and International
              </span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Customized tour packages across domestic and international destinations, plus Kailash Mansarovar and other yatras. Share your plan and get a quote within 2 hours.
            </p>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80 flex-shrink-0"
            style={{ color: 'var(--theme-primary)' }}
          >
            View All Packages <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* ── CSS Grid ── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${displayPackages.length === 1 ? 'justify-items-center max-w-sm sm:max-w-md mx-auto' : ''}`}>
          {displayPackages.map((deal) => (
            <div key={deal.id} className="h-full">
              <DealCard deal={deal} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
