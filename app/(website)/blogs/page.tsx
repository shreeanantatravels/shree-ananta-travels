import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/connect';
import Blog from '@/lib/db/models/Blog';
import BlogCategory from '@/lib/db/models/BlogCategory';
import Package from '@/lib/db/models/Package';
import { seedDefaultCategoriesIfNeeded } from '@/lib/utils/blogUtils';
import BlogListingPage from '@website/app/pages/BlogListingPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; search?: string }>;
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';
  const { category, page, search } = await searchParams;

  // If a category param is present, canonical is that category's page
  if (category && category !== 'all') {
    return {
      title: 'Redirecting to Category | Shree Ananta Travels',
      robots: { index: false, follow: true },
    };
  }

  let title = 'Travel Blogs, Yatra Guides & Itineraries | Shree Ananta Travels';
  const description =
    'Discover comprehensive travel blogs, sacred yatra guides, Kashmir & domestic tour tips, and international holiday planning advice from Shree Ananta Travels.';

  const pageNum = parseInt(page || '1', 10);
  if (pageNum > 1) {
    title = `${title} - Page ${pageNum}`;
  }

  const canonicalUrl = `${baseUrl}/blogs`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/uploads/shree-ananta-logo.webp`,
          width: 1200,
          height: 630,
          alt: 'Shree Ananta Travels Blog Journal',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/uploads/shree-ananta-logo.webp`],
    },
  };
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';
  const { category, sort, search, page } = await searchParams;

  // ── IMPORTANT: If a category is requested on /blogs?category=..., 
  // redirect immediately to dedicated canonical /blogs/[categorySlug] page!
  if (category && category !== 'all') {
    redirect(`/blogs/${category}`);
  }

  const currentSort = sort || 'latest';
  const currentSearch = search || '';
  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const limit = 8;

  let initialArticles: any[] = [];
  let popularArticles: any[] = [];
  let popularPackages: any[] = [];
  let categories: any[] = [];
  let totalCount = 0;

  try {
    await connectDB();
    await seedDefaultCategoriesIfNeeded();

    // Promote scheduled posts whose time has passed
    const now = new Date();
    await Blog.updateMany(
      { status: 'scheduled', scheduledAt: { $lte: now } },
      { $set: { status: 'published', publishedAt: now } }
    );

    // Fetch active categories and post counts
    const rawCategories = await BlogCategory.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    const counts = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$categorySlug', count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    counts.forEach((c) => {
      if (c._id) countMap[c._id] = c.count;
    });

    categories = rawCategories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      publishedCount: countMap[cat.slug] || 0,
      subcategories: (cat.subcategories || []).map((s: any) => ({
        name: s.name,
        slug: s.slug,
      })),
    }));

    // Fetch popular / trending articles for the top showcase
    const rawPopular = await Blog.find({ status: 'published' })
      .sort({ isFeatured: -1, publishedAt: -1 })
      .limit(4)
      .lean();
    popularArticles = JSON.parse(JSON.stringify(rawPopular));

    // Fetch popular / trending packages for sidebar
    let rawPackages = await Package.find({
      isActive: { $ne: false },
      $or: [{ isTrending: true }, { badges: 'trending' }],
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(4)
      .select('title slug imageUrl1 duration location')
      .lean();

    if (!rawPackages || rawPackages.length === 0) {
      rawPackages = await Package.find({ isActive: { $ne: false } })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('title slug imageUrl1 duration location')
        .lean();
    }

    popularPackages = JSON.parse(JSON.stringify(rawPackages)).map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      slug: p.slug || p._id.toString(),
      imageUrl1: p.imageUrl1,
      duration: p.duration,
      location: p.location,
    }));

    // Build query for published articles
    const query: any = { status: 'published' };
    if (currentSearch.trim()) {
      const searchRegex = new RegExp(currentSearch.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    const sortOptions: any = {};
    if (currentSort === 'oldest') {
      sortOptions.publishedAt = 1;
      sortOptions.createdAt = 1;
    } else {
      sortOptions.publishedAt = -1;
      sortOptions.createdAt = -1;
    }

    const skip = (currentPage - 1) * limit;

    const [articlesData, count] = await Promise.all([
      Blog.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ]);

    totalCount = count;
    initialArticles = JSON.parse(JSON.stringify(articlesData));
  } catch (error) {
    console.error('Failed to load blog listing data:', error);
  }

  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Breadcrumb Schema
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
        name: 'Travel Blogs & Guides',
        item: `${baseUrl}/blogs`,
      },
    ],
  };

  // CollectionPage & ItemList Schema
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Travel Blogs, Yatra Guides & Itineraries',
    description:
      'Discover comprehensive travel blogs, sacred yatra guides, Kashmir & domestic tour tips, and international holiday planning advice from Shree Ananta Travels.',
    url: `${baseUrl}/blogs`,
    publisher: {
      '@type': 'TravelAgency',
      name: 'Shree Ananta Travels',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/uploads/shree-ananta-logo.webp`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: initialArticles.length,
      itemListElement: initialArticles.map((art: any, idx: number) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: art.title,
        url: `${baseUrl}/blogs/${art.slug}`,
      })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <BlogListingPage
        initialArticles={initialArticles}
        popularArticles={popularArticles}
        featuredArticle={null}
        categories={categories}
        popularPackages={popularPackages}
        pagination={{
          page: currentPage,
          limit,
          totalCount,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        }}
        currentSort={currentSort}
        currentSearch={currentSearch}
      />
    </>
  );
}
