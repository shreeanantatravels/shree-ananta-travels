import { AgentProvider } from '@website/app/context/AgentContext';
import { ThemeProvider } from '@website/app/context/ThemeContext';
import AgentThemeSync from '@website/app/components/AgentThemeSync';

const siteGraphSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TravelAgency',
      name: 'Shree Ananta Travels',
      url: 'https://shreeanantatravels.com',
      logo: 'https://shreeanantatravels.com/uploads/shree-ananta-logo.jpg',
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
    {
      '@type': 'SiteNavigationElement',
      name: 'Home',
      url: 'https://shreeanantatravels.com/',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Tour Packages',
      url: 'https://shreeanantatravels.com/packages',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Domestic Tours',
      url: 'https://shreeanantatravels.com/domestic',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'International Tours',
      url: 'https://shreeanantatravels.com/international',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Kailash Mansarovar Yatra',
      url: 'https://shreeanantatravels.com/landing/kailash-mansarovar',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Top Destinations',
      url: 'https://shreeanantatravels.com/destinations',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'About Us',
      url: 'https://shreeanantatravels.com/about',
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Contact Us',
      url: 'https://shreeanantatravels.com/contact',
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
