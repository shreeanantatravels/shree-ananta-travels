import { Metadata } from 'next';
import MansarovarLanding from '@website/app/pages/MansarovarLanding';

export const metadata: Metadata = {
  title: 'Kailash Mansarovar Yatra | Get Package & Yatra Details',
  description: 'Plan your sacred Kailash Mansarovar Yatra with trusted experts. Get details on packages, dates, and pricing instantly on WhatsApp.',
  alternates: {
    canonical: '/landing/kailash-mansarovar'
  },
  openGraph: {
    title: 'Kailash Mansarovar Yatra | Get Package & Yatra Details',
    description: 'Plan your sacred Kailash Mansarovar Yatra with trusted experts. Get details on packages, dates, and pricing instantly on WhatsApp.',
    type: 'website',
  }
};

export default function MansarovarLandingPage() {
  return <MansarovarLanding />;
}
