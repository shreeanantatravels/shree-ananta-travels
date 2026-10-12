import type { Metadata } from 'next';
import DestinationsCategoryPage from '@website/app/pages/DestinationsCategoryPage';

export const metadata: Metadata = {
  title: 'International Tour Packages | Shree Ananta Travels',
  description:
    'Plan seamless international holidays to Dubai, Bali, Thailand, and beyond. Tailored itineraries, flight assistance, and direct travel concierge support.',
  alternates: {
    canonical: '/international',
  },
  openGraph: {
    title: 'International Tour Packages | Shree Ananta Travels',
    description:
      'Plan seamless international holidays to Dubai, Bali, Thailand, and beyond. Tailored itineraries, flight assistance, and direct travel concierge support.',
    url: '/international',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Tour Packages | Shree Ananta Travels',
    description:
      'Plan seamless international holidays to Dubai, Bali, Thailand, and beyond. Tailored itineraries, flight assistance, and direct travel concierge support.',
  },
};

export default function InternationalPage() {
  return <DestinationsCategoryPage category="international" />;
}
