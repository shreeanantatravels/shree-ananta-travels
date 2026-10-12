import type { Metadata } from 'next';
import TermsConditions from '@website/app/pages/TermsConditions';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Shree Ananta Travels',
  description:
    'Read the terms and conditions for booking tours, packages, and travel services with Shree Ananta Travels.',
  alternates: {
    canonical: '/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms and Conditions | Shree Ananta Travels',
    description:
      'Read the terms and conditions for booking tours, packages, and travel services with Shree Ananta Travels.',
    url: '/terms-and-conditions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms and Conditions | Shree Ananta Travels',
    description:
      'Read the terms and conditions for booking tours, packages, and travel services with Shree Ananta Travels.',
  },
};

export default function TermsConditionsPage() {
  return <TermsConditions />;
}
