import type { MetadataRoute } from 'next';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import SiteConfig from '@/lib/db/models/SiteConfig';
import { toDestinationSlug } from '@/lib/utils/slugify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/domestic`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/international`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kailash-mansarovar`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/spiritual`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/theme/beach`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/theme/adventure`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/theme/heritage`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/theme/honeymoon`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let packageRoutes: MetadataRoute.Sitemap = [];
  let destinationRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];
  let blogCategoryRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    // 1. Fetch active packages with canonical SEO slugs
    const packages = await Package.find({ isActive: { $ne: false } }, '_id slug updatedAt').lean();
    packageRoutes = packages.map((pkg: any) => ({
      url: `${baseUrl}/packages/${pkg.slug || pkg._id}`,
      lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 2. Fetch active destinations
    const siteConfig = await SiteConfig.findOne({ _singleton: true }, 'destinations').lean();
    if (siteConfig && Array.isArray(siteConfig.destinations)) {
      destinationRoutes = siteConfig.destinations
        .filter((dest: any) => dest.active !== false && dest.name)
        .map((dest: any) => {
          const isKailash = (dest.name || '').toLowerCase().includes('kailash');
          if (isKailash) return null;
          const slug = toDestinationSlug(dest.name);
          const prefix = dest.category === 'international' ? 'international' : 'domestic';
          return {
            url: `${baseUrl}/${prefix}/${slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          };
        })
        .filter(Boolean) as MetadataRoute.Sitemap;
    }

    // 3. Fetch published blogs
    const BlogModel = (await import('@/lib/db/models/Blog')).default;
    const BlogCategoryModel = (await import('@/lib/db/models/BlogCategory')).default;

    const publishedBlogs = await BlogModel.find(
      { status: 'published', 'seo.noIndex': { $ne: true } },
      'slug updatedAt publishedAt categorySlug isFeatured'
    ).lean();

    blogRoutes = publishedBlogs.map((b: any) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : (b.publishedAt ? new Date(b.publishedAt) : now),
      changeFrequency: 'weekly' as const,
      priority: b.isFeatured ? 0.85 : 0.8,
    }));

    // 4. Fetch all active blog categories (with priority boost for Navbar categories)
    const activeCategories = await BlogCategoryModel.find(
      { isActive: { $ne: false } },
      'slug updatedAt showInNavbar'
    ).lean();

    blogCategoryRoutes = activeCategories.map((c: any) => ({
      url: `${baseUrl}/blogs/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: c.showInNavbar ? 0.85 : 0.75,
    }));
  } catch (error) {
    console.warn('Failed to load dynamic sitemap entities from database:', error);
  }

  // Deduplicate all URLs to ensure valid, clean sitemap XML
  const allRoutes = [...staticRoutes, ...packageRoutes, ...destinationRoutes, ...blogCategoryRoutes, ...blogRoutes];
  const uniqueMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const route of allRoutes) {
    if (route && route.url && !uniqueMap.has(route.url)) {
      uniqueMap.set(route.url, route);
    }
  }

  return Array.from(uniqueMap.values());
}
