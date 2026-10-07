"use client";
import React, { useState, useEffect } from 'react';
import { useAgent, type AgentPackage } from '../context/AgentContext';
import Link from 'next/link';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { PackageCard } from '../components/PackageCard';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';

/* ── Theme map ─────────────────────────────────────────────────── */
const THEMES: Record<string, { primary: string; gradient: string; accent: string }> = {
  gold:    { primary: '#0f2b5c', gradient: 'linear-gradient(135deg,#0f2b5c 0%,#d4af37 100%)', accent: '#d4af37' },
  navy:    { primary: '#1e3a8a', gradient: 'linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%)', accent: '#3b82f6' },
  red:     { primary: '#be123c', gradient: 'linear-gradient(135deg,#9f1239 0%,#e11d48 100%)', accent: '#f43f5e' },
  cyan:    { primary: '#0e7490', gradient: 'linear-gradient(135deg,#0e7490 0%,#06b6d4 100%)', accent: '#22d3ee' },
  default: { primary: '#0f2b5c', gradient: 'linear-gradient(135deg,#0f2b5c 0%,#d4af37 100%)', accent: '#d4af37' },
};

const ITEMS_PER_PAGE = 16;

/* ── Main Page ───────────────────────────────────────────────────── */
export default function AgentMarketplacePage({ 
  initialCategory, 
  initialSearch 
}: { 
  initialCategory?: 'all' | 'domestic' | 'international' | 'trending';
  initialSearch?: string;
} = {}) {
  const { agent, packages, siteConfig } = useAgent();
  const [filter, setFilter] = useState<'all' | 'domestic' | 'international' | 'trending'>(initialCategory || 'all');
  const [search, setSearch] = useState(initialSearch || '');
  const [currentPage, setCurrentPage] = useState(1);

  const theme = THEMES[agent?.theme || 'default'] || THEMES.default;
  const displayName = siteConfig?.companyName || agent?.businessName || agent?.name || 'Shree Ananta Travels';

  // Read URL search params for category
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const cat = url.searchParams.get('category');
      const q = url.searchParams.get('search');
      if (cat && ['all', 'domestic', 'international', 'trending'].includes(cat) && !initialCategory) {
        setFilter(cat as any);
      }
      if (q && !initialSearch) setSearch(q);
    }
  }, [initialCategory, initialSearch]);

  // Reset to page 1 whenever filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // Helper function for smart package search matching
  const isPackageMatch = (pkg: AgentPackage, queryStr: string) => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return true;

    const loc = (pkg.location || '').toLowerCase().trim();
    const title = (pkg.title || '').toLowerCase().trim();
    const desc = (pkg.description || '').toLowerCase().trim();
    const pkgType = (pkg.packageType || '').toLowerCase().trim();

    // 1. Substring match
    if (title.includes(q) || loc.includes(q) || desc.includes(q) || pkgType.includes(q)) {
      return true;
    }

    // 2. Reverse Match: Query contains package location (e.g. "kailash abcd" contains "kailash")
    if (loc && loc.length >= 3 && q.includes(loc)) {
      return true;
    }

    // 3. Tokenized Word Match: Any word in query matches location, title, or type
    const queryWords = q.split(/\s+/).filter(w => w.length >= 3);
    for (const word of queryWords) {
      if (
        (loc && (loc.includes(word) || word.includes(loc))) ||
        title.includes(word) ||
        pkgType.includes(word)
      ) {
        return true;
      }
    }

    return false;
  };

  // Filter across ALL packages in the entire database
  const filtered = (packages || []).filter(p => {
    const matchCat = filter === 'all' 
      || (filter === 'trending' ? (p.isTrending || p.badges?.includes('trending')) : p.category === filter);
    const matchSearch = isPackageMatch(p, search);
    return matchCat && matchSearch;
  });

  // Count matching packages per category
  const searchMatchedPackages = (packages || []).filter(p => isPackageMatch(p, search));

  const getCategoryCount = (tab: 'all' | 'domestic' | 'international' | 'trending') => {
    if (tab === 'all') return searchMatchedPackages.length;
    if (tab === 'trending') return searchMatchedPackages.filter(p => p.isTrending || p.badges?.includes('trending')).length;
    return searchMatchedPackages.filter(p => p.category === tab).length;
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPackages = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const gridEl = document.getElementById('packages-grid-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-[var(--theme-primary)]/30">
      <Topbar />
      <Navbar />

      <style>{`
        .pkg-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.14) !important; }
        .filter-btn { border: none; cursor: pointer; transition: all 0.2s; font-family: inherit; font-weight: 600; }
        @keyframes text-reveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee-up {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
      `}</style>

      {/* Full-Screen Marquee Hero Section */}
      <section className="relative w-full min-h-[300px] md:min-h-[380px] bg-gray-900 overflow-hidden flex items-center justify-center">
         
         {/* Moving Packages Background Grid */}
         <div className="absolute inset-0 z-0 flex gap-4 p-4 transform scale-[1.05] opacity-75" style={{ transformOrigin: 'center' }}>
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4" style={{ animation: 'marquee-up 45s linear infinite' }}>
               {[...filtered, ...filtered, ...filtered, ...filtered].map((pkg, i) => (
                  <div key={`col1-${i}`} className="w-full rounded-2xl shadow-sm overflow-hidden shrink-0">
                     <img src={pkg.imageUrl1 || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da'} className="w-full h-40 object-cover" alt="" />
                  </div>
               ))}
            </div>
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4" style={{ animation: 'marquee-down 55s linear infinite' }}>
               {[...filtered, ...filtered, ...filtered, ...filtered].reverse().map((pkg, i) => (
                  <div key={`col2-${i}`} className="w-full rounded-2xl shadow-sm overflow-hidden shrink-0">
                     <img src={pkg.imageUrl2 || pkg.imageUrl1 || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da'} className="w-full h-56 object-cover" alt="" />
                  </div>
               ))}
            </div>
            {/* Column 3 (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 flex-col gap-4" style={{ animation: 'marquee-up 50s linear infinite' }}>
               {[...filtered, ...filtered, ...filtered, ...filtered].map((pkg, i) => (
                  <div key={`col3-${i}`} className="w-full rounded-2xl shadow-sm overflow-hidden shrink-0">
                     <img src={pkg.imageUrl2 || pkg.imageUrl1 || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da'} className="w-full h-48 object-cover" alt="" />
                  </div>
               ))}
            </div>
            {/* Column 4 (Hidden on tablet/mobile) */}
            <div className="hidden lg:flex flex-1 flex-col gap-4" style={{ animation: 'marquee-down 65s linear infinite' }}>
               {[...filtered, ...filtered, ...filtered, ...filtered].reverse().map((pkg, i) => (
                  <div key={`col4-${i}`} className="w-full rounded-2xl shadow-sm overflow-hidden shrink-0">
                     <img src={pkg.imageUrl1 || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da'} className="w-full h-64 object-cover" alt="" />
                  </div>
               ))}
            </div>
         </div>

         {/* Dark Gradient Overlay */}
         <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
         <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[1px]"></div>
         
         {/* Foreground Content */}
         <div className="relative z-20 max-w-4xl mx-auto px-4 text-center flex flex-col items-center py-10">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/70 mb-5 hover:text-white hover:-translate-x-1 transition-all text-sm font-semibold uppercase tracking-wider bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-sm backdrop-blur-md" style={{ animation: 'text-reveal 0.6s ease-out forwards' }}>
               <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            
            {(() => {
              const q = search.trim().toLowerCase();
              
              let searchDestination = '';
              if (q) {
                const foundPkg = filtered.find(p => {
                  const loc = (p.location || '').toLowerCase().trim();
                  return loc && loc.length >= 3 && (q.includes(loc) || loc.includes(q));
                });

                if (foundPkg && foundPkg.location) {
                  searchDestination = foundPkg.location.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                } else {
                  const noiseWords = new Set(['package', 'packages', 'tour', 'tours', 'trip', 'trips', 'luxury', 'best', 'deal', 'deals']);
                  const cleanWords = search.trim().split(/\s+/).filter(w => !noiseWords.has(w.toLowerCase()));
                  const targetStr = cleanWords.length > 0 ? cleanWords.join(' ') : search.trim();
                  searchDestination = targetStr.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                }
              }

              const pageTitle = searchDestination
                ? `${searchDestination} Packages`
                : (filter === 'domestic'
                    ? 'Domestic Packages'
                    : filter === 'international'
                      ? 'International Packages'
                      : filter === 'trending'
                        ? 'Trending Packages'
                        : 'Tour Packages');

              const pageSubtitle = searchDestination
                ? `Explore hand-crafted ${searchDestination} tour packages, itineraries, and exclusive travel deals by ${displayName}.`
                : (filter === 'domestic' 
                    ? 'Immerse yourself in rich heritage, diverse cultures, and breathtaking landscapes with our hand-crafted domestic itineraries.' 
                    : filter === 'international' 
                      ? 'Cross borders and experience the extraordinary. From tropical paradises to bustling global metropolis, your adventure awaits.' 
                      : filter === 'trending'
                        ? 'Discover the most popular and highly sought-after travel experiences chosen by thousands of travelers.'
                        : agent?.tagline || `Discover the best travel experiences crafted by ${displayName}`);

              return (
                <>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 sm:mb-4 drop-shadow-lg leading-tight" 
                      style={{ fontFamily: "'Playfair Display', serif", opacity: 0, animation: 'text-reveal 1s ease-out forwards 0.4s' }}>
                    {pageTitle}
                  </h1>
                  
                  <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md" style={{ opacity: 0, animation: 'text-reveal 1.2s ease-out forwards 0.6s' }}>
                    {pageSubtitle}
                  </p>
                </>
              );
            })()}
         </div>
      </section>

      {/* Main Content */}
      <div id="packages-grid-section" className="max-w-7xl mx-auto px-4 py-8 sm:py-14">
        {/* Filters + Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 mb-8">
          {/* Category Tabs (Scrollable on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 bg-slate-200/80 dark:bg-gray-800 rounded-2xl overflow-x-auto scrollbar-none w-full md:w-auto shrink-0 shadow-inner">
            {(['all', 'domestic', 'international', 'trending'] as const).map(tab => {
              const isSelected = filter === tab;
              const count = getCategoryCount(tab);
              return (
                <button
                  key={tab}
                  className={`filter-btn shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md scale-[1.01]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/40'
                  }`}
                  onClick={() => setFilter(tab)}
                >
                  <span className="capitalize">{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isSelected
                        ? 'bg-[var(--theme-primary,#0f2b5c)] text-white'
                        : 'bg-gray-300/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations, tour names..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary,#0f2b5c)] transition-all shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Packages Grid */}
        {filtered.length > 0 ? (
          <>
            <div className={`pkg-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${filtered.length === 1 ? 'justify-items-center' : ''}`}>
              {paginatedPackages.map(pkg => (
                <div key={pkg._id} className={filtered.length === 1 ? 'w-full max-w-[340px] sm:max-w-md mx-auto' : 'w-full'}>
                  <PackageCard
                    id={pkg._id}
                    title={pkg.title}
                    location={pkg.location}
                    price={pkg.discountedPrice && pkg.discountedPrice > 0 ? pkg.discountedPrice : (pkg.originalPrice || 0)}
                    originalPrice={pkg.originalPrice}
                    duration={pkg.duration}
                    imageUrl={pkg.imageUrl1}
                    rating={5}
                    reviews={12}
                    category={pkg.category}
                    badges={pkg.badges as any}
                    inclusions={pkg.inclusions}
                    exclusions={pkg.exclusions}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 font-medium">
                  Showing <span className="font-bold text-gray-800 dark:text-gray-200">{startIndex + 1}</span>–<span className="font-bold text-gray-800 dark:text-gray-200">{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-bold text-gray-800 dark:text-gray-200">{filtered.length}</span> packages
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                      }`}
                      style={currentPage === page ? { background: theme.primary } : {}}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-14 px-4 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm max-w-md mx-auto my-6">
            <div className="text-5xl mb-3">🏝️</div>
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-1">No packages found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              We couldn't find any packages for "{search || filter}". Try clearing your search query or switching category filter.
            </p>
            <button
              onClick={() => { setSearch(''); setFilter('all'); }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              style={{ background: 'var(--theme-gradient, linear-gradient(135deg,#0f2b5c 0%,#d4af37 100%))' }}
            >
              Reset Filters & View All
            </button>
          </div>
        )}
      </div>
      
      <Footer />
      <ChatbotButton />
    </div>
  );
}
