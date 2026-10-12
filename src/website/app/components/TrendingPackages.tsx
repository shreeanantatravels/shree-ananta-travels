// @ts-nocheck
"use client";
import Link from 'next/link';

import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAgent } from '../context/AgentContext';

interface DealItem {
  id: string;
  tag: string;
  headline: string;
  subtitle: string;
  price: number;
  image: string;
}

interface DealCardProps {
  deal: DealItem;
  className?: string;
  height?: string;
}

function DealCard({ deal, className = '', height = 'h-48' }: DealCardProps) {
  const [imgSrc, setImgSrc] = useState(deal.image);
  useEffect(() => { setImgSrc(deal.image); }, [deal.image]);

  return (
    <Link href={`/package/${deal.id}`}
      className={`group relative overflow-hidden rounded-2xl block ${height} ${className}`}
    >
      <img
        src={imgSrc}
        alt={deal.headline}
        onError={() => setImgSrc('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80')}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 group-hover:from-black/85 transition-all duration-300" />

      {/* Tag */}
      <div
        className="absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
        style={{ background: 'var(--theme-gradient)' }}
      >
        {deal.tag}
      </div>

      {/* Arrow */}
      <div
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
        style={{ background: 'var(--theme-primary)' }}
      >
        <ArrowUpRight size={15} />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-bold text-lg leading-tight">{deal.headline}</h3>
        <p className="text-white/75 text-xs mt-0.5">{deal.subtitle}</p>
        <div className="flex items-center gap-3 mt-2.5">
          {deal.price && deal.price > 0 ? (
            <span className="text-white text-sm font-semibold">
              Starting at ₹{deal.price.toLocaleString()}
            </span>
          ) : (
            <span className="text-amber-300 text-sm font-bold">
              Price on Request
            </span>
          )}
          <div className="inline-flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/40 bg-white/15">
            View More <ArrowUpRight size={11} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Top-right auto-cycling carousel ──────────────────────────────────────────
function BentoCarousel({ slides }: { slides: any[] }) {
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (n: number) => setIdx((n + slides.length) % slides.length);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timer.current = setInterval(() => go(idx + 1), 2500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [idx, paused, slides.length]);

  const slide = slides[idx];

  if (!slide) return null;

  return (
    <div
      className="relative h-full rounded-2xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image with crossfade */}
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.image}
          alt={s.headline}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Tag */}
      <div
        className="absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10"
        style={{ background: 'var(--theme-gradient)' }}
      >
        {slide.tag}
      </div>

      {/* Prev / Next */}
      <button
        onClick={() => go(idx - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={() => go(idx + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={14} />
      </button>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-4 z-10">
        <h3 className="text-white font-bold text-xl leading-tight">{slide.headline}</h3>
        <p className="text-white/75 text-xs mt-0.5">{slide.subtitle}</p>
        <div className="flex items-center gap-3 mt-2.5">
          {slide.price && slide.price > 0 ? (
            <span className="text-white text-sm font-semibold">
              Starting at ₹{slide.price.toLocaleString()}
            </span>
          ) : (
            <span className="text-amber-300 text-sm font-bold">
              Price on Request
            </span>
          )}
          <Link href={`/package/${slide.id}`}
            className="inline-flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/40 bg-white/15 hover:bg-white/30 transition-colors"
          >
            View More <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 20 : 8,
              height: 8,
              background: 'white',
              opacity: i === idx ? 1 : 0.4,
            }}
          />
        ))}
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
      tag: 'Trending',
      headline: p.title,
      subtitle: p.location + ' — ' + p.duration,
      price: p.discountedPrice ?? p.originalPrice,
      image: p.imageUrl1 || '',
    }));

  const displayPackages = apiTrending;

  if (isLoading || displayPackages.length === 0) return null;
  const carouselSlides = displayPackages.slice(0, 4);

  return (
    <section id="packages" className="py-16 bg-gray-50 dark:bg-gray-800/40">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--theme-primary)' }}
            >
                         </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Trending{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'var(--theme-gradient)' }}
              >
                Packages
                              </span>
            </h2>
          </div>
          <Link href="/packages"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--theme-primary)' }}
          >
            View All Packages <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* ── CSS Grid ── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${displayPackages.length === 1 ? 'justify-items-center max-w-sm sm:max-w-md mx-auto' : ''}`}>
          {displayPackages.map((deal) => (
            <div key={deal.id} className={`relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${displayPackages.length === 1 ? 'w-full max-w-[340px] sm:max-w-md mx-auto' : ''}`}>
              <DealCard deal={deal} height="aspect-[4/5] w-full" className="!rounded-[2rem]" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
