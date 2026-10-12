import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/*?search=*',
          '/*?*search=*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
