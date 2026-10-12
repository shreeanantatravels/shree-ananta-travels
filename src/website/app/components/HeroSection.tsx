"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAgent } from '../context/AgentContext';

export function HeroSection() {
  const router = useRouter();
  const { themeConfig, layoutVariant } = useTheme();
  const { agent, packages, siteConfig, isLoading } = useAgent();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const displayName = siteConfig?.companyName || agent?.businessName || agent?.name || 'Shree Ananta Travels';
  const taglineText = agent?.tagline || 'Journeys That Connect';

  // Dynamic Badge, Title, Subtitle with luxury fallbacks
  const badgeText = siteConfig?.heroBadge?.trim() || `${displayName} • ${taglineText}`;
  const heroHeading = siteConfig?.heroTitle?.trim() || 'Tour Packages for India and Abroad';
  const heroSubtitle = siteConfig?.heroSubtitle?.trim() || 'Customized tour packages across India and abroad, plus Kailash Mansarovar and other yatras. Share your plan and get a quote within 2 hours.';

  const images = useMemo(() => {
    if (siteConfig?.heroImages && siteConfig.heroImages.length > 0) {
      return siteConfig.heroImages;
    }
    if (isLoading) return ['/uploads/banners/isloarding.png'];
    if (themeConfig?.heroImages?.length) return themeConfig.heroImages;
    return ['/uploads/banners/isloarding.png'];
  }, [siteConfig?.heroImages, isLoading, themeConfig?.heroImages]);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Typewriter Animated Placeholder Effect ──────────────────────── */
  const SEARCH_PHRASES = useMemo(() => [
    "Search 'Kashmir Packages'...",
    "Search 'Maldives Water Villas'...",
    "Search 'Dubai Luxury Tour'...",
    "Search 'Kailash Mansarovar Yatra'...",
    "Search 'Goa Beach Resort'...",
    "Search 'Kerala Backwaters'...",
    "Search 'Switzerland Alps'...",
    "Search destinations, holiday packages..."
  ], []);

  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = SEARCH_PHRASES[phraseIndex];
    let speed = isDeleting ? 35 : 70;

    if (!isDeleting && animatedPlaceholder === currentPhrase) {
      speed = 2200;
    } else if (isDeleting && animatedPlaceholder === '') {
      speed = 300;
    }

    const timer = setTimeout(() => {
      if (isDeleting && animatedPlaceholder === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % SEARCH_PHRASES.length);
      } else if (!isDeleting && animatedPlaceholder !== currentPhrase) {
        setAnimatedPlaceholder(currentPhrase.slice(0, animatedPlaceholder.length + 1));
      } else if (isDeleting && animatedPlaceholder !== '') {
        setAnimatedPlaceholder(currentPhrase.slice(0, animatedPlaceholder.length - 1));
      } else if (!isDeleting && animatedPlaceholder === currentPhrase) {
        setIsDeleting(true);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [animatedPlaceholder, isDeleting, phraseIndex, SEARCH_PHRASES]);

  /* ── Compute Autocomplete Suggestions ────────────────────────────── */
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: { type: 'destination' | 'package'; title: string; subtitle?: string; url: string; image?: string }[] = [];
    const seenLocations = new Set<string>();

    // 1. Matching package locations
    (packages || []).forEach(pkg => {
      if (!pkg.location) return;
      const loc = pkg.location.trim();
      const locLower = loc.toLowerCase();
      if (locLower.includes(q) && !seenLocations.has(locLower)) {
        seenLocations.add(locLower);
        results.push({
          type: 'destination',
          title: loc,
          subtitle: `${pkg.category || 'Tour'} Destination`,
          url: `/packages?search=${encodeURIComponent(loc)}`,
          image: pkg.imageUrl1,
        });
      }
    });

    // 2. Matching siteConfig destinations
    (siteConfig?.destinations || []).forEach(d => {
      if (!d.active) return;
      const loc = d.name.trim();
      const locLower = loc.toLowerCase();
      if (locLower.includes(q) && !seenLocations.has(locLower)) {
        seenLocations.add(locLower);
        results.push({
          type: 'destination',
          title: loc,
          subtitle: `${d.category || 'Featured'} Destination`,
          url: `/packages?search=${encodeURIComponent(loc)}`,
          image: d.image,
        });
      }
    });

    // 3. Matching package titles
    (packages || []).forEach(pkg => {
      if (!pkg.title) return;
      if (pkg.title.toLowerCase().includes(q) && results.length < 8) {
        results.push({
          type: 'package',
          title: pkg.title,
          subtitle: `${pkg.location} • ${pkg.duration}`,
          url: `/package/${pkg._id}`,
          image: pkg.imageUrl1,
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, packages, siteConfig]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/packages');
    }
  };

  /* ── Suggestions Dropdown JSX ────────────────────────────────────── */
  const renderSuggestionsDropdown = () => {
    if (!showSuggestions || suggestions.length === 0) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-gray-200 dark:border-gray-800 overflow-hidden z-[999] divide-y divide-gray-100 dark:divide-gray-800 text-left">
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center justify-between">
          <span>Search Suggestions</span>
          <span>{suggestions.length} results</span>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setShowSuggestions(false);
                setSearchQuery(item.title);
                router.push(item.url);
              }}
              className="flex items-center gap-3.5 px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-gray-800/80 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                {item.image ? (
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm">{item.type === 'destination' ? '📍' : '✈️'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
                  <span>{item.title}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    item.type === 'destination' 
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' 
                      : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {item.type}
                  </span>
                </div>
                {item.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const popularPlaces = ['Kashmir', 'Maldives', 'Dubai', 'Goa', 'Switzerland', 'Kerala'];

  const renderPopularPlaces = (isDark = false) => (
    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 px-1">
      <span className={`text-[11px] font-semibold ${isDark ? 'text-[#f3d375]/90' : 'text-gray-500 dark:text-gray-400'}`}>
        Popular Places:
      </span>
      {popularPlaces.map((tag) => (
        <Link
          key={tag}
          href={`/packages?search=${encodeURIComponent(tag)}`}
          onClick={() => setShowSuggestions(false)}
          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all border ${
            isDark
              ? 'bg-[#d4af37]/15 hover:bg-[#d4af37]/35 border-[#d4af37]/40 text-white'
              : 'bg-gray-100/90 dark:bg-gray-800/90 hover:bg-[var(--theme-primary)] hover:text-white border-gray-200/80 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-2xs'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );

  const isRoyal = layoutVariant === 'royal-gold';

  return (
    <div className="relative z-30 w-full bg-gray-50 dark:bg-gray-900 pb-16 sm:pb-20 lg:pb-24">
      {/* ── Banner Image Slider Container ────────────────────────────── */}
      <section className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[460px] overflow-hidden bg-gray-900">
        <div className="relative w-full h-full overflow-hidden">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Hero Banner ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                index === currentImageIndex
                  ? 'opacity-100 z-10'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            />
          ))}
          {/* Subtle gradient vignette at bottom for seamless card blending */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-gray-950/75 via-gray-950/20 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Elevated Hero Card: Title, Description, Search & Destinations in One Cohesive Unit ── */}
      <div className="relative z-40 max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 md:-mt-32">
        <div
          className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 text-center transition-all ${
            isRoyal
              ? 'bg-[#0a1c3d]/95 dark:bg-black/90 border-2 border-[#d4af37]/50 shadow-2xl shadow-[#0a1c3d]/80'
              : 'bg-white/95 dark:bg-gray-900/95 border border-gray-100 dark:border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.14)]'
          }`}
        >
          {/* Trust / Brand Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3.5 border shadow-2xs ${
              isRoyal
                ? 'bg-[#d4af37]/15 text-[#f3d375] border-[#d4af37]/40'
                : 'bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border-[var(--theme-primary)]/20'
            }`}
          >
            <span>{badgeText}</span>
          </div>

          {/* Primary Page Heading (H1) for SEO */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heroHeading === 'Tour Packages for India and Abroad' ? (
              <>
                Tour Packages for{' '}
                <span
                  className={
                    isRoyal
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3d375] to-[#c59b27]'
                      : 'text-transparent bg-clip-text'
                  }
                  style={isRoyal ? undefined : { backgroundImage: 'var(--theme-gradient)' }}
                >
                  India and Abroad
                </span>
              </>
            ) : (
              heroHeading
            )}
          </h1>

          {/* Supporting Description */}
          <p
            className={`mt-3 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${
              isRoyal ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {heroSubtitle}
          </p>

          {/* Integrated Search Box */}
          <div ref={searchRef} className="relative mt-6 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className={`rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border transition-all ${
                isRoyal
                  ? 'bg-white/10 dark:bg-white/5 border-[#d4af37]/40 focus-within:border-[#d4af37] shadow-inner'
                  : 'bg-gray-50/90 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 focus-within:border-[var(--theme-primary)] focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/20 shadow-inner'
              }`}
            >
              <div className="flex flex-row items-center gap-1.5 sm:gap-2">
                <div className="flex-1 flex items-center px-2.5 sm:px-3 py-1">
                  <Search
                    className={`w-4 h-4 sm:w-5 sm:h-5 mr-2.5 flex-shrink-0 ${
                      isRoyal ? 'text-[#f3d375]' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder={animatedPlaceholder || (isRoyal ? 'Search luxury holiday packages...' : 'Search destinations, holiday packages...')}
                    className={`w-full bg-transparent outline-none text-xs sm:text-sm font-medium ${
                      isRoyal
                        ? 'text-white placeholder-[#f3d375]/70'
                        : 'text-gray-900 dark:text-white placeholder-gray-400'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className={`font-extrabold px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-wider flex-shrink-0 ${
                    isRoyal
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c59b27] text-[#0a1c3d] hover:shadow-[#d4af37]/40'
                      : 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white hover:shadow-lg'
                  }`}
                >
                  {isRoyal ? 'Explore' : 'Search'}
                </button>
              </div>
            </form>
            {renderSuggestionsDropdown()}
          </div>

          {/* Popular Places Quick Tags */}
          <div className="mt-4">
            {renderPopularPlaces(isRoyal)}
          </div>
        </div>
      </div>
    </div>
  );
}
