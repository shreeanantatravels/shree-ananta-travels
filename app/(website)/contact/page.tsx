import type { Metadata } from 'next';
import ContactUs from '@website/app/pages/ContactUs';

export const metadata: Metadata = {
  title: 'Contact Us | Shree Ananta Travels Delhi Office',
  description:
    'Get in touch with Shree Ananta Travels at our Delhi office in East of Kailash. Speak directly with our travel experts via phone, WhatsApp, or contact inquiry.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Shree Ananta Travels Delhi Office',
    description:
      'Get in touch with Shree Ananta Travels at our Delhi office in East of Kailash. Speak directly with our travel experts via phone, WhatsApp, or contact inquiry.',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Shree Ananta Travels Delhi Office',
    description:
      'Get in touch with Shree Ananta Travels at our Delhi office in East of Kailash. Speak directly with our travel experts via phone, WhatsApp, or contact inquiry.',
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Shree Ananta Travels',
  description: 'Official contact details for Shree Ananta Travels Delhi office.',
  mainEntity: {
    '@type': 'TravelAgency',
    name: 'Shree Ananta Travels',
    url: 'https://shreeanantatravels.com',
    telephone: '+91 7289037447',
    email: 'shreeanantatravels@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'E91, East of Kailash',
      addressLocality: 'Delhi',
      postalCode: '110065',
      addressCountry: 'IN',
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactUs />
    </>
  );
}
