"use client";
import { useRef, useState, useEffect } from 'react';
import { PackageCard } from './PackageCard';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useAgent } from '../context/AgentContext';

export function DomesticPackages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { packages: agentPackages, isLoading } = useAgent();

  const apiDomestic = (agentPackages || [])
    .filter(p => p.category === 'domestic')
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
      rating: 4.8,
      reviews: 0,
      category: p.packageType,
      inclusions: p.inclusions,
      exclusions: p.exclusions,
      badges: (p.badges && p.badges.length > 0)
        ? p.badges as Array<'bestseller'>
        : [],
      offer: undefined,
    }));

  const displayPackages = apiDomestic;

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
    <section id="domestic" className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-8 sm:mb-12 gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Domestic <span className="text-[var(--theme-primary)]">Packages</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
              Explore the beauty of India with our specially curated packages
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/domestic"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--theme-primary)' }}
            >
              View All Domestic Tours <ArrowUpRight size={15} />
            </Link>
            {displayPackages.length > 1 && (
              <div className="flex sm:hidden items-center gap-1.5 ml-2">
                <button
                  onClick={() => scroll('left')}
                  aria-label="Previous Domestic Package"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-sm active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  aria-label="Next Domestic Package"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-sm active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
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
              className="hidden sm:flex absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {displayPackages.length > 1 && (
            <button
              onClick={() => scroll('right')}
              aria-label="Next Package"
              className="hidden sm:flex absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
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
