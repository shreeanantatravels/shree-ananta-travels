import type { Metadata } from 'next';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import PackageDetail from '@website/app/pages/PackageDetail';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    await connectDB();
    const pkg = await Package.findById(id).lean();

    if (!pkg || pkg.isActive === false) {
      return {
        title: 'Package Not Found | Shree Ananta Travels',
        description: 'The requested tour package could not be found or has been discontinued.',
        robots: { index: false, follow: true },
      };
    }

    const title = `${pkg.title} | Shree Ananta Travels`;
    const description = pkg.description
      ? pkg.description.slice(0, 160)
      : `Book ${pkg.title} (${pkg.duration || 'Custom Duration'}) in ${pkg.location || 'India'} with Shree Ananta Travels. Personalized itineraries and dedicated concierge assistance.`;
    const image = pkg.imageUrl1 || pkg.imageUrl2 || '';

    return {
      title,
      description,
      alternates: {
        canonical: `/package/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `/package/${id}`,
        type: 'website',
        ...(image ? { images: [{ url: image }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return {
      title: 'Tour Package | Shree Ananta Travels',
      description: 'Explore curated travel packages with Shree Ananta Travels.',
    };
  }
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let jsonLd: Record<string, unknown> | null = null;
  let breadcrumbLd: Record<string, unknown> | null = null;

  try {
    const { id } = await params;
    await connectDB();
    const pkg = await Package.findById(id).lean();

    if (pkg && pkg.isActive !== false) {
      const price = pkg.discountedPrice && pkg.discountedPrice > 0
        ? pkg.discountedPrice
        : pkg.originalPrice && pkg.originalPrice > 0
          ? pkg.originalPrice
          : undefined;

      const images = [pkg.imageUrl1, pkg.imageUrl2, pkg.imageUrl3, pkg.imageUrl4].filter(Boolean);

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: pkg.title,
        description: pkg.description || undefined,
        touristType: 'Sightseeing & Pilgrimage',
        ...(images.length > 0 ? { image: images } : {}),
        ...(pkg.location ? { itinerary: { '@type': 'ItemList', name: pkg.location } } : {}),
        provider: {
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
        ...(price ? {
          offers: {
            '@type': 'Offer',
            price: price,
            priceCurrency: 'INR',
            url: `https://shreeanantatravels.com/package/${id}`,
          },
        } : {}),
      };

      breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://shreeanantatravels.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tour Packages',
            item: 'https://shreeanantatravels.com/packages',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: pkg.title,
            item: `https://shreeanantatravels.com/package/${id}`,
          },
        ],
      };
    }
  } catch {
    // If db query fails during rendering, fallback gracefully to client component
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      <PackageDetail />
    </>
  );
}
