import type { Metadata } from 'next';
import Services from '@website/app/pages/Services';

export const metadata: Metadata = {
  title: 'Travel Services & Custom Tours | Shree Ananta Travels',
  description:
    'Comprehensive travel planning services by Shree Ananta Travels: customized tour itineraries, hotel reservations, transfers, and pilgrimage support.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Travel Services & Custom Tours | Shree Ananta Travels',
    description:
      'Comprehensive travel planning services by Shree Ananta Travels: customized tour itineraries, hotel reservations, transfers, and pilgrimage support.',
    url: '/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Services & Custom Tours | Shree Ananta Travels',
    description:
      'Comprehensive travel planning services by Shree Ananta Travels: customized tour itineraries, hotel reservations, transfers, and pilgrimage support.',
  },
};

export default function ServicesPage() {
  return <Services />;
}
