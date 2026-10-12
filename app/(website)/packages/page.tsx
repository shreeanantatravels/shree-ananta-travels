import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

export const metadata: Metadata = {
  title: 'Explore Holiday Tour Packages | Shree Ananta Travels',
  description:
    'Browse curated domestic and international travel packages from Shree Ananta Travels. Filter by category, duration, and personalized travel preferences.',
  alternates: {
    canonical: '/packages',
  },
  openGraph: {
    title: 'Explore Holiday Tour Packages | Shree Ananta Travels',
    description:
      'Browse curated domestic and international travel packages from Shree Ananta Travels. Filter by category, duration, and personalized travel preferences.',
    url: '/packages',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Holiday Tour Packages | Shree Ananta Travels',
    description:
      'Browse curated domestic and international travel packages from Shree Ananta Travels. Filter by category, duration, and personalized travel preferences.',
  },
};

export default function PackagesPage() {
  return <AgentMarketplacePage />;
}