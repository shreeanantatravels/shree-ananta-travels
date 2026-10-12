import type { Metadata } from 'next';
import DestinationsCategoryPage from '@website/app/pages/DestinationsCategoryPage';

export const metadata: Metadata = {
  title: {
    absolute: 'Explore Domestic Tour Packages in India | Shree Ananta Travels',
  },
  description:
    'Explore scenic holiday destinations across India with Shree Ananta Travels. Curated family, romantic, and spiritual itineraries with transparent pricing.',
  alternates: {
    canonical: '/domestic',
  },
  openGraph: {
    title: 'Explore Domestic Tour Packages in India | Shree Ananta Travels',
    description:
      'Explore scenic holiday destinations across India with Shree Ananta Travels. Curated family, romantic, and spiritual itineraries with transparent pricing.',
    url: '/domestic',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Domestic Tour Packages in India | Shree Ananta Travels',
    description:
      'Explore scenic holiday destinations across India with Shree Ananta Travels. Curated family, romantic, and spiritual itineraries with transparent pricing.',
  },
};

export default function DomesticPage() {
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
        name: 'Domestic Tour Packages',
        item: `${baseUrl}/domestic`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <DestinationsCategoryPage category="domestic" />
    </>
  );
}
