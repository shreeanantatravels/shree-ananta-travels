/**
 * Pure client-safe utility functions for Package Slugs and SEO generation.
 * No database or Node.js native dependencies.
 */

/**
 * Convert package title into a clean, URL-friendly slug
 * - lowercase
 * - replaces & with and
 * - converts non-alphanumeric to hyphens
 * - eliminates repeated and leading/trailing hyphens
 */
export function slugifyPackage(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Suggest an SEO Title for a package (aiming for 50-60 characters)
 */
export function generatePackageSeoTitle(title: string, destination?: string): string {
  if (!title) return 'Tour Package | Shree Ananta Travels';
  const cleanTitle = title.trim();
  const cleanDest = destination?.trim();

  // If title is already detailed
  const directWithBrand = `${cleanTitle} | Shree Ananta Travels`;
  if (directWithBrand.length <= 62) {
    return directWithBrand;
  }

  // If destination is available and not in title
  if (cleanDest && !cleanTitle.toLowerCase().includes(cleanDest.toLowerCase())) {
    const withDest = `${cleanTitle} in ${cleanDest} | Shree Ananta Travels`;
    if (withDest.length <= 62) return withDest;
  }

  if (cleanTitle.length <= 60) return cleanTitle;
  return cleanTitle.substring(0, 58).trim() + '...';
}

/**
 * Suggest an SEO Meta Description (aiming for 130-160 characters)
 */
export function generatePackageMetaDescription(
  title: string,
  destination?: string,
  duration?: string,
  description?: string
): string {
  const cleanTitle = title?.trim() || 'Tour Package';
  const cleanDest = destination?.trim() || 'India';
  const cleanDuration = duration?.trim() || 'Customized Duration';

  if (description && description.length >= 80 && description.length <= 160) {
    return description.trim();
  }

  if (description && description.length > 160) {
    const snippet = description.slice(0, 155).trim();
    const lastSpace = snippet.lastIndexOf(' ');
    return (lastSpace > 60 ? snippet.substring(0, lastSpace) : snippet) + '...';
  }

  return `Book ${cleanTitle} (${cleanDuration}) in ${cleanDest} with Shree Ananta Travels. Personalized itineraries, verified hotels, and dedicated concierge assistance.`;
}

/**
 * Suggest a Primary Focus Keyword based on package title and destination
 */
export function generatePackageFocusKeyword(title: string, destination?: string): string {
  if (!title) return '';
  const cleanTitle = title
    .replace(/\s*–\s*.*$/g, '') // remove trailing "– 14D/13N"
    .replace(/\s*-\s*.*$/g, '')
    .trim();

  if (destination && !cleanTitle.toLowerCase().includes(destination.toLowerCase())) {
    return `${cleanTitle} in ${destination}`;
  }
  return cleanTitle;
}

/**
 * Suggest Related Keywords based on package title, destination, and category
 */
export function generatePackageRelatedKeywords(
  title: string,
  destination?: string,
  category?: string
): string[] {
  const list = new Set<string>();
  const base = generatePackageFocusKeyword(title);

  if (base) {
    list.add(`${base} Package`);
    list.add(`${base} Itinerary`);
  }

  if (destination) {
    list.add(`${destination} Tour Packages`);
    list.add(`Best Time to Visit ${destination}`);
  }

  if (category === 'kailash') {
    list.add('Kailash Mansarovar Yatra');
    list.add('Tibet Permit Assistance');
  } else if (category === 'domestic') {
    list.add('Domestic Holiday Packages');
  } else if (category === 'international') {
    list.add('International Tour Packages');
  }

  return Array.from(list).slice(0, 5);
}

/**
 * Standard suggested package tags
 */
export const SUGGESTED_PACKAGE_TAGS = [
  'Spiritual Tour',
  'Helicopter Yatra',
  'Himalayan Trek',
  'Family Holiday',
  'Honeymoon',
  'Luxury Stays',
  'Bestseller',
  'Weekend Getaway',
  'Pilgrimage',
  'Adventure',
  'Heritage & Culture',
  'Group Travel',
];
