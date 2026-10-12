import type { Metadata } from 'next';
import AboutUs from '@website/app/pages/AboutUs';

export const metadata: Metadata = {
  title: 'About Us',
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: `${baseUrl}/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AboutUs />
    </>
  );
}
