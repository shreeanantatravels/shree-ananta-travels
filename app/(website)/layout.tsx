import { AgentProvider } from "@website/app/context/AgentContext";
import { ThemeProvider } from "@website/app/context/ThemeContext";
import AgentThemeSync from "@website/app/components/AgentThemeSync";
import connectDB from "@/lib/db/connect";
import Package from "@/lib/db/models/Package";
import SiteConfig from "@/lib/db/models/SiteConfig";

const siteGraphSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.shreeanantatravels.com/#website",
      url: "https://www.shreeanantatravels.com",
      name: "Shree Ananta Travels",
      alternateName: [
        "kailash and Adi Kailash Yatra Agency in India",
        "Shree Ananta Travels Delhi",
      ],
      description:
        "kailash and Adi Kailash Yatra Agency in India. Leading pilgrimage and travel agency for Kailash Mansarovar, Adi Kailash, Char Dham, domestic holidays and international tour packages.",
      publisher: {
        "@id": "https://www.shreeanantatravels.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://www.shreeanantatravels.com/packages?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "TravelAgency",
      "@id": "https://www.shreeanantatravels.com/#organization",
      name: "Shree Ananta Travels",
      alternateName: "kailash and Adi Kailash Yatra Agency in India",
      url: "https://www.shreeanantatravels.com",
      logo: "https://www.shreeanantatravels.com/uploads/shree-ananta-logo.jpg",
      image: "https://www.shreeanantatravels.com/uploads/shree-ananta-logo.jpg",
      telephone: "+91 7289037447",
      email: "shreeanantatravels@gmail.com",
      priceRange: "₹₹",
      description:
        "kailash and Adi Kailash Yatra Agency in India. Providing complete Tibet permits, certified Sherpas, pure veg meals, and customized domestic & international tour packages.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "E91, East of Kailash",
        addressLocality: "Delhi",
        postalCode: "110065",
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Pilgrimage and Holiday Tour Packages",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Kailash Mansarovar Yatra Packages",
          },
          {
            "@type": "OfferCatalog",
            name: "Adi Kailash & Om Parvat Yatra Packages",
          },
          {
            "@type": "OfferCatalog",
            name: "Char Dham Yatra Packages",
          },
          {
            "@type": "OfferCatalog",
            name: "Domestic Holiday Tour Packages",
          },
          {
            "@type": "OfferCatalog",
            name: "International Holiday Packages",
          },
        ],
      },
    },
    {
      "@type": "SiteNavigationElement",
      name: "Kailash Mansarovar",
      url: "https://www.shreeanantatravels.com/kailash-mansarovar",
      description:
        "Sacred Mount Kailash & Lake Mansarovar Yatra by Helicopter and Overland routes with complete Tibet permits and Sherpa support.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Adi Kailash & Spiritual",
      url: "https://www.shreeanantatravels.com/packages?category=spiritual",
      description:
        "Divine Adi Kailash, Om Parvat and Himalayan spiritual yatras with dedicated local guides and permits.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Char Dham",
      url: "https://www.shreeanantatravels.com/packages?category=spiritual",
      description:
        "Book Char Dham Yatra 2026 packages with family, group, and helicopter options across Yamunotri, Gangotri, Kedarnath & Badrinath.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Domestic",
      url: "https://www.shreeanantatravels.com/domestic",
      description:
        "Curated domestic tour packages across Kashmir, Kerala, Rajasthan, Himachal Pradesh, Ladakh and Andaman.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "International",
      url: "https://www.shreeanantatravels.com/international",
      description:
        "Explore international tour packages for Dubai, Vietnam, Thailand, Bali, Europe, Singapore and Nepal.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "All Packages",
      url: "https://www.shreeanantatravels.com/packages",
      description:
        "Browse all pilgrimage and holiday tour packages with transparent pricing and customized itineraries.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Destinations",
      url: "https://www.shreeanantatravels.com/destinations",
      description:
        "Discover popular travel and pilgrimage destinations across India and worldwide.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "About Us",
      url: "https://www.shreeanantatravels.com/about",
      description:
        "Learn about Shree Ananta Travels, India trusted travel and spiritual pilgrimage agency.",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Contact",
      url: "https://www.shreeanantatravels.com/contact",
      description:
        "Contact our travel concierge desk for customized quotes, route guidance, and 24/7 assistance.",
    },
  ],
};

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialPackages: any[] = [];
  let initialSiteConfig: any = null;

  try {
    await connectDB();
    const [pkgs, cfg] = await Promise.all([
      Package.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
      SiteConfig.findOne({ _singleton: true }).lean(),
    ]);
    initialPackages = JSON.parse(JSON.stringify(pkgs || []));
    initialSiteConfig = JSON.parse(JSON.stringify(cfg || null));
  } catch (error) {
    console.error("Failed to pre-fetch website data during SSR:", error);
  }

  return (
    <AgentProvider
      initialPackages={initialPackages}
      initialSiteConfig={initialSiteConfig}
    >
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
