import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

export const metadata: Metadata = {
  title: {
    absolute: 'Fixed Departure Group Tour Packages | Shree Ananta Travels',
  },
  description:
    'Explore upcoming fixed departure group tour packages across popular destinations with Shree Ananta Travels. Enjoy verified hotel stays, dedicated tour coordinators, and transparent pricing.',
  alternates: {
    canonical: '/group-tours',
  },
  openGraph: {
    title: 'Fixed Departure Group Tour Packages | Shree Ananta Travels',
    description:
      'Explore upcoming fixed departure group tour packages across popular destinations with Shree Ananta Travels. Enjoy verified hotel stays, dedicated tour coordinators, and transparent pricing.',
    url: '/group-tours',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixed Departure Group Tour Packages | Shree Ananta Travels',
    description:
      'Explore upcoming fixed departure group tour packages across popular destinations with Shree Ananta Travels.',
  },
};

export default function GroupToursPage() {
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
        name: 'Group Tours',
        item: `${baseUrl}/group-tours`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgentMarketplacePage initialCategory="group" initialSearch="" />
    </>
  );
}
