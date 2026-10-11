import type { Metadata } from 'next';
import Home from '@website/app/pages/Home';

export const metadata: Metadata = {
  title: 'Tour Packages for India and Abroad | Shree Ananta Travels',
  description:
    'Customized tour packages across India and abroad, plus Kailash Mansarovar and other yatras. Share your plan and get a quote within 2 hours.',
  keywords: [
    'tour packages',
    'Tour Packages for India and Abroad',
    'Kailash Mansarovar yatra',
    'domestic tour packages',
    'international tour packages',
    'holiday packages',
    'Shree Ananta Travels',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tour Packages for India and Abroad | Shree Ananta Travels',
    description:
      'Customized tour packages across India and abroad, plus Kailash Mansarovar and other yatras. Share your plan and get a quote within 2 hours.',
    url: '/',
    siteName: 'Shree Ananta Travels',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tour Packages for India and Abroad | Shree Ananta Travels',
    description:
      'Customized tour packages across India and abroad, plus Kailash Mansarovar and other yatras. Share your plan and get a quote within 2 hours.',
  },
};

export default function HomePage() {
  return <Home />;
}
