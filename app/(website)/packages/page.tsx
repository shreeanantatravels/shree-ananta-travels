import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const isSearchQuery = Boolean(params?.search || params?.q);

  return {
    title: {
      absolute: 'Explore Curated Tour Packages in India | Shree Ananta Travels',
    },
    description:
      'Browse curated domestic and international travel packages from Shree Ananta Travels. Filter by category, duration, and personalized travel preferences.',
    alternates: {
      canonical: '/packages',
    },
    robots: isSearchQuery
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: 'Explore Curated Tour Packages in India | Shree Ananta Travels',
      description:
        'Browse curated domestic and international travel packages from Shree Ananta Travels. Filter by category, duration, and personalized travel preferences.',
      url: '/packages',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Explore Curated Tour Packages in India | Shree Ananta Travels',
      description:
        'Browse curated domestic and international travel packages from Shree Ananta Travels. Filter by category, duration, and personalized travel preferences.',
    },
  };
}

export default function PackagesPage() {
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
        name: 'Tour Packages',
        item: `${baseUrl}/packages`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgentMarketplacePage />
    </>
  );
}