"use client";
import { useRef, useState, useEffect } from 'react';
import { PackageCard } from './PackageCard';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useAgent } from '../context/AgentContext';

export function InternationalPackages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { packages: agentPackages, isLoading } = useAgent();

  const apiIntl = (agentPackages || [])
    .filter(p => p.category === 'international')
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
        : [],
      offer: undefined,
    }));

  const displayPackages = apiIntl;

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
    <section id="international" className="py-12 sm:py-16 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-8 sm:mb-12 gap-4 text-center sm:text-left px-2 sm:px-0">
          <div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
              International <span className="text-[var(--theme-primary)]">Packages</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
              Discover breathtaking destinations around the globe
            </p>
          </div>
          <Link
            href="/international"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--theme-primary)' }}
          >
            View All International Tours <ArrowUpRight size={15} />
          </Link>
        </div>

        <div
          className="relative group flex items-center gap-1.5 sm:gap-3"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={() => setIsAutoPlaying(false)}
          onTouchEnd={() => setIsAutoPlaying(true)}
        >
          {displayPackages.length > 1 && (
            <button
              onClick={() => scroll('left')}
              aria-label="Previous Package"
              className="shrink-0 w-8 h-8 sm:w-11 sm:h-11 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {displayPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="shrink-0 snap-start w-[90%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                >
                  <div className="w-full h-full">
                    <PackageCard {...pkg} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {displayPackages.length > 1 && (
            <button
              onClick={() => scroll('right')}
              aria-label="Next Package"
              className="shrink-0 w-8 h-8 sm:w-11 sm:h-11 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
