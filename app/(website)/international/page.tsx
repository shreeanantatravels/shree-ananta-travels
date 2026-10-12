import type { Metadata } from 'next';
import DestinationsCategoryPage from '@website/app/pages/DestinationsCategoryPage';

export const metadata: Metadata = {
  title: 'International Tour Packages | Shree Ananta Travels',
  description:
    'Plan seamless international holidays to Dubai, Bali, Thailand, and beyond. Tailored itineraries, flight assistance, and direct travel concierge support.',
  alternates: {
    canonical: '/international',
  },
  openGraph: {
    title: 'International Tour Packages | Shree Ananta Travels',
    description:
      'Plan seamless international holidays to Dubai, Bali, Thailand, and beyond. Tailored itineraries, flight assistance, and direct travel concierge support.',
    url: '/international',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Tour Packages | Shree Ananta Travels',
    description:
      'Plan seamless international holidays to Dubai, Bali, Thailand, and beyond. Tailored itineraries, flight assistance, and direct travel concierge support.',
  },
};

export default function InternationalPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeanantatravels.com';
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
        name: 'International Tour Packages',
        item: `${baseUrl}/international`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <DestinationsCategoryPage category="international" />
    </>
  );
}
