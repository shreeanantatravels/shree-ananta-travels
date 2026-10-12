import type { Metadata } from 'next';
import PrivacyPolicy from '@website/app/pages/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the privacy policy of Shree Ananta Travels. Learn how we handle, protect, and respect your personal travel information.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Shree Ananta Travels',
    description:
      'Read the privacy policy of Shree Ananta Travels. Learn how we handle, protect, and respect your personal travel information.',
    url: '/privacy-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Shree Ananta Travels',
    description:
      'Read the privacy policy of Shree Ananta Travels. Learn how we handle, protect, and respect your personal travel information.',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
