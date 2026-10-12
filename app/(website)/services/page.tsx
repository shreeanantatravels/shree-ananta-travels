import type { Metadata } from 'next';
import Services from '@website/app/pages/Services';

export const metadata: Metadata = {
  title: 'Travel Services & Custom Tours | Shree Ananta Travels',
  description:
    'Comprehensive travel planning services by Shree Ananta Travels: customized tour itineraries, hotel reservations, transfers, and pilgrimage support.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Travel Services & Custom Tours | Shree Ananta Travels',
    description:
      'Comprehensive travel planning services by Shree Ananta Travels: customized tour itineraries, hotel reservations, transfers, and pilgrimage support.',
    url: '/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Services & Custom Tours | Shree Ananta Travels',
    description:
      'Comprehensive travel planning services by Shree Ananta Travels: customized tour itineraries, hotel reservations, transfers, and pilgrimage support.',
  },
};

export default function ServicesPage() {
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
        name: 'Services',
        item: `${baseUrl}/services`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Services />
    </>
  );
}
