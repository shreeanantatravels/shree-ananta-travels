import type { MetadataRoute } from 'next';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import SiteConfig from '@/lib/db/models/SiteConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeanantatravels.com';
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

  try {
    await connectDB();

    // 1. Fetch active packages
    const packages = await Package.find({ isActive: { $ne: false } }, '_id updatedAt').lean();
    packageRoutes = packages.map((pkg) => ({
      url: `${baseUrl}/package/${pkg._id}`,
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
          const slug = encodeURIComponent(dest.name.toLowerCase().trim().replace(/\s+/g, '-'));
          const prefix = dest.category === 'international' ? 'international' : 'domestic';
          return {
            url: `${baseUrl}/${prefix}/${slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          };
        });
    }
  } catch (error) {
    console.warn('Failed to load dynamic sitemap entities from database:', error);
  }

  return [...staticRoutes, ...packageRoutes, ...destinationRoutes];
}
