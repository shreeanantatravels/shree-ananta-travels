"use client";
import { useRef, useState, useEffect } from 'react';
import { PackageCard } from './PackageCard';
import { ChevronLeft, ChevronRight, ArrowUpRight, Mountain } from 'lucide-react';
import Link from 'next/link';
import { useAgent } from '../context/AgentContext';

export function KailashPackages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { packages: agentPackages, isLoading } = useAgent();

  const apiKailash = (agentPackages || [])
    .filter(p => p.category === 'kailash')
    .map(p => ({
      id: p._id,
      slug: p.slug,
      title: p.title,
      location: p.location,
      price: p.discountedPrice ?? p.originalPrice,
      originalPrice: p.discountedPrice ? p.originalPrice : undefined,
      discount: p.discountedPrice
        ? Math.round(((p.originalPrice - p.discountedPrice) / p.originalPrice) * 100)
        : undefined,
      duration: p.duration,
      imageUrl: p.imageUrl1 || '',
      rating: 4.9,
      reviews: 0,
      category: p.packageType,
      inclusions: p.inclusions,
      exclusions: p.exclusions,
      badges: (p.badges && p.badges.length > 0)
        ? p.badges as Array<'bestseller'>
        : ['bestseller' as const],
      offer: undefined,
    }));

  const displayPackages = apiKailash;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollStep = container.clientWidth * (window.innerWidth < 640 ? 0.9 : 0.75);
    container.scrollBy({
      left: direction === 'right' ? scrollStep : -scrollStep,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!isAutoPlaying || displayPackages.length <= 1) return;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const scrollStep = container.clientWidth * (window.innerWidth < 640 ? 0.9 : 0.75);
        container.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, displayPackages.length]);

  if (isLoading || displayPackages.length === 0) return null;

  return (
    <section id="kailash" className="py-12 sm:py-16 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-8 sm:mb-12 gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Mountain className="w-5 h-5 text-[var(--theme-primary)]" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--theme-primary)]">
                Most Sacred Yatra
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Kailash Mansarovar <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--theme-gradient)' }}>Packages</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
              Sacred &amp; hassle-free yatra to Holy Mount Kailash &amp; Mansarovar Lake
            </p>
          </div>
          <Link
            href="/kailash-mansarovar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--theme-primary)' }}
          >
            View All Kailash Yatras <ArrowUpRight size={15} />
          </Link>
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={() => setIsAutoPlaying(false)}
          onTouchEnd={() => setIsAutoPlaying(true)}
        >
          {displayPackages.length > 1 && (
            <button
              onClick={() => scroll('left')}
              aria-label="Previous Package"
              className="flex absolute left-0 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all border border-gray-200 dark:border-gray-700 cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {displayPackages.length > 1 && (
            <button
              onClick={() => scroll('right')}
              aria-label="Next Package"
              className="flex absolute right-0 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all border border-gray-200 dark:border-gray-700 cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="shrink-0 snap-start w-[88vw] max-w-[360px] sm:w-[calc(50%-12px)] sm:max-w-none lg:w-[calc(25%-18px)]"
              >
                <div className="w-full h-full">
                  <PackageCard {...pkg} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
