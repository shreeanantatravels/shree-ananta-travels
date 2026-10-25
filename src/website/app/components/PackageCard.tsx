import { useState, useEffect } from 'react';
import { Heart, Check, X, Tag, Image as ImageIcon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

import { useAgent } from '../context/AgentContext';

interface PackageCardProps {
  id: string;
  slug?: string;
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  duration: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  badges?: Array<'bestseller'>;
  category?: string;
  offer?: string;
  inclusions?: string[];
  exclusions?: string[];
}

function optimizeCardImageUrl(url: string): string {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('w', '600');
      parsed.searchParams.set('q', '75');
      parsed.searchParams.set('auto', 'format');
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
}

export function PackageCard({
  id,
  slug,
  title,
  location,
  price,
  originalPrice,
  discount,
  duration,
  imageUrl,
  rating,
  reviews,
  featured = false,
  badges,
  category,
  offer,
  inclusions = [],
  exclusions = [],
}: PackageCardProps) {
  const { siteConfig } = useAgent();
  const [imgSrc, setImgSrc] = useState<string>(() => optimizeCardImageUrl(imageUrl || ''));
  const [hasImgError, setHasImgError] = useState(false);

  const packageHref = `/packages/${slug || id}`;

  useEffect(() => {
    setImgSrc(optimizeCardImageUrl(imageUrl || ''));
    setHasImgError(false);
  }, [imageUrl]);

  const handleImageError = () => {
    setHasImgError(true);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this package: ${title} - https://www.shreeanantatravels.com${packageHref}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const cardOffer = siteConfig?.cardOffer;
  const effectiveOffer = offer || (cardOffer?.isActive && cardOffer?.text ? cardOffer.text : undefined);

  const isBestseller = badges?.includes('bestseller');

  if (featured) {
    return (
      <div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 h-full">
        <div className="relative overflow-hidden w-full aspect-[4/5] lg:max-h-[500px]">
          <Link
            href={packageHref}
            prefetch={true}
            aria-label={`View ${title} tour package`}
            className="absolute inset-0 block z-0"
          >
            {imgSrc && !hasImgError ? (
              <img
                src={imgSrc}
                alt={title}
                loading="lazy"
                decoding="async"
                width={480}
                height={600}
                onError={handleImageError}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center group-hover:scale-105 transition-transform duration-700">
                <ImageIcon className="w-12 h-12 text-slate-600 mb-3 opacity-60" />
                <span className="text-white font-bold text-2xl leading-snug line-clamp-2">{title}</span>
                <span className="text-slate-400 text-sm mt-1 font-medium">{location}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <span className="sr-only">{title}</span>
          </Link>
          
          {/* Offer Ribbon */}
          {effectiveOffer && (
            <div className="absolute top-0 right-0 bg-gradient-to-br from-red-600 to-orange-600 text-white px-6 py-2 rounded-bl-2xl shadow-xl z-10 pointer-events-none">
              <p className="text-sm font-bold uppercase tracking-wider">{effectiveOffer}</p>
            </div>
          )}
          
          {/* Category Badge */}
          {category && (
            <div className="absolute bottom-24 left-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 z-10 pointer-events-none">
              {category}
            </div>
          )}
          
          <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-lg z-10 pointer-events-none">
            {duration}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10 pointer-events-none">
            {/* Single Bestseller Badge */}
            {isBestseller && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-900 px-4 py-1.5 rounded-full shadow-[0_4px_15px_rgba(245,158,11,0.4)] border border-amber-300">
                  <span className="text-xs font-black uppercase tracking-widest drop-shadow-sm">Bestseller</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-3">
              <span className="text-yellow-400 text-xl mr-1">★</span>
              <span className="font-bold text-lg">{rating}</span>
              <span className="text-gray-200 text-sm ml-2">({reviews} reviews)</span>
            </div>
            
            <div className="text-4xl font-black mb-2 pointer-events-auto">
              <Link href={packageHref} prefetch={true} className="hover:underline">
                {title}
              </Link>
            </div>
            <p className="text-lg text-gray-200 mb-4">{location}</p>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-300">Starting from</p>
                <div className="flex items-center gap-3">
                  {price && price > 0 ? (
                    <>
                      {originalPrice && originalPrice > 0 && (
                        <p className="text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString()}</p>
                      )}
                      <p className="text-3xl font-bold text-white">₹{price.toLocaleString()}</p>
                      {discount && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {discount}% OFF
                        </span>
                      )}
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-amber-300">Price on Request</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pointer-events-auto">
              <Link href={packageHref}
                prefetch={true}
                aria-label={`View itinerary for ${title}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg transition-all duration-300 font-bold text-base shadow-2xl hover:shadow-3xl hover:-translate-y-1 active:scale-95"
              >
                <span>View Details</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleWhatsAppShare();
                }}
                className="flex items-center justify-center bg-[#25D366] hover:bg-[#20BA5A] text-white px-3 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 active:scale-95 group"
                title="Share on WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="2x" className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden w-full aspect-[4/3] sm:aspect-[4/5] bg-slate-900">
        <Link
          href={packageHref}
          prefetch={true}
          aria-label={`View ${title} tour package`}
          className="block w-full h-full"
        >
          {imgSrc && !hasImgError ? (
            <img
              src={imgSrc}
              alt={title}
              loading="lazy"
              decoding="async"
              width={400}
              height={500}
              onError={handleImageError}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center group-hover:scale-105 transition-transform duration-500">
              <ImageIcon className="w-10 h-10 text-slate-600 mb-2 opacity-60" />
              <span className="text-white font-bold text-lg leading-snug line-clamp-2">{title}</span>
              <span className="text-slate-400 text-xs mt-1 font-medium">{location}</span>
            </div>
          )}
          <span className="sr-only">{title}</span>
        </Link>
        
        {/* Category Badge on Image (bottom left) */}
        {category && (
          <div className="absolute bottom-4 left-4 bg-[#1e293b] text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider pointer-events-none">
            {category}
          </div>
        )}

        {/* Bestseller Badge (curved style with gold color) */}
        {isBestseller && (
          <div className="absolute top-0 right-0 z-10 animate-fade-in-up pointer-events-none">
            <div className="flex items-center gap-1.5 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500 text-slate-900 px-3.5 py-1.5 rounded-bl-2xl shadow-[0_4px_15px_rgba(245,158,11,0.4)] border-b border-l border-amber-300 backdrop-blur-md">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest drop-shadow-sm">Bestseller</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div>
          {/* Location / Theme Text */}
          <p className="text-sm font-semibold mb-1 tracking-wide" style={{ color: 'var(--theme-primary)' }}>
            {location}
          </p>
          
          {/* Title */}
          <div className="text-lg sm:text-xl font-bold text-[#1e293b] dark:text-white leading-tight mb-2 line-clamp-2">
            <Link href={packageHref} prefetch={true} className="hover:text-[var(--theme-primary)] transition-colors">
              {title}
            </Link>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(rating) ? '' : 'text-gray-300'}`} style={i < Math.floor(rating) ? { color: 'var(--theme-primary)' } : {}}>★</span>
            ))}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1">{rating}</span>
            <span className="text-sm text-gray-400">({reviews})</span>
          </div>

          {/* Duration and Tour Type */}
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {duration}
            </div>
          </div>
        </div>
        
        <div className="mt-auto"></div>
        
        {/* Footer: Price & WhatsApp */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Starting From</p>
            <div className="flex items-baseline gap-2">
              {price && price > 0 ? (
                <>
                  <p className="text-xl font-bold text-[#1e293b] dark:text-white">₹{price.toLocaleString()}</p>
                  {originalPrice && originalPrice > 0 && (
                    <p className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</p>
                  )}
                </>
              ) : (
                <p className="text-base font-bold text-[var(--theme-primary)]">Price on Request</p>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => { e.preventDefault(); handleWhatsAppShare(); }}
            className="w-12 h-12 flex items-center justify-center rounded-full text-white transition-all shadow-md hover:scale-105"
            style={{ background: 'var(--theme-gradient)' }}
            title="Chat with us"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
