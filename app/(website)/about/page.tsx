import type { Metadata } from 'next';
import AboutUs from '@website/app/pages/AboutUs';

export const metadata: Metadata = {
  title: 'About Us — Journeys That Connect',
  description:
    'Discover Shree Ananta Travels: where every journey is more than an itinerary. Dedicated travel planning, sacred yatras, and curated tour packages.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Shree Ananta Travels — Journeys That Connect',
    description:
      'Discover Shree Ananta Travels: where every journey is more than an itinerary. Dedicated travel planning, sacred yatras, and curated tour packages.',
    url: '/about',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'About Shree Ananta Travels — Journeys That Connect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Shree Ananta Travels — Journeys That Connect',
    description:
      'Discover Shree Ananta Travels: where every journey is more than an itinerary. Dedicated travel planning, sacred yatras, and curated tour packages.',
    images: ['/icon.png'],
  },
};

export default function AboutPage() {
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
        name: 'About Us',
        item: `${baseUrl}/about`,
      },
    ],
  };

  const aboutPageLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Us | Shree Ananta Travels',
    description:
      'Discover Shree Ananta Travels: where every journey is more than an itinerary. Dedicated travel planning, sacred yatras, and curated holiday packages.',
    url: `${baseUrl}/about`,
    mainEntity: {
      '@id': `${baseUrl}/#organization`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }}
      />
      <AboutUs />
    </>
  );
}
