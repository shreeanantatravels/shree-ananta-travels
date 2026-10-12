import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

export const metadata: Metadata = {
  title: 'Trending Holiday Tour Packages',
  description:
    'Explore top trending domestic and international holiday tour packages curated by Shree Ananta Travels. Best-rated vacation itineraries with transparent pricing.',
  alternates: {
    canonical: '/trending',
  },
  openGraph: {
    title: 'Trending Holiday Tour Packages | Shree Ananta Travels',
    description:
      'Explore top trending domestic and international holiday tour packages curated by Shree Ananta Travels.',
    url: '/trending',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trending Holiday Tour Packages | Shree Ananta Travels',
    description:
      'Explore top trending domestic and international holiday tour packages curated by Shree Ananta Travels.',
  },
};

export default function TrendingPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Trending Packages',
        item: `${baseUrl}/trending`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgentMarketplacePage initialCategory="trending" />
    </>
  );
}
