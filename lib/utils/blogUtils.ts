import connectDB from '@/lib/db/connect';
import Blog from '@/lib/db/models/Blog';
import BlogCategory from '@/lib/db/models/BlogCategory';

export const INITIAL_BLOG_CATEGORIES = [
  {
    name: 'Destination Guides',
    slug: 'destination-guides',
    description: 'Comprehensive destination travel guides, attractions, best times to visit, and local insights.',
    order: 1,
    showInNavbar: true,
    subcategories: [
      { name: 'Kashmir', slug: 'kashmir', description: 'Paradise on Earth guides' },
      { name: 'Rajasthan', slug: 'rajasthan', description: 'Royal forts, palaces & desert trails' },
      { name: 'Goa', slug: 'goa', description: 'Beaches, coastal heritage & cuisine' },
      { name: 'Kerala', slug: 'kerala', description: 'Backwaters, hill stations & Ayurveda' },
      { name: 'Himachal Pradesh', slug: 'himachal-pradesh', description: 'Shimla, Manali & mountain valleys' },
      { name: 'Ladakh', slug: 'ladakh', description: 'High altitude passes & monasteries' },
      { name: 'Bali', slug: 'bali', description: 'Tropical paradise & cultural tours' },
      { name: 'Dubai', slug: 'dubai', description: 'Futuristic skylines & desert safaris' },
    ],
  },
  {
    name: 'Travel Tips & Planning',
    slug: 'travel-tips-and-planning',
    description: 'Essential travel tips, packing checklists, smart budgeting, and seamless journey planning.',
    order: 2,
    showInNavbar: true,
    subcategories: [
      { name: 'Packing & Preparation', slug: 'packing-and-preparation', description: 'Smart packing guides' },
      { name: 'Budget Travel', slug: 'budget-travel', description: 'Affordable travel advice' },
      { name: 'Solo Travel', slug: 'solo-travel', description: 'Solo traveler safety and routes' },
      { name: 'Flight & Transit', slug: 'flight-and-transit', description: 'Air ticketing and transfers' },
    ],
  },
  {
    name: 'Itineraries & Trip Budgets',
    slug: 'itineraries-and-trip-budgets',
    description: 'Day-by-day curated travel itineraries with realistic cost breakdowns and travel estimates.',
    order: 3,
    showInNavbar: true,
    subcategories: [
      { name: 'Weekend Getaways', slug: 'weekend-getaways', description: 'Quick 2-3 day escapes' },
      { name: '7-Day Tours', slug: '7-day-tours', description: 'One-week comprehensive itineraries' },
      { name: 'Luxury Holidays', slug: 'luxury-holidays', description: 'Premium stays and private charters' },
    ],
  },
  {
    name: 'Pilgrimage & Yatra Guides',
    slug: 'pilgrimage-and-yatra-guides',
    description: 'Sacred Himalayan yatras, preparation protocols, medical fitness, and spiritual itineraries.',
    order: 4,
    showInNavbar: true,
    subcategories: [
      { name: 'Kailash Mansarovar', slug: 'kailash-mansarovar', description: 'Tibet permits, Sherpa support & overland/heli routes' },
      { name: 'Adi Kailash & Om Parvat', slug: 'adi-kailash', description: 'Sacred Kumaon inner-line permit yatras' },
      { name: 'Char Dham', slug: 'char-dham', description: 'Yamunotri, Gangotri, Kedarnath & Badrinath' },
      { name: 'Vaishno Devi & North Shrines', slug: 'vaishno-devi', description: 'Holy shrines in northern India' },
    ],
  },
  {
    name: 'Family & Group Travel',
    slug: 'family-and-group-travel',
    description: 'Comfortable family holiday planning, multi-generational packages, and senior-friendly yatras.',
    order: 5,
    showInNavbar: true,
    subcategories: [
      { name: 'Senior Citizens', slug: 'senior-citizens', description: 'Accessible & leisurely itineraries' },
      { name: 'Kids Friendly', slug: 'kids-friendly', description: 'Family vacation spots' },
      { name: 'Group Tours', slug: 'group-tours', description: 'Custom group coach & vehicle trips' },
    ],
  },
  {
    name: 'International Travel',
    slug: 'international-travel',
    description: 'Overseas visa guides, exotic holiday packages, foreign currency tips, and travel insurance.',
    order: 6,
    showInNavbar: true,
    subcategories: [
      { name: 'Southeast Asia', slug: 'southeast-asia', description: 'Vietnam, Thailand, Singapore & Malaysia' },
      { name: 'Middle East', slug: 'middle-east', description: 'Dubai, Abu Dhabi & Oman' },
      { name: 'Europe', slug: 'europe', description: 'Switzerland, Paris & Italy' },
      { name: 'Island Escapes', slug: 'island-escapes', description: 'Maldives, Mauritius & Sri Lanka' },
    ],
  },
  {
    name: 'Seasonal Travel Guides',
    slug: 'seasonal-travel-guides',
    description: 'Where to travel in each season: Summer mountain retreats, Monsoon getaways, and Winter snow holidays.',
    order: 7,
    showInNavbar: true,
    subcategories: [
      { name: 'Summer Retreats', slug: 'summer-retreats', description: 'Beat the heat in the hills' },
      { name: 'Winter Snow & Skiing', slug: 'winter-snow', description: 'Gulmarg, Auli & Manali snow' },
      { name: 'Monsoon Getaways', slug: 'monsoon-getaways', description: 'Lush green Western Ghats & hills' },
    ],
  },
];

