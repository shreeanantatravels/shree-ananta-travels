import type { Metadata } from 'next';
import ContactUs from '@website/app/pages/ContactUs';
import connectDB from '@/lib/db/connect';
import SiteConfig from '@/lib/db/models/SiteConfig';
import AdminUser from '@/lib/db/models/AdminUser';
import { getDisplayPhone, DEFAULT_CONTACT_PHONE } from '@/lib/utils/contactConfig';

export const metadata: Metadata = {
  title: {
    absolute: 'Contact Us | Shree Ananta Travels Delhi Office & Booking Desk',
  },
  description:
    'Get in touch with Shree Ananta Travels at our Delhi office in East of Kailash. Speak directly with our travel experts via phone, WhatsApp, or contact inquiry.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Shree Ananta Travels Delhi Office & Booking Desk',
    description:
      'Get in touch with Shree Ananta Travels at our Delhi office in East of Kailash. Speak directly with our travel experts via phone, WhatsApp, or contact inquiry.',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Shree Ananta Travels Delhi Office & Booking Desk',
    description:
      'Get in touch with Shree Ananta Travels at our Delhi office in East of Kailash. Speak directly with our travel experts via phone, WhatsApp, or contact inquiry.',
  },
};

function getContactSchema(phone: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Shree Ananta Travels',
    description: 'Official contact details for Shree Ananta Travels Delhi office.',
    mainEntity: {
      '@type': 'TravelAgency',
      '@id': 'https://www.shreeanantatravels.com/#organization',
      name: 'Shree Ananta Travels',
      url: 'https://www.shreeanantatravels.com',
      logo: 'https://www.shreeanantatravels.com/uploads/shree-ananta-logo.jpg',
      image: 'https://www.shreeanantatravels.com/uploads/shree-ananta-logo.jpg',
      ...(getDisplayPhone(phone) ? { telephone: getDisplayPhone(phone) } : {}),
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
}

export default async function ContactPage() {
  let phone = DEFAULT_CONTACT_PHONE;
  try {
    await connectDB();
    const [cfg, admin] = await Promise.all([
      SiteConfig.findOne({ _singleton: true }).select('contactPhone').lean(),
      AdminUser.findOne().select('whatsapp').lean(),
    ]);
    phone = admin?.whatsapp?.trim() || cfg?.contactPhone?.trim() || DEFAULT_CONTACT_PHONE;
  } catch {}

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getContactSchema(phone)) }}
      />
      <ContactUs />
    </>
  );
}
