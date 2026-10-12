"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface ThemeItem {
  id: string;
  title: string;
  emoji?: string;
  image: string;
  rotateClass: string;
}

const DEFAULT_THEMES: ThemeItem[] = [
  {
    id: 'beach',
    title: 'Beach & Islands',
    emoji: '🏖️',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rotateClass: '-rotate-2 md:translate-y-2',
  },
  {
    id: 'adventure',
    title: 'Adventure & Trekking',
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    rotateClass: 'rotate-2 md:-translate-y-2',
  },
  {
    id: 'heritage',
    title: 'Heritage & Culture',
    emoji: '👑',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    rotateClass: '-rotate-1 md:translate-y-4',
  },
  {
    id: 'pilgrimage',
    title: 'Pilgrimage & Sacred',
    emoji: '🕌',
    image: 'https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?q=80&w=800&auto=format&fit=crop',
    rotateClass: 'rotate-3 md:-translate-y-1',
  },
  {
    id: 'honeymoon',
    title: 'Honeymoon & Romance',
    emoji: '💑',
    image: 'https://images.unsplash.com/photo-1626970356891-a6339d8eece6?fm=jpg&q=60&w=800&auto=format&fit=crop',
    rotateClass: '-rotate-2 md:translate-y-3',
  },
];

const getThemeHref = (theme: ThemeItem) => {
  const t = (theme.title || '').toLowerCase();
  if (t.includes('kailash')) {
    return '/kailash-mansarovar';
  }
  if (t.includes('spiritual') || t.includes('yatra') || t.includes('pilgrim')) {
    return '/spiritual';
  }
  if (t.includes('beach') || t.includes('island')) {
    return '/theme/beach';
  }
  if (t.includes('heritage') || t.includes('culture')) {
    return '/theme/heritage';
  }
  if (t.includes('adventure') || t.includes('trek')) {
    return '/theme/adventure';
  }
  if (t.includes('honeymoon') || t.includes('romance')) {
    return '/theme/honeymoon';
  }
  const slug = (theme.id || theme.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/theme/${slug}`;
};

export function TravelThemes() {
  const [themesList, setThemesList] = useState<ThemeItem[]>(DEFAULT_THEMES);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadThemes = () => {
      fetch('/api/content?sectionType=travel_theme')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data && data.data.length > 0) {
            const activeDbThemes = data.data.filter((s: any) => s.isActive !== false);
            if (activeDbThemes.length > 0) {
              const mapped: ThemeItem[] = activeDbThemes.map((item: any, index: number) => ({
                id: item._id || item.title.toLowerCase().replace(/\s+/g, '-'),
                title: item.title,
                emoji: item.content || '✈️',
                image: item.imageUrl || '',
                rotateClass: DEFAULT_THEMES[index % DEFAULT_THEMES.length]?.rotateClass || '-rotate-2 md:translate-y-2',
              }));
              setThemesList(mapped);
            }
          }
        })
        .catch(() => {});
    };

    loadThemes();
  }, []);

  // Continuous smooth auto-scroll right to left
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || themesList.length === 0) return;

    let animationFrameId: number;
    let isHovered = false;

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    const scrollSpeed = 0.6; // Dheere dheere right to left continuous scroll

    const step = () => {
      if (!isHovered && container) {
        container.scrollLeft += scrollSpeed;
        const singleSetWidth = container.scrollWidth / 3;
        if (singleSetWidth > 0 && container.scrollLeft >= singleSetWidth) {
          container.scrollLeft -= singleSetWidth;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [themesList]);

  const displayThemes = themesList.length > 0
    ? [...themesList, ...themesList, ...themesList]
    : [];

  return (
    <section id="themes" className="py-16 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--theme-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[var(--theme-secondary)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-bold uppercase tracking-wider mb-3 border border-[var(--theme-primary)]/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Explore By Travel Style</span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Curated{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'var(--theme-gradient)' }}
            >
              Holiday Themes
            </span>
          </h2>
        </div>

        {/* Showcase Cards Container */}
        {themesList.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500 font-medium">
            No active travel themes found. Please activate themes in the Admin Portal.
          </div>
        ) : (
          <div className="relative group/carousel max-w-7xl mx-auto px-1">

            {/* Scroll Navigation Arrows */}
            <button
              onClick={() => scroll('left')}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white shadow-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-white hover:scale-110 transition-all cursor-pointer backdrop-blur-md"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white shadow-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-white hover:scale-110 transition-all cursor-pointer backdrop-blur-md"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Horizontal Scrollable Row */}
            <div
              ref={scrollRef}
              className="flex gap-5 py-4 overflow-x-auto no-scrollbar justify-start"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayThemes.map((theme, index) => (
                <Link key={`${theme.id}-${index}`} href={getThemeHref(theme)}
                  className={`group relative rounded-2xl overflow-hidden border border-white/30 dark:border-gray-800 bg-gray-950 shadow-lg hover:shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-108 hover:z-20 flex flex-col justify-between p-4.5 h-[260px] w-[220px] shrink-0 cursor-pointer ${theme.rotateClass}`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    {theme.image ? (
                      <img
                        src={theme.image}
                        alt={theme.title}
                        className="w-full h-full object-cover transform group-hover:scale-115 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-5xl opacity-30">{theme.emoji}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/20 group-hover:from-gray-950/90 transition-colors duration-500" />
                  </div>

                  {/* Top Badge - Emoji / Category */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 shadow-xs flex items-center gap-1">
                      <span>{theme.emoji || '✈️'}</span>
                      <span>Theme</span>
                    </span>
                  </div>

                  {/* Bottom Details */}
                  <div className="relative z-10 mt-auto">
                    <h3 className="text-base font-bold text-white group-hover:text-[var(--theme-primary)] transition-colors duration-300 flex items-center justify-between">
                      <span>{theme.title}</span>
                      <ArrowUpRight className="w-4.5 h-4.5 text-white/80 group-hover:text-[var(--theme-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </h3>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
                      <span className="text-[11px] text-gray-300 font-medium">Explore Packages</span>
                      <span className="text-[10px] font-bold text-white bg-[var(--theme-primary)] group-hover:bg-[var(--theme-secondary)] px-2.5 py-1 rounded-lg transition-colors duration-300 shadow-xs">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