export function slugifyText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function ensureUniqueBlogSlug(baseSlug: string, currentBlogId?: string): Promise<string> {
  await connectDB();
  let slug = baseSlug || 'article';
  let counter = 1;
  while (true) {
    const existing = await Blog.findOne({ slug }).lean();
    if (!existing || (currentBlogId && existing._id.toString() === currentBlogId.toString())) {
      return slug;
    }
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export function calculateReadTime(content: string): number {
  if (!content) return 3;
  // Strip markdown/html tags
  const clean = content.replace(/<[^>]*>?/gm, '').replace(/[#*`_~\[\]()!-]/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const time = Math.ceil(words / 200); // 200 words per minute average
  return Math.max(1, time);
}

export function generateExcerptSuggestion(content: string, maxLen: number = 160): string {
  if (!content) return '';
  const clean = content
    .replace(/<[^>]*>?/gm, '')
    .replace(/#+\s+.+/g, '') // remove headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // link text
    .replace(/[*_`~>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= maxLen) return clean;
  const truncated = clean.substring(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 50 ? truncated.substring(0, lastSpace) : truncated).trim() + '...';
}

export function generateSeoTitleSuggestion(title: string): string {
  if (!title) return 'Travel Blog | Shree Ananta Travels';
  const trimmed = title.trim();
  const withSuffix = `${trimmed} | Shree Ananta Travels`;
  if (withSuffix.length <= 60) return withSuffix;
  if (trimmed.length <= 60) return trimmed;
  return trimmed.substring(0, 57).trim() + '...';
}

export function generateMetaDescriptionSuggestion(title: string, excerpt: string, content: string): string {
  if (excerpt && excerpt.length >= 70 && excerpt.length <= 160) {
    return excerpt.trim();
  }
  const fromContent = generateExcerptSuggestion(content, 155);
  if (fromContent && fromContent.length >= 70) {
    return fromContent;
  }
  return `Explore ${title || 'travel destinations'} with Shree Ananta Travels. Expert itinerary guides, local travel tips, and customized holiday packages.`;
}

export async function seedDefaultCategoriesIfNeeded() {
  await connectDB();
  const count = await BlogCategory.countDocuments();
  if (count === 0) {
    await BlogCategory.insertMany(INITIAL_BLOG_CATEGORIES);
  }
}
