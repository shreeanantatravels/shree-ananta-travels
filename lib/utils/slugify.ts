/**
 * URL Slug generation & parsing utility for destinations
 * Ensures clean URLs without %26 or special characters
 */

export function toDestinationSlug(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fromDestinationSlug(slug: string): string {
  if (!slug) return '';
  const decoded = decodeURIComponent(slug).replace(/-/g, ' ').trim();
  return decoded
    .split(' ')
    .map((word) => {
      if (word.toLowerCase() === 'and') return '&';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
