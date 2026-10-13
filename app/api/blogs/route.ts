import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Blog from '@/lib/db/models/Blog';
import { getAuthUserId } from '@/lib/auth';
import {
  slugifyText,
  ensureUniqueBlogSlug,
  calculateReadTime,
  generateExcerptSuggestion,
  generateSeoTitleSuggestion,
  generateMetaDescriptionSuggestion,
} from '@/lib/utils/blogUtils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Auto-promote scheduled posts whose time has arrived
    const now = new Date();
    await Blog.updateMany(
      { status: 'scheduled', scheduledAt: { $lte: now } },
      { $set: { status: 'published', publishedAt: now } }
    );

    const isAdmin = searchParams.get('admin') === 'true';
    const statusParam = searchParams.get('status');
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'latest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '9', 10)));
    const featuredOnly = searchParams.get('featured') === 'true';

    // Verify auth if requesting admin mode
    let userAuthed = false;
    if (isAdmin) {
      const userId = await getAuthUserId();
      if (userId) userAuthed = true;
    }

    const query: any = {};

    if (userAuthed) {
      if (statusParam && statusParam !== 'all') {
        query.status = statusParam;
      }
    } else {
      // Public site: strictly published articles only
      query.status = 'published';
    }

    if (categorySlug && categorySlug !== 'all') {
      query.categorySlug = categorySlug;
    }

    if (subcategorySlug && subcategorySlug !== 'all') {
      query.subcategorySlug = subcategorySlug;
    }

    if (featuredOnly) {
      query.isFeatured = true;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
        { author: searchRegex },
      ];
    }

    const sortOptions: any = {};
    if (sort === 'oldest') {
      sortOptions.publishedAt = 1;
      sortOptions.createdAt = 1;
    } else {
      // latest
      sortOptions.publishedAt = -1;
      sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const [articles, totalCount] = await Promise.all([
      Blog.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ]);

    // For public listing, optionally also fetch the featured article if requested or on page 1
    let featuredArticle = null;
    if (!userAuthed && page === 1 && !categorySlug && !search) {
      featuredArticle = await Blog.findOne({ status: 'published', isFeatured: true })
        .sort({ publishedAt: -1 })
        .lean();

      // If no article is marked as featured, pick the newest published one
      if (!featuredArticle && articles.length > 0) {
        featuredArticle = articles[0];
      }
    }

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      success: true,
      data: articles,
      featuredArticle,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();

    const title = String(body.title || '').trim();
    if (!title || title.length < 3) {
      return NextResponse.json({ success: false, message: 'Blog title is required (minimum 3 characters).' }, { status: 400 });
    }

    const status = (body.status || 'draft') as 'draft' | 'scheduled' | 'published' | 'archived';

    // Strict validation for publication or scheduling
    if (status === 'published' || status === 'scheduled') {
      if (!body.content || String(body.content).trim().length < 20) {
        return NextResponse.json(
          { success: false, message: 'Article content is required for publication (minimum 20 characters).' },
          { status: 400 }
        );
      }
      if (!body.coverImage || !String(body.coverImage).trim()) {
        return NextResponse.json(
          { success: false, message: 'A valid cover image is required for publication.' },
          { status: 400 }
        );
      }
      if (!body.category || !String(body.category).trim()) {
        return NextResponse.json(
          { success: false, message: 'Please select a category for publication.' },
          { status: 400 }
        );
      }
      if (!body.author || !String(body.author).trim()) {
        return NextResponse.json(
          { success: false, message: 'Author (Published By) name is required.' },
          { status: 400 }
        );
      }
    }

    const rawSlug = body.slug ? slugifyText(body.slug) : slugifyText(title);
    const slug = await ensureUniqueBlogSlug(rawSlug);

    const content = String(body.content || '').trim();
    const excerpt = body.excerpt && String(body.excerpt).trim()
      ? String(body.excerpt).trim()
      : generateExcerptSuggestion(content);

    const category = String(body.category || 'General').trim();
    const categorySlug = body.categorySlug ? slugifyText(body.categorySlug) : slugifyText(category);
    const subcategory = body.subcategory ? String(body.subcategory).trim() : '';
    const subcategorySlug = subcategory ? slugifyText(subcategory) : '';

    const author = String(body.author || 'Shree Ananta Travels Editorial Desk').trim();
    const isFeatured = Boolean(body.isFeatured);

    // If marking as featured, unset any existing featured article
    if (isFeatured) {
      await Blog.updateMany({ isFeatured: true }, { $set: { isFeatured: false } });
    }

    let publishedAt = body.publishedAt ? new Date(body.publishedAt) : undefined;
    let scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : undefined;

    if (status === 'published' && !publishedAt) {
      publishedAt = new Date();
    }
    if (status === 'scheduled' && (!scheduledAt || scheduledAt <= new Date())) {
      return NextResponse.json(
        { success: false, message: 'Scheduled date must be set to a future date & time.' },
        { status: 400 }
      );
    }

    const readTime = calculateReadTime(content);

    // SEO defaults
    const seoTitle = body.seo?.title && String(body.seo.title).trim()
      ? String(body.seo.title).trim()
      : generateSeoTitleSuggestion(title);

    const seoDescription = body.seo?.description && String(body.seo.description).trim()
      ? String(body.seo.description).trim()
      : generateMetaDescriptionSuggestion(title, excerpt, content);

    const newBlog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      coverImage: String(body.coverImage || '').trim(),
      coverImageAlt: String(body.coverImageAlt || title).trim(),
      author,
      category,
      categorySlug,
      subcategory,
      subcategorySlug,
      status,
      isFeatured,
      publishedAt,
      scheduledAt,
      readTime,
      tags: Array.isArray(body.tags) ? body.tags.map((t: string) => String(t).trim()).filter(Boolean) : [],
      seo: {
        title: seoTitle,
        description: seoDescription,
        canonicalUrl: body.seo?.canonicalUrl ? String(body.seo.canonicalUrl).trim() : '',
        noIndex: Boolean(body.seo?.noIndex),
      },
      socialSharing: {
        ogTitle: body.socialSharing?.ogTitle ? String(body.socialSharing.ogTitle).trim() : seoTitle,
        ogDescription: body.socialSharing?.ogDescription ? String(body.socialSharing.ogDescription).trim() : seoDescription,
        ogImage: body.socialSharing?.ogImage ? String(body.socialSharing.ogImage).trim() : String(body.coverImage || '').trim(),
      },
      redirectFromSlugs: [],
    });

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create blog' },
      { status: 500 }
    );
  }
}
