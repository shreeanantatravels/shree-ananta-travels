import type { Metadata } from 'next';
import DestinationsPage from '@website/app/pages/DestinationsPage';

export const metadata: Metadata = {
  title: 'Top Travel Destinations',
  description:
    'Discover top tourist destinations across India and worldwide. Plan your next vacation with Shree Ananta Travels\' curated travel guides and itineraries.',
  alternates: {
    canonical: '/destinations',
  },
  openGraph: {
    title: 'Top Travel Destinations | Shree Ananta Travels',
    description:
      'Discover top tourist destinations across India and worldwide. Plan your next vacation with Shree Ananta Travels\' curated travel guides and itineraries.',
    url: '/destinations',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Travel Destinations | Shree Ananta Travels',
    description:
      'Discover top tourist destinations across India and worldwide. Plan your next vacation with Shree Ananta Travels\' curated travel guides and itineraries.',
  },
};

export default function Page() {
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
        name: 'Top Travel Destinations',
        item: `${baseUrl}/destinations`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <DestinationsPage />
    </>
  );
}
