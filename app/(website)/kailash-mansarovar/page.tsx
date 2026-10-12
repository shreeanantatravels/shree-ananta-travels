import { Metadata } from 'next';
import MansarovarLanding from '@website/app/pages/MansarovarLanding';

export const metadata: Metadata = {
  title: 'Kailash Mansarovar Yatra 2027 Packages & Booking | Shree Ananta Travels',
  description:
    'Plan your sacred Kailash Mansarovar Yatra 2027 with Shree Ananta Travels. Helicopter & overland routes via Nepal, Lhasa air route, China visa, Tibet permits, and pure vegetarian meals.',
  keywords: [
    'Kailash Mansarovar Yatra',
    'Kailash Mansarovar Yatra 2027',
    'Kailash Yatra 2027 Packages',
    'Kailash Yatra by Helicopter',
    'Overland Kailash Yatra',
    'Kailash Yatra via Lucknow',
    'Shree Ananta Travels Kailash Yatra',
    'Mount Kailash Tour Packages',
  ],
  alternates: {
    canonical: '/kailash-mansarovar',
  },
  openGraph: {
    title: 'Kailash Mansarovar Yatra 2027 Packages & Booking | Shree Ananta Travels',
    description:
      'Plan your sacred Kailash Mansarovar Yatra 2027 with Shree Ananta Travels. Helicopter & overland routes via Nepal, Lhasa air route, China visa, Tibet permits, and pure vegetarian meals.',
    url: '/kailash-mansarovar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kailash Mansarovar Yatra 2027 Packages & Booking | Shree Ananta Travels',
    description:
      'Plan your sacred Kailash Mansarovar Yatra 2027 with Shree Ananta Travels. Helicopter & overland routes via Nepal, Lhasa air route, China visa, Tibet permits, and pure vegetarian meals.',
  },
};

export default function KailashMansarovarPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shreeanantatravels.com';
  
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
        name: 'Kailash Mansarovar Yatra Packages 2027',
        item: `${baseUrl}/kailash-mansarovar`,
      },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best route for senior citizens or parents?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Helicopter Route via Lucknow / Nepalgunj minimizes road transit and is best for seniors. For seniors who cannot trek at all, the 1-Day Aerial Darshan flight offers mountain darshan without entering Tibet.',
        },
      },
      {
        '@type': 'Question',
        name: 'How are Tibet Travel Permits and China Visas handled?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You only provide your passport copy. Shree Ananta Travels manages the complete group documentation with the Tibet Tourism Bureau and Embassy.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I rent a pony / horse for the 3-day Parikrama?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, local Tibetan ponies and porters are arranged at Yam Dwar on a direct rental basis to comfortably assist yatris who cannot trek the full distance on foot.',
        },
      },
      {
        '@type': 'Question',
        name: 'What kind of food is provided during the yatra?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fresh, hot pure vegetarian and Jain meals (dal, rice, roti, sabzi, khichdi, porridge, soups, and warm water) are prepared daily by our dedicated Indian cooks.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many months in advance should I register?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We recommend planning 3 to 6 months in advance so Tibet travel permits and group visa formalities can be processed comfortably before the season begins.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can NRIs and foreign passport holders join this Yatra?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Foreign passport holders (USA, UK, Canada, Australia, etc.) and NRIs can easily join with appropriate China Group Visa processing arranged by our team.',
        },
      },
    ],
  };

  const touristTripLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: 'Kailash Mansarovar Yatra 2027 Season',
    description:
      'Sacred pilgrimage to Mount Kailash and Lake Mansarovar with helicopter, overland, and Lhasa air routes organized by Shree Ananta Travels.',
    touristType: ['Pilgrims', 'Devotees', 'Spiritual Seekers'],
    provider: {
      '@type': 'TravelAgency',
      name: 'Shree Ananta Travels',
      url: baseUrl,
    },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Helicopter Route via Lucknow (10 Days)',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Overland Route via Kyirong (14 Days)',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Lhasa Air Route (15 Days)',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Aerial Darshan Mountain Flight (1 Day)',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripLd) }}
      />
      <MansarovarLanding />
    </>
  );
}
