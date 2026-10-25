"use client";
import { useState, useCallback, useEffect } from 'react';
import { PackageCard } from './PackageCard';
import { ChevronLeft, ChevronRight, ArrowUpRight, Mountain } from 'lucide-react';
import Link from 'next/link';
import { useAgent } from '../context/AgentContext';



export function KailashPackages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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
      category: p.packageType || 'Holy Yatra',
      inclusions: p.inclusions,
      exclusions: p.exclusions,
      badges: (p.badges && p.badges.length > 0)
        ? p.badges as Array<'bestseller'>
        : ['bestseller' as const],
      offer: undefined,
    }));

  const displayPackages = apiKailash;

  const visibleCount = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, displayPackages.length - visibleCount);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoPlaying || maxIndex <= 0) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goNext, maxIndex]);

  if (isLoading || displayPackages.length === 0) return null;

  return (
    <section id="kailash" className="py-12 sm:py-16 bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-8 sm:mb-12 gap-4 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-bold uppercase tracking-wider mb-3">
              <Mountain className="w-3.5 h-3.5" />
              <span>Divine Pilgrimage</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Kailash Mansarovar <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--theme-gradient)' }}>Packages</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
              Sacred & hassle-free yatra to Holy Mount Kailash & Mansarovar Lake
            </p>
          </div>
          <Link 
            href="/kailash-mansarovar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--theme-primary)' }}
          >
            View All Kailash Packages <ArrowUpRight size={16} />
          </Link>
        </div>

        <div
          className="relative group px-1 sm:px-0"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {maxIndex > 0 && (
            <button
              onClick={goPrev}
              aria-label="Previous Package"
              className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {maxIndex > 0 && (
            <button
              onClick={goNext}
              aria-label="Next Package"
              className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-[var(--theme-primary)] hover:text-white transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="overflow-hidden mx-8 sm:mx-10">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (isMobile ? 88 : 25)}%)`,
              }}
            >
              {displayPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{
                    width: isMobile ? '88%' : '25%',
                  }}
                >
                  <div className="w-full h-full">
                    <PackageCard {...pkg} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
