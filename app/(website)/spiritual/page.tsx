import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

export const metadata: Metadata = {
  title: {
    absolute: 'Spiritual & Pilgrimage Yatra Packages | Shree Ananta Travels',
  },
  description:
    'Book sacred Himalayan yatras: Kailash Mansarovar, Adi Kailash, Om Parvat & Char Dham with Shree Ananta Travels. Certified guides & pure veg meals.',
  alternates: {
    canonical: '/spiritual',
  },
  openGraph: {
    title: 'Spiritual & Pilgrimage Yatra Packages | Shree Ananta Travels',
    description:
      'Book sacred Himalayan yatras including Kailash Mansarovar, Adi Kailash, Om Parvat, Char Dham, and Kashi with Shree Ananta Travels.',
    url: '/spiritual',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spiritual & Pilgrimage Yatra Packages | Shree Ananta Travels',
    description:
      'Book sacred Himalayan yatras including Kailash Mansarovar, Adi Kailash, Om Parvat, Char Dham, and Kashi with Shree Ananta Travels.',
  },
};

export default function SpiritualPage() {
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
        name: 'Spiritual Yatras',
        item: `${baseUrl}/spiritual`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgentMarketplacePage initialSearch="Spiritual" />
    </>
  );
}
