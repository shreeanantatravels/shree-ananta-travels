import { AgentProvider } from '@website/app/context/AgentContext';
import { ThemeProvider } from '@website/app/context/ThemeContext';
import AgentThemeSync from '@website/app/components/AgentThemeSync';

const siteGraphSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://shreeanantatravels.com/#website',
      url: 'https://shreeanantatravels.com',
      name: 'Shree Ananta Travels',
      alternateName: [
        '#1 Kailash and Adi Kailash Yatra Agency in India',
        'Shree Ananta Travels Delhi',
      ],
      description:
        '#1 Kailash and Adi Kailash Yatra Agency in India. Leading pilgrimage and travel agency for Kailash Mansarovar, Adi Kailash, Char Dham, domestic holidays and international tour packages.',
      publisher: {
        '@id': 'https://shreeanantatravels.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://shreeanantatravels.com/packages?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'TravelAgency',
      '@id': 'https://shreeanantatravels.com/#organization',
      name: 'Shree Ananta Travels',
      alternateName: '#1 Kailash and Adi Kailash Yatra Agency in India',
      url: 'https://shreeanantatravels.com',
      logo: 'https://shreeanantatravels.com/uploads/shree-ananta-logo.jpg',
      image: 'https://shreeanantatravels.com/uploads/shree-ananta-logo.jpg',
      telephone: '+91 7289037447',
      email: 'shreeanantatravels@gmail.com',
      priceRange: '₹₹',
      description:
        '#1 Kailash and Adi Kailash Yatra Agency in India. Providing complete Tibet permits, certified Sherpas, pure veg meals, and customized domestic & international tour packages.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'E91, East of Kailash',
        addressLocality: 'Delhi',
        postalCode: '110065',
        addressCountry: 'IN',
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Pilgrimage and Holiday Tour Packages',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Kailash Mansarovar Yatra Packages',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Adi Kailash & Om Parvat Yatra Packages',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Char Dham Yatra Packages',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Domestic Holiday Tour Packages',
          },
          {
            '@type': 'OfferCatalog',
            name: 'International Holiday Packages',
          },
        ],
      },
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Kailash Mansarovar',
      url: 'https://shreeanantatravels.com/kailash-mansarovar',
      description: 'Sacred Mount Kailash & Lake Mansarovar Yatra by Helicopter and Overland routes with complete Tibet permits and Sherpa support.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Adi Kailash & Spiritual',
      url: 'https://shreeanantatravels.com/packages?category=spiritual',
      description: 'Divine Adi Kailash, Om Parvat and Himalayan spiritual yatras with dedicated local guides and permits.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Char Dham',
      url: 'https://shreeanantatravels.com/packages?category=spiritual',
      description: 'Book Char Dham Yatra 2026 packages with family, group, and helicopter options across Yamunotri, Gangotri, Kedarnath & Badrinath.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Domestic',
      url: 'https://shreeanantatravels.com/domestic',
      description: 'Curated domestic tour packages across Kashmir, Kerala, Rajasthan, Himachal Pradesh, Ladakh and Andaman.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'International',
      url: 'https://shreeanantatravels.com/international',
      description: 'Explore international tour packages for Dubai, Vietnam, Thailand, Bali, Europe, Singapore and Nepal.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'All Packages',
      url: 'https://shreeanantatravels.com/packages',
      description: 'Browse all pilgrimage and holiday tour packages with transparent pricing and customized itineraries.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Destinations',
      url: 'https://shreeanantatravels.com/destinations',
      description: 'Discover popular travel and pilgrimage destinations across India and worldwide.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'About Us',
      url: 'https://shreeanantatravels.com/about',
      description: 'Learn about Shree Ananta Travels, India trusted travel and spiritual pilgrimage agency.',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Contact',
      url: 'https://shreeanantatravels.com/contact',
      description: 'Contact our travel concierge desk for customized quotes, route guidance, and 24/7 assistance.',
    },
  ],
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      <ThemeProvider>
        <AgentThemeSync />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphSchema) }}
        />
        {children}
      </ThemeProvider>
    </AgentProvider>
  );
}
