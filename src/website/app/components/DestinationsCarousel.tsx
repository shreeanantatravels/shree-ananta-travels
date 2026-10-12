"use client";
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAgent } from '../context/AgentContext';



const GAP = 16;

const INTL_KEYWORDS = [
  'dubai', 'maldives', 'bali', 'switzerland', 'thailand', 'singapore', 
  'vietnam', 'turkey', 'paris', 'london', 'malaysia', 'italy', 'greece', 
  'nepal', 'egypt', 'bhutan', 'australia', 'europe'
];

const getFallbackImage = (_name: string): string => '';

interface CarouselSectionProps {
  subtitle: string;
  title: string;
  destinations: Array<{ name: string; image: string }>;
}

function CarouselSection({ subtitle, title, destinations }: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getItemWidth = () => {
    if (!containerRef.current) return 130;
    return (containerRef.current.offsetWidth - GAP * 5) / 6;
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const step = getItemWidth() + GAP;
    scrollRef.current.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' });
  };

  if (destinations.length === 0) return null;

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 mb-12 last:mb-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--theme-primary)' }}>
            {subtitle}
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[var(--theme-primary)] hover:text-white hover:border-transparent transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[var(--theme-primary)] hover:text-white hover:border-transparent transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-2"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {destinations.map((dest, index) => {
          const isKailash = (dest.name || '').toLowerCase().includes('kailash');
          const isIntlDest = INTL_KEYWORDS.some(k => (dest.name || '').toLowerCase().includes(k));
          const catPrefix = isIntlDest ? '/international' : '/domestic';
          const destSlug = encodeURIComponent((dest.name || '').toLowerCase().trim().replace(/\s+/g, '-'));
          const cardHref = isKailash ? '/kailash-mansarovar' : `${catPrefix}/${destSlug}`;
          return (
            <a
              key={index}
              href={cardHref}
              className="flex-shrink-0 group flex flex-col items-center cursor-pointer"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div
                className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 p-1.5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 group-hover:border-[var(--theme-primary)]"
              >
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors" />
                </div>
              </div>
              <span className="mt-3 text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-[var(--theme-primary)] transition-colors text-center">
                {dest.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function DestinationsCarousel() {
  const { packages, siteConfig, isLoading } = useAgent();

  let allDests = (siteConfig?.destinations || []).filter(d => d.active !== false);

  if (allDests.length === 0 && packages && packages.length > 0) {
    const destMap = new Map<string, { name: string; category: 'domestic' | 'international'; image: string; active: boolean; trending: boolean }>();
    packages.forEach(p => {
      if (!p.location) return;
      const loc = p.location.trim();
      const key = loc.toLowerCase();
      if (!destMap.has(key)) {
        destMap.set(key, {
          name: loc,
          category: (p.category === 'international' ? 'international' : 'domestic') as 'domestic' | 'international',
          image: p.imageUrl1 || p.imageUrl2 || getFallbackImage(loc),
          active: true,
          trending: p.isTrending || false,
        });
      }
    });
    allDests = Array.from(destMap.values());
  }

  const isIntl = (d: any) => {
    if (d.category === 'international') return true;
    if (d.category === 'domestic') return false;
    const lower = d.name?.toLowerCase() || '';
    return INTL_KEYWORDS.some(k => lower.includes(k));
  };

  // Domestic destinations filtering
  const domesticRaw = allDests.filter(d => !isIntl(d));
  const domesticTrending = domesticRaw.filter(d => d.trending);
  const finalDomestic = (domesticTrending.length > 0 ? domesticTrending : domesticRaw).map(d => ({
    name: d.name,
    image: d.image || getFallbackImage(d.name)
  }));

  // International destinations filtering
  const intlRaw = allDests.filter(d => isIntl(d));
  const intlTrending = intlRaw.filter(d => d.trending);
  const finalInternational = (intlTrending.length > 0 ? intlTrending : intlRaw).map(d => ({
    name: d.name,
    image: d.image || getFallbackImage(d.name)
  }));

  if (isLoading) return null;

  return (
    <section className="py-14 bg-white dark:bg-gray-900 overflow-hidden">
      <CarouselSection
        subtitle="Explore India"
        title="Top Domestic Destinations"
        destinations={finalDomestic}
      />
      <CarouselSection
        subtitle="Explore The World"
        title="Top International Destinations"
        destinations={finalInternational}
      />
    </section>
  );
}

