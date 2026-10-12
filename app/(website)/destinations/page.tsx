import type { Metadata } from 'next';
import DestinationsPage from '@website/app/pages/DestinationsPage';

export const metadata: Metadata = {
  title: 'Top Travel Destinations | Shree Ananta Travels',
  description:
    'Discover top tourist destinations across India and worldwide. Plan your next vacation with Shree Ananta Travels\' curated travel guides and itineraries.',
  alternates: {
    canonical: '/destinations',
  },
  openGraph: {
    title: 'Top Travel Destinations | Shree Ananta Travels',
    description:
      'Discover top tourist destinations across India and worldwide. Plan your next vacation with Shree Ananta Travels\' curated travel guides and itineraries.',
    url: '/destinations',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Travel Destinations | Shree Ananta Travels',
    description:
      'Discover top tourist destinations across India and worldwide. Plan your next vacation with Shree Ananta Travels\' curated travel guides and itineraries.',
  },
};

export default function Page() {
  return <DestinationsPage />;
}
