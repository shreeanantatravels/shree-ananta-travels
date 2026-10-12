import type { Metadata } from 'next';
import AboutUs from '@website/app/pages/AboutUs';

export const metadata: Metadata = {
  title: 'About Us | Shree Ananta Travels Delhi',
  description:
    'Learn about Shree Ananta Travels, our commitment to personalized travel planning, curated accommodations, and dedicated guest concierge support.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Shree Ananta Travels Delhi',
    description:
      'Learn about Shree Ananta Travels, our commitment to personalized travel planning, curated accommodations, and dedicated guest concierge support.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Shree Ananta Travels Delhi',
    description:
      'Learn about Shree Ananta Travels, our commitment to personalized travel planning, curated accommodations, and dedicated guest concierge support.',
  },
};

export default function AboutPage() {
  return <AboutUs />;
}
