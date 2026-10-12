import { AgentProvider } from '@website/app/context/AgentContext';
import { ThemeProvider } from '@website/app/context/ThemeContext';
import AgentThemeSync from '@website/app/components/AgentThemeSync';

const organizationSchema = {
  '@context': 'https://schema.org',
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
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      <ThemeProvider>
        <AgentThemeSync />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </ThemeProvider>
    </AgentProvider>
  );
}
