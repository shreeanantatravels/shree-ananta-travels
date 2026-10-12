import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

function formatDestination(dest: string): string {
  const decoded = decodeURIComponent(dest).replace(/-/g, ' ').trim();
  return decoded
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: { params: { dest: string } }): Promise<Metadata> {
  const destination = formatDestination(params.dest);
  const title = `${destination} Tour Packages | Shree Ananta Travels`;
  const description = `Explore curated ${destination} holiday and tour packages with Shree Ananta Travels. Personalized itineraries, authentic stays, and dedicated concierge assistance.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/domestic/${params.dest}`,
    },
    openGraph: {
      title,
      description,
      url: `/domestic/${params.dest}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function DomesticDestinationPage({ params }: { params: { dest: string } }) {
  const destination = decodeURIComponent(params.dest).replace(/-/g, ' ');
  return <AgentMarketplacePage initialCategory="domestic" initialSearch={destination} />;
}
