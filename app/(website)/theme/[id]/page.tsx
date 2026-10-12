import type { Metadata } from 'next';
import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

interface ThemeInfo {
  title: string;
  search: string;
  metaTitle: string;
  description: string;
}

const THEME_MAP: Record<string, ThemeInfo> = {
  beach: {
    title: 'Beach & Island',
    search: 'Beach',
    metaTitle: 'Explore Beach & Island Tour Packages | Shree Ananta Travels', // 60 chars
    description: 'Explore breathtaking beach holidays and exotic island tour packages with Shree Ananta Travels. Handcrafted itineraries and luxury seaside resorts.',
  },
  adventure: {
    title: 'Adventure & Trekking',
    search: 'Adventure',
    metaTitle: 'Top Adventure & Trekking Tour Packages | Shree Ananta Travels', // 61 chars
    description: 'Conquer thrilling treks and adrenaline-fueled adventure expeditions across India and worldwide with Shree Ananta Travels. Book your next journey.',
  },
  heritage: {
    title: 'Heritage & Culture',
    search: 'Heritage',
    metaTitle: 'Royal Heritage & Culture Tour Packages | Shree Ananta Travels', // 61 chars
    description: 'Step back in time with majestic heritage circuits, royal palaces, and authentic cultural tour packages curated by Shree Ananta Travels.',
  },
  honeymoon: {
    title: 'Honeymoon & Romance',
    search: 'Honeymoon',
    metaTitle: 'Top Romantic Honeymoon Tour Packages | Shree Ananta Travels', // 60 chars
    description: 'Celebrate love with handcrafted romantic honeymoon packages, luxury private villas, and memorable couple getaways by Shree Ananta Travels.',
  },
};

function formatThemeSlug(slug: string): string {
  const decoded = decodeURIComponent(slug).replace(/-/g, ' ').trim();
  return decoded
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const themeKey = id.toLowerCase().trim();
  const knownTheme = THEME_MAP[themeKey];

  const title = knownTheme?.metaTitle || `Top ${formatThemeSlug(id)} Tour Packages | Shree Ananta Travels`;
  const description = knownTheme?.description || `Discover curated ${formatThemeSlug(id)} travel packages with Shree Ananta Travels. Personalized itineraries and dedicated concierge service.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/theme/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/theme/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const themeKey = id.toLowerCase().trim();
  const knownTheme = THEME_MAP[themeKey];

  const displayTitle = knownTheme?.title || `${formatThemeSlug(id)} Tours`;
  const searchKeyword = knownTheme?.search || formatThemeSlug(id);
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
        name: 'Tour Packages',
        item: `${baseUrl}/packages`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${displayTitle} Packages`,
        item: `${baseUrl}/theme/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgentMarketplacePage
        initialSearch={searchKeyword}
        initialDestinationTitle={displayTitle}
      />
    </>
  );
}
