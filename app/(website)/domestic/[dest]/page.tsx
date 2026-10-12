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
  const description = `Explore curated ${destination} holiday and tour packages with Shree Ananta Travels. Personalized itineraries, authentic stays, and dedicated concierge assistance.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/domestic/${dest}`,
    },
    openGraph: {
      title,
      description,
      url: `/domestic/${dest}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DomesticDestinationPage({ params }: { params: Promise<{ dest: string }> }) {
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
        name: 'Domestic Tours',
        item: `${baseUrl}/domestic`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${formattedTitle} Packages`,
        item: `${baseUrl}/domestic/${dest}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgentMarketplacePage initialCategory="domestic" initialSearch={destination} />
    </>
  );
}
