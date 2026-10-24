import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import SiteConfig from '@/lib/db/models/SiteConfig';
import AdminUser from '@/lib/db/models/AdminUser';
import PackageDetail from '@website/app/pages/PackageDetail';
import {
  generatePackageSeoTitle,
  generatePackageMetaDescription,
} from '@/lib/utils/packageSeoHelper';
import { getDisplayPhone, DEFAULT_CONTACT_PHONE } from '@/lib/utils/contactConfig';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';

const getPackageBySlugOrId = cache(async (slugParam: string) => {
  await connectDB();
  const query: any = {
    $or: [
      { slug: slugParam },
      { redirectFromSlugs: slugParam },
      ...(mongoose.isValidObjectId(slugParam) ? [{ _id: slugParam }] : []),
    ],
  };
  return await Package.findOne(query).lean();
});

const getContactPhoneCached = cache(async () => {
  try {
    const [cfg, admin] = await Promise.all([
      SiteConfig.findOne({ _singleton: true }).select('contactPhone').lean(),
      AdminUser.findOne().select('whatsapp').lean(),
    ]);
    return admin?.whatsapp?.trim() || cfg?.contactPhone?.trim() || DEFAULT_CONTACT_PHONE;
  } catch {
    return DEFAULT_CONTACT_PHONE;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const pkg = await getPackageBySlugOrId(slug);

    if (!pkg || pkg.isActive === false) {
      return {
        title: 'Package Not Found | Shree Ananta Travels',
        description: 'The requested tour package could not be found or has been discontinued.',
        robots: { index: false, follow: true },
      };
    }

    const canonicalSlug = pkg.slug || slug;
    const canonicalUrl = `${SITE_URL}/packages/${canonicalSlug}`;

    // Prefer explicit SEO title, fallback to generated title
    const seoTitle =
      pkg.seo?.title?.trim() ||
      generatePackageSeoTitle(pkg.title, pkg.location);

    // Prefer explicit SEO description, fallback to generated description
    const seoDesc =
      pkg.seo?.description?.trim() ||
      generatePackageMetaDescription(pkg.title, pkg.location, pkg.duration, pkg.description);

    const images = [pkg.imageUrl1, pkg.imageUrl2, pkg.imageUrl3, pkg.imageUrl4]
      .filter(Boolean) as string[];
    const ogImage = images.length > 0 ? images[0] : `${SITE_URL}/uploads/shree-ananta-logo.jpg`;

    return {
      title: {
        absolute: seoTitle,
      },
      description: seoDesc,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seoTitle,
        description: seoDesc,
        url: canonicalUrl,
        type: 'website',
        images: images.length > 0 ? images.map(url => ({ url })) : [{ url: ogImage }],
        siteName: 'Shree Ananta Travels',
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDesc,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: {
        absolute: 'Explore Curated Tour Packages | Shree Ananta Travels',
      },
      description: 'Explore curated travel packages with Shree Ananta Travels.',
    };
  }
}

export default async function PackageSlugDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlugOrId(slug);

  if (!pkg || pkg.isActive === false) {
    notFound();
  }

  // If the requested slug is an old slug or MongoDB ID, permanently redirect to canonical slug
  if (pkg.slug && slug !== pkg.slug) {
    permanentRedirect(`/packages/${pkg.slug}`);
  }

  const canonicalUrl = `${SITE_URL}/packages/${pkg.slug}`;
  const images = [pkg.imageUrl1, pkg.imageUrl2, pkg.imageUrl3, pkg.imageUrl4].filter(Boolean) as string[];

  const price =
    pkg.discountedPrice && pkg.discountedPrice > 0
      ? pkg.discountedPrice
      : pkg.originalPrice && pkg.originalPrice > 0
      ? pkg.originalPrice
      : undefined;

  const phone = await getContactPhoneCached();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.seo?.description || pkg.description || undefined,
    touristType: 'Sightseeing & Pilgrimage',
    url: canonicalUrl,
    ...(images.length > 0 ? { image: images } : {}),
    ...(pkg.location ? { itinerary: { '@type': 'ItemList', name: pkg.location } } : {}),
    provider: {
      '@type': 'TravelAgency',
      '@id': `${SITE_URL}/#organization`,
      name: 'Shree Ananta Travels',
      url: SITE_URL,
      image: `${SITE_URL}/uploads/shree-ananta-logo.jpg`,
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
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: 'INR',
            url: canonicalUrl,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tour Packages',
        item: `${SITE_URL}/packages`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pkg.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <PackageDetail initialPackage={JSON.parse(JSON.stringify(pkg))} />
    </>
  );
}
