"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, MapPin } from 'lucide-react';
import { useAgent, type AgentPackage } from '../context/AgentContext';
import { PlanTourModal } from './PlanTourModal';
import logoAsset from "../../assets/tgt-logo.png";
import { toDestinationSlug } from '@/lib/utils/slugify';

function formatLogoUrl(url: any): string {
  if (!url) return '';
  if (typeof url === 'object' && url.src) return url.src;
  if (typeof url === 'string') {
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
    return `/uploads/${url}`;
  }
  return '';
}

const DEFAULT_DOMESTIC_FALLBACKS = [
  'Kashmir', 'Kerala', 'Goa', 'Rajasthan', 'Manali & Himachal', 
  'Ladakh', 'Golden Triangle', 'Andaman & Nicobar', 'Varanasi', 'Shimla'
];

const DEFAULT_INTL_FALLBACKS = [
  'Vietnam', 'Dubai', 'Maldives', 'Turkey', 'Singapore', 'Switzerland',
  'Thailand', 'Paris', 'Bali', 'London', 'Malaysia', 'Italy',
  'Sri Lanka', 'Greece', 'Nepal', 'Egypt', 'Bhutan', 'Australia'
];

const DEFAULT_NAV_LINKS = [
  { id: 'kailash', label: 'Kailash Mansarovar', url: '/kailash-mansarovar', isActive: true, canDelete: false, order: 1 },
  { id: 'domestic', label: 'Domestic', url: '/domestic', isDropdown: true, category: 'domestic', isActive: true, canDelete: false, order: 2 },
  { id: 'international', label: 'International', url: '/international', isDropdown: true, category: 'international', isActive: true, canDelete: false, order: 3 },
  { id: 'groups', label: 'Groups', url: '/packages?category=groups', isActive: true, canDelete: false, order: 4 },
  { id: 'spiritual', label: 'Spiritual', url: '/spiritual', isActive: true, canDelete: false, order: 5 },
  { id: 'services', label: 'Services', url: '/services', isActive: true, canDelete: false, order: 6 },
  { id: 'trending', label: 'Trending', url: '/trending', isActive: true, canDelete: false, order: 7 },
  { id: 'contact', label: 'Contact', url: '/contact', isActive: true, canDelete: false, order: 8 },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlanTourModal, setShowPlanTourModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { agent, packages, siteConfig } = useAgent();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayName = siteConfig?.companyName || (siteConfig as any)?.businessName || (agent ? (agent.businessName || agent.name) : 'Shree Ananta Travels');
  const rawLogo = siteConfig?.logoUrl || agent?.logo || '/uploads/shree-ananta-logo.webp';
  const logoUrl = formatLogoUrl(rawLogo) || formatLogoUrl(logoAsset);

  const rawNavLinks = (siteConfig?.navLinks && siteConfig.navLinks.length > 0)
    ? siteConfig.navLinks
    : DEFAULT_NAV_LINKS;

  const seenNavKeys = new Set<string>();
  const displayNavLinks = rawNavLinks
    .filter((link: any) => link.isActive !== false && link.url !== '/blogs' && link.id !== 'blogs')
    .map((link: any) => {
      if (link.id === 'kailash') {
        return { ...link, url: '/kailash-mansarovar' };
      }
      if (link.id === 'trending' || link.url === '/packages?category=trending') {
        return { ...link, url: '/trending' };
      }
      if (link.id === 'spiritual' || link.url === '/packages?category=spiritual') {
        return { ...link, url: '/spiritual' };
      }
      return link;
    })
    .filter((link: any) => {
      const key = `${(link.label || '').toLowerCase().trim()}|${(link.url || '').toLowerCase().trim()}`;
      if (seenNavKeys.has(key)) return false;
      seenNavKeys.add(key);
      return true;
    })
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  /* ── Dynamically compute active domestic and international destinations ── */
  const { domesticDestinations, internationalDestinations } = useMemo(() => {
    const domSet = new Set<string>();
    const intlSet = new Set<string>();

    // 1. From packages
    (packages || []).forEach((pkg: AgentPackage) => {
      if (!pkg.location) return;
      const name = pkg.location.trim();
      if (!name) return;
      if (pkg.category === 'international') {
        intlSet.add(name);
      } else {
        domSet.add(name);
      }
    });

    // 2. From siteConfig
    if (siteConfig?.destinations) {
      siteConfig.destinations.forEach((d: any) => {
        if (d.active === false) return;
        const name = d.name.trim();
        if (!name) return;
        if (d.category === 'international') {
          intlSet.add(name);
        } else {
          domSet.add(name);
        }
      });
    }

    // Add fallbacks if sets are empty
    if (domSet.size === 0) DEFAULT_DOMESTIC_FALLBACKS.forEach(d => domSet.add(d));
    if (intlSet.size === 0) DEFAULT_INTL_FALLBACKS.forEach(d => intlSet.add(d));

    return {
      domesticDestinations: Array.from(domSet).map(name => ({ name })),
      internationalDestinations: Array.from(intlSet).map(name => ({ name })),
    };
  }, [packages, siteConfig]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'pt-2 sm:pt-4 px-3 sm:px-6' 
        : 'pt-0 px-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800'
    }`}>
      <nav aria-label="Main Navigation" className={`mx-auto transition-all duration-300 ${
        isScrolled 
          ? `max-w-[1600px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 px-4 sm:px-6 py-2.5 sm:py-3 ${
              isOpen ? 'rounded-2xl sm:rounded-3xl' : 'rounded-full'
            }` 
          : 'max-w-[1600px] w-full px-4 sm:px-8 py-3.5 sm:py-4'
      }`}>
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 overflow-hidden bg-white flex-shrink-0" style={{ border: '2.5px solid var(--theme-primary)', boxShadow: '0 0 0 4px color-mix(in srgb, var(--theme-primary) 15%, transparent)' }}>
              <img 
                src={logoUrl} 
                alt={displayName} 
                width={48} 
                height={48} 
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-gray-900 dark:text-white text-lg sm:text-xl tracking-tight leading-tight group-hover:text-[var(--theme-primary)] transition-colors">
                {displayName}
              </span>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:block">
                Journeys That Connect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 bg-gray-100/60 dark:bg-gray-800/60 p-1.5 rounded-full border border-gray-200/40 dark:border-gray-700/40 backdrop-blur-sm flex-nowrap relative">
            {displayNavLinks.map((link: any) => {
              const isDom = link.id === 'domestic' || link.category === 'domestic' || link.label?.toLowerCase() === 'domestic';
              const isIntl = link.id === 'international' || link.category === 'international' || link.label?.toLowerCase() === 'international';
              const isDropdown = link.isDropdown || isDom || isIntl;

              if (isDropdown) {
                const dropCategory = (isIntl || link.category === 'international') ? 'international' : 'domestic';
                const dropDestinations = dropCategory === 'domestic' ? domesticDestinations : internationalDestinations;
                const pageUrl = link.url || (dropCategory === 'domestic' ? '/domestic' : '/international');

                return (
                  <div 
                    key={link.id} 
                    className="relative group py-1"
                    onMouseEnter={() => setActiveDropdown(link.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={pageUrl}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-1 px-3 xl:px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-[var(--theme-primary)] hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-full transition-all font-medium text-sm md:text-base whitespace-nowrap"
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </Link>
                    
                    {/* TravelGrow-Style Mega Dropdown Menu */}
                    {activeDropdown === link.id && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 w-[460px] z-50">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          {/* Dropdown Header */}
                          <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-base font-extrabold text-[var(--theme-primary)] dark:text-amber-400 tracking-tight flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {dropCategory === 'domestic' ? 'Domestic Destinations' : 'International Destinations'}
                            </h3>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mt-0.5">
                              Tour Packages
                            </span>
                          </div>

                          {/* Dropdown Destinations Grid (2 Columns) */}
                          <div className="p-5 max-h-[360px] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                              {dropDestinations.map((dest: any) => {
                                const isKailash = (dest.name || '').toLowerCase().includes('kailash');
                                const destSlug = toDestinationSlug(dest.name);
                                const destUrl = isKailash ? '/kailash-mansarovar' : `/${dropCategory}/${destSlug}`;
                                return (
                                  <Link 
                                    key={dest.name} 
                                    href={destUrl}
                                    onClick={() => setActiveDropdown(null)}
                                    className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[var(--theme-primary)] dark:hover:text-amber-400 hover:translate-x-1 transition-all py-1 px-1 rounded-md flex items-center justify-between group/item"
                                  >
                                    <span className="truncate">{dest.name}</span>
                                    <span className="opacity-0 group-hover/item:opacity-100 text-[10px] text-[var(--theme-primary)] transition-opacity">→</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>

                          {/* Dropdown Footer */}
                          <div className="bg-gray-50/80 dark:bg-gray-800/60 px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold">
                            <span className="text-gray-500 dark:text-gray-400">
                              Explore all {dropCategory === 'domestic' ? 'Domestic' : 'Global'} Destinations
                            </span>
                            <Link
                              href={pageUrl}
                              onClick={() => setActiveDropdown(null)}
                              className="text-[var(--theme-primary)] dark:text-amber-400 hover:underline flex items-center gap-1 font-bold"
                            >
                              View All <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.id || link.label}
                  href={link.url}
                  className="px-3 xl:px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-[var(--theme-primary)] hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-full transition-all font-medium text-sm md:text-base whitespace-nowrap"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setShowPlanTourModal(true)}
              className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              Plan Your Tour
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className={`lg:hidden border-t border-gray-100 dark:border-gray-800 py-3 space-y-3 max-h-[75vh] overflow-y-auto custom-scrollbar ${
            isScrolled ? 'px-2' : 'px-4'
          }`}>
            {displayNavLinks.map((link: any) => {
              const isDom = link.id === 'domestic' || link.category === 'domestic' || link.label?.toLowerCase() === 'domestic';
              const isIntl = link.id === 'international' || link.category === 'international' || link.label?.toLowerCase() === 'international';
              const isDropdown = link.isDropdown || isDom || isIntl;

              if (isDropdown) {
                const dropCategory = (isIntl || link.category === 'international') ? 'international' : 'domestic';
                const dropDestinations = dropCategory === 'domestic' ? domesticDestinations : internationalDestinations;
                const pageUrl = link.url || (dropCategory === 'domestic' ? '/domestic' : '/international');

                return (
                  <div key={link.id} className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                      <Link 
                        href={pageUrl} 
                        onClick={() => setIsOpen(false)}
                        className="font-bold text-gray-900 dark:text-white"
                      >
                        {link.label}
                      </Link>
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === link.id ? null : link.id)}
                        className="p-1 text-gray-500 hover:text-gray-800"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {activeDropdown === link.id && (
                      <div className="pl-4 pr-2 py-2 space-y-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="grid grid-cols-2 gap-2">
                          {dropDestinations.map((dest: any) => {
                            const isKailash = (dest.name || '').toLowerCase().includes('kailash');
                            const destSlug = toDestinationSlug(dest.name);
                            const destUrl = isKailash ? '/kailash-mansarovar' : `/${dropCategory}/${destSlug}`;
                            return (
                              <Link 
                                key={dest.name} 
                                href={destUrl}
                                onClick={() => setIsOpen(false)}
                                className="block px-2 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[var(--theme-primary)] rounded-lg transition-colors truncate"
                              >
                                {dest.name}
                              </Link>
                            );
                          })}
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-right">
                          <Link 
                            href={pageUrl}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-[var(--theme-primary)] dark:text-amber-400 inline-flex items-center gap-1"
                          >
                            View All {dropCategory === 'domestic' ? 'Domestic' : 'International'} →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.id || link.label}
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <button
                onClick={() => { setShowPlanTourModal(true); setIsOpen(false); }}
                className="w-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white font-bold py-3 rounded-full shadow-md text-sm hover:shadow-lg transition-all"
              >
                Plan Your Tour
              </button>
            </div>
          </div>
        )}
      </nav>

      <PlanTourModal
        isOpen={showPlanTourModal}
        onClose={() => setShowPlanTourModal(false)}
      />
    </header>
  );
}
