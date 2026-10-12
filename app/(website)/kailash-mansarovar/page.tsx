import { Metadata } from 'next';
import MansarovarLanding from '@website/app/pages/MansarovarLanding';

export const metadata: Metadata = {
  title: 'Kailash Mansarovar Yatra 2026 - 2027 Packages | Shree Ananta Travels',
  description:
    'Plan your sacred Kailash Mansarovar Yatra with Shree Ananta Travels. Helicopter & overland routes via Nepal, Lhasa air route, China visa, Tibet permits, and pure vegetarian meals.',
  keywords: [
    'Kailash Mansarovar Yatra',
    'Kailash Mansarovar Yatra 2026',
    'Kailash Mansarovar Yatra 2027',
    'Kailash Yatra by Helicopter',
    'Overland Kailash Yatra',
    'Kailash Yatra via Lucknow',
    'Shree Ananta Travels Kailash Yatra',
  ],
  alternates: {
    canonical: '/kailash-mansarovar',
  },
  openGraph: {
    title: 'Kailash Mansarovar Yatra 2026 - 2027 Packages | Shree Ananta Travels',
    description:
      'Plan your sacred Kailash Mansarovar Yatra with Shree Ananta Travels. Helicopter & overland routes via Nepal, Lhasa air route, China visa, Tibet permits, and pure vegetarian meals.',
    url: '/kailash-mansarovar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kailash Mansarovar Yatra 2026 - 2027 Packages | Shree Ananta Travels',
    description:
      'Plan your sacred Kailash Mansarovar Yatra with Shree Ananta Travels. Helicopter & overland routes via Nepal, Lhasa air route, China visa, Tibet permits, and pure vegetarian meals.',
  },
};

export default function KailashMansarovarPage() {
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
        name: 'Kailash Mansarovar Yatra Packages 2026-2027',
        item: `${baseUrl}/kailash-mansarovar`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <MansarovarLanding />
    </>
  );
}
