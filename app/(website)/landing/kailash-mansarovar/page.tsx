import { Metadata } from 'next';
import MansarovarLanding from '@website/app/pages/MansarovarLanding';

export const metadata: Metadata = {
  title: 'Kailash Mansarovar Yatra Packages 2026 | Shree Ananta Travels',
  description:
    'Plan your sacred Kailash Mansarovar Yatra with Shree Ananta Travels. Overland and helicopter routes via Nepal with yatra permits, visa assistance, and experienced sherpa guidance.',
  alternates: {
    canonical: '/landing/kailash-mansarovar',
  },
  openGraph: {
    title: 'Kailash Mansarovar Yatra Packages 2026 | Shree Ananta Travels',
    description:
      'Plan your sacred Kailash Mansarovar Yatra with Shree Ananta Travels. Overland and helicopter routes via Nepal with yatra permits, visa assistance, and experienced sherpa guidance.',
    url: '/landing/kailash-mansarovar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kailash Mansarovar Yatra Packages 2026 | Shree Ananta Travels',
    description:
      'Plan your sacred Kailash Mansarovar Yatra with Shree Ananta Travels. Overland and helicopter routes via Nepal with yatra permits, visa assistance, and experienced sherpa guidance.',
  },
};

export default function MansarovarLandingPage() {
  return <MansarovarLanding />;
}
