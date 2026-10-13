import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import connectDB from '@/lib/db/connect';
import Blog from '@/lib/db/models/Blog';
import BlogCategory from '@/lib/db/models/BlogCategory';
import Package from '@/lib/db/models/Package';
import BlogDetailPage from '@website/app/pages/BlogDetailPage';
import CategoryListingPage from '@website/app/pages/CategoryListingPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';

  try {
    await connectDB();

    // 1. Check if slug matches an active Category
    const category = await BlogCategory.findOne({ slug, isActive: true }).lean();
    if (category) {
      const title = category.heading || `${category.name} Yatra Blogs | Shree Ananta Travels`;
      const description =
        category.description ||
        `Explore verified travel guides, pilgrimage details, routes, and blogs about ${category.name} with Shree Ananta Travels.`;
      const canonicalUrl = `${baseUrl}/blogs/${category.slug}`;

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
              alt: `${category.name} Blogs`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [`${baseUrl}/uploads/shree-ananta-logo.webp`],
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    // 2. Check if slug matches a single Blog Article
    const blog = await Blog.findOne({
      $or: [{ slug }, { redirectFromSlugs: slug }],
    }).lean();

    if (!blog || blog.status !== 'published') {
      return {
        title: 'Article Not Found | Shree Ananta Travels',
        robots: { index: false, follow: true },
      };
    }

    const title = blog.seo?.title || `${blog.title} | Shree Ananta Travels`;
    const description = blog.seo?.description || blog.excerpt || '';
    const canonicalUrl = blog.seo?.canonicalUrl || `${baseUrl}/blogs/${blog.slug}`;
    const coverImage = blog.socialSharing?.ogImage || blog.coverImage || `${baseUrl}/uploads/shree-ananta-logo.webp`;
    const ogTitle = blog.socialSharing?.ogTitle || title;
    const ogDescription = blog.socialSharing?.ogDescription || description;

    return {
      title: {
        absolute: title,
      },
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: `${baseUrl}/blogs/${blog.slug}`,
        type: 'article',
        publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
        modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
        authors: [blog.author || 'Shree Ananta Travels Editorial Desk'],
        section: blog.category,
        tags: blog.tags || [],
        images: [
          {
            url: coverImage,
            width: 1600,
            height: 900,
            alt: blog.coverImageAlt || blog.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        images: [coverImage],
      },
      robots: {
        index: !blog.seo?.noIndex,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Travel Article | Shree Ananta Travels',
      robots: { index: false, follow: true },
    };
  }
}

export default async function BlogSlugResolverPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shreeanantatravels.com';

  await connectDB();

  // ── 1. Check if slug matches an active Category Landing Page ──────
  const category = await BlogCategory.findOne({ slug, isActive: true }).lean();
  if (category) {
    const rawArticles = await Blog.find({
      categorySlug: category.slug,
      status: 'published',
    })
      .sort({ publishedAt: -1 })
      .lean();

    const serializedCategory = JSON.parse(JSON.stringify(category));
    const serializedArticles = JSON.parse(JSON.stringify(rawArticles)).map((a: any) => ({
      _id: a._id.toString(),
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt || '',
      coverImage: a.coverImage || '/uploads/shree-ananta-logo.webp',
      coverImageAlt: a.coverImageAlt || a.title,
      author: a.author || 'Shree Ananta Travels',
      category: a.category || category.name,
      categorySlug: a.categorySlug || category.slug,
      publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString() : new Date().toISOString(),
      readTime: a.readTime || 5,
    }));

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

    const popularPackages = JSON.parse(JSON.stringify(rawPackages)).map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      slug: p.slug || p._id.toString(),
      imageUrl1: p.imageUrl1,
      duration: p.duration,
      location: p.location,
    }));

    // Category Breadcrumb Schema
    const breadcrumbSchema = {
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
          name: 'Blogs',
          item: `${baseUrl}/blogs`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `${baseUrl}/blogs/${category.slug}`,
        },
      ],
    };

    // Category Collection & ItemList Schema
    const collectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.heading || `${category.name} Yatra Blogs`,
      description: category.description || `Explore verified travel guides and pilgrimage blogs about ${category.name} with Shree Ananta Travels.`,
      url: `${baseUrl}/blogs/${category.slug}`,
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
        numberOfItems: serializedArticles.length,
        itemListElement: serializedArticles.map((art: any, idx: number) => ({
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
        <CategoryListingPage
          category={serializedCategory}
          articles={serializedArticles}
          popularPackages={popularPackages}
          pagination={{
            page: 1,
            limit: 20,
            totalCount: serializedArticles.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }}
        />
      </>
    );
  }

  // ── 2. Otherwise check if slug matches a Blog Post ────────────────
  const blog = await Blog.findOne({
    $or: [{ slug }, { redirectFromSlugs: slug }],
  }).lean();

  if (!blog) {
    notFound();
  }

  // Handle permanent 301 redirect if user visited an old slug that was modified
  if (blog.slug !== slug && blog.redirectFromSlugs?.includes(slug)) {
    redirect(`/blogs/${blog.slug}`);
  }

  // Do not expose draft/archived blogs on public site
  if (blog.status !== 'published') {
    notFound();
  }

  // Fetch related articles from same category or latest
  const relatedRaw = await Blog.find({
    status: 'published',
    _id: { $ne: blog._id },
    categorySlug: blog.categorySlug,
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  // Fallback to latest published if fewer than 3 in same category
  let relatedFinal = relatedRaw;
  if (relatedFinal.length < 3) {
    const additional = await Blog.find({
      status: 'published',
      _id: { $nin: [blog._id, ...relatedFinal.map((r) => r._id)] },
    })
      .sort({ publishedAt: -1 })
      .limit(3 - relatedFinal.length)
      .lean();
    relatedFinal = [...relatedFinal, ...additional];
  }

  const serializedBlog = JSON.parse(JSON.stringify(blog));
  const serializedRelated = JSON.parse(JSON.stringify(relatedFinal));

  // JSON-LD BlogPosting Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blogs/${blog.slug}`,
    },
    headline: blog.title,
    description: blog.excerpt,
    image: [blog.coverImage],
    datePublished: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString(),
    dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author || 'Shree Ananta Travels Editorial Desk',
    },
    publisher: {
      '@type': 'TravelAgency',
      name: 'Shree Ananta Travels',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/uploads/shree-ananta-logo.webp`,
      },
    },
    articleSection: blog.category,
    keywords: (blog.tags || []).join(', '),
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
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
        name: 'Blogs',
        item: `${baseUrl}/blogs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.category,
        item: `${baseUrl}/blogs/${blog.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: blog.title,
        item: `${baseUrl}/blogs/${blog.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogDetailPage article={serializedBlog} relatedArticles={serializedRelated} />
    </>
  );
}
