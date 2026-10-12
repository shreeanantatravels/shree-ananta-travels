import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

function formatDestination(dest: string): string {
  const decoded = decodeURIComponent(dest).replace(/-/g, ' ').trim();
  return decoded
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ dest: string }> }): Promise<Metadata> {
  const { dest } = await params;
  const destination = formatDestination(dest);
  const title = `${destination} Tour Packages | Shree Ananta Travels`;
  const description = `Discover international ${destination} tour packages with Shree Ananta Travels. Handcrafted itineraries, curated accommodations, and seamless travel concierge support.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/international/${dest}`,
    },
    openGraph: {
      title,
      description,
      url: `/international/${dest}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function InternationalDestinationPage({ params }: { params: Promise<{ dest: string }> }) {
  const { dest } = await params;
  const destination = decodeURIComponent(dest).replace(/-/g, ' ');
  const formattedTitle = formatDestination(dest);
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
        name: 'International Tours',
        item: `${baseUrl}/international`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${formattedTitle} Packages`,
        item: `${baseUrl}/international/${dest}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgentMarketplacePage initialCategory="international" initialSearch={destination} />
    </>
  );
}
