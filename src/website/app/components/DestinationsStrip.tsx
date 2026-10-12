"use client";
import Link from 'next/link';
import { MapPin, Globe, Home as HomeIcon } from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { toDestinationSlug } from '@/lib/utils/slugify';

const FALLBACK_INTERNATIONAL = [
  'Maldives', 'Dubai', 'Thailand', 'Bali', 'Singapore',
  'Malaysia', 'Sri Lanka', 'Vietnam', 'Turkey', 'Greece',
  'Switzerland', 'Paris', 'London', 'Japan', 'Australia',
  'Africa', 'Mauritius', 'Egypt',
];

const FALLBACK_DOMESTIC = [
  'Goa', 'Manali', 'Kashmir', 'Shimla', 'Jaipur',
  'Udaipur', 'Kerala', 'Ladakh', 'Rishikesh', 'Andaman',
  'Darjeeling', 'Meghalaya', 'Varanasi', 'Ooty', 'Coorg',
  'Hampi', 'Leh', 'Munnar',
];

export function DestinationsStrip() {
  const { siteConfig, isLoading } = useAgent();

  const allDests = siteConfig?.destinations || [];
  const hasAgentDests = allDests.length > 0;

  const internationalDests = hasAgentDests
    ? allDests.filter(d => d.category === 'international' && d.active).map(d => d.name)
    : (siteConfig ? [] : FALLBACK_INTERNATIONAL);

  const domesticDests = hasAgentDests
    ? allDests.filter(d => d.category === 'domestic' && d.active).map(d => d.name)
    : (siteConfig ? [] : FALLBACK_DOMESTIC);

  const hasInternational = internationalDests.length > 0;
  const hasDomestic = domesticDests.length > 0;

  if (isLoading || (!hasInternational && !hasDomestic)) return null;

  return (
    <section className="py-14 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--theme-gradient)' }}
          >
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <h2
            className="text-xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore All Destinations
          </h2>
        </div>

        <div className={`grid grid-cols-1 ${hasInternational && hasDomestic ? 'md:grid-cols-2' : ''} gap-10`}>
          {hasInternational && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-7 h-7 rounded-sm flex items-center justify-center"
                style={{ background: 'var(--theme-gradient)' }}
              >
                <Globe className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                International
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {internationalDests.map((dest) => {
                const isKailash = (dest || '').toLowerCase().includes('kailash');
                const destSlug = toDestinationSlug(dest);
                const targetUrl = isKailash ? '/kailash-mansarovar' : `/international/${destSlug}`;
                return (
                <Link
                  key={dest}
                  href={targetUrl}
                  className="group flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-transparent hover:text-white transition-all duration-200"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--theme-gradient)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '';
                    (e.currentTarget as HTMLElement).style.borderColor = '';
                  }}
                >
                  <MapPin className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  {dest}
                </Link>
                );
              })}
            </div>
          </div>
          )}

          {hasDomestic && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-7 h-7 rounded-sm flex items-center justify-center"
                style={{ background: 'var(--theme-gradient)' }}
              >
                <HomeIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Domestic
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {domesticDests.map((dest) => {
                const isKailash = (dest || '').toLowerCase().includes('kailash');
                const destSlug = toDestinationSlug(dest);
                const targetUrl = isKailash ? '/kailash-mansarovar' : `/domestic/${destSlug}`;
                return (
                <Link
                  key={dest}
                  href={targetUrl}
                  className="group flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:text-white transition-all duration-200"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--theme-gradient)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '';
                    (e.currentTarget as HTMLElement).style.borderColor = '';
                  }}
                >
                  <MapPin className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  {dest}
                </Link>
                );
              })}
            </div>
          </div>
          )}
        </div>

      </div>
    </section>
  );
}
