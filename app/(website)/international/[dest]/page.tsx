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
  const description = `Discover international ${destination} tour packages with Shree Ananta Travels. Handcrafted itineraries, curated accommodations, and seamless travel concierge support.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/international/${params.dest}`,
    },
    openGraph: {
      title,
      description,
      url: `/international/${params.dest}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function InternationalDestinationPage({ params }: { params: { dest: string } }) {
  const destination = decodeURIComponent(params.dest).replace(/-/g, ' ');
  return <AgentMarketplacePage initialCategory="international" initialSearch={destination} />;
}
