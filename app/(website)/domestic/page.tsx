import type { Metadata } from 'next';
import DestinationsCategoryPage from '@website/app/pages/DestinationsCategoryPage';

export const metadata: Metadata = {
  title: 'Domestic Tour Packages in India | Shree Ananta Travels',
  description:
    'Explore scenic holiday destinations across India with Shree Ananta Travels. Curated family, romantic, and spiritual itineraries with transparent pricing.',
  alternates: {
    canonical: '/domestic',
  },
  openGraph: {
    title: 'Domestic Tour Packages in India | Shree Ananta Travels',
    description:
      'Explore scenic holiday destinations across India with Shree Ananta Travels. Curated family, romantic, and spiritual itineraries with transparent pricing.',
    url: '/domestic',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domestic Tour Packages in India | Shree Ananta Travels',
    description:
      'Explore scenic holiday destinations across India with Shree Ananta Travels. Curated family, romantic, and spiritual itineraries with transparent pricing.',
  },
};

export default function DomesticPage() {
  return <DestinationsCategoryPage category="domestic" />;
}
