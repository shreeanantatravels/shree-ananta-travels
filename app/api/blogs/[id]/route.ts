import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Blog from '@/lib/db/models/Blog';
import { getAuthUserId } from '@/lib/auth';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';
import {
  slugifyText,
  calculateReadTime,
  generateExcerptSuggestion,
  generateSeoTitleSuggestion,
  generateMetaDescriptionSuggestion,
} from '@/lib/utils/blogUtils';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    let userAuthed = false;
    if (isAdmin) {
      const userId = await getAuthUserId();
      if (userId) userAuthed = true;
    }

    // Attempt lookup by ID or by current slug
    let blog = null;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isObjectId) {
      blog = await Blog.findById(id).lean();
    }

    if (!blog) {
      blog = await Blog.findOne({ slug: id }).lean();
    }

    // Check if `id` matches an old slug that was redirected
    if (!blog) {
      const redirectedBlog = await Blog.findOne({ redirectFromSlugs: id }).lean();
      if (redirectedBlog) {
        return NextResponse.json({
          success: true,
          isRedirect: true,
          redirectTo: `/blogs/${redirectedBlog.slug}`,
          data: redirectedBlog,
        });
      }
    }

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    // Non-admin can only view published articles
    if (!userAuthed && blog.status !== 'published') {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    console.error('Error fetching blog detail:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    const newStatus = (body.status || blog.status) as 'draft' | 'scheduled' | 'published' | 'archived';

    // Strict validation if status is published or scheduled
    if (newStatus === 'published' || newStatus === 'scheduled') {
      const titleToValidate = body.title !== undefined ? body.title : blog.title;
      const contentToValidate = body.content !== undefined ? body.content : blog.content;
      const imageToValidate = body.coverImage !== undefined ? body.coverImage : blog.coverImage;
      const catToValidate = body.category !== undefined ? body.category : blog.category;
      const authorToValidate = body.author !== undefined ? body.author : blog.author;

      if (!titleToValidate || String(titleToValidate).trim().length < 3) {
        return NextResponse.json({ success: false, message: 'Title is required for publication.' }, { status: 400 });
      }
      if (!contentToValidate || String(contentToValidate).trim().length < 20) {
        return NextResponse.json({ success: false, message: 'Article content must be at least 20 characters.' }, { status: 400 });
      }
      if (!imageToValidate || !String(imageToValidate).trim()) {
        return NextResponse.json({ success: false, message: 'Cover image is required for publication.' }, { status: 400 });
      }
      if (!catToValidate || !String(catToValidate).trim()) {
        return NextResponse.json({ success: false, message: 'Category is required for publication.' }, { status: 400 });
      }
      if (!authorToValidate || !String(authorToValidate).trim()) {
        return NextResponse.json({ success: false, message: 'Author name (Published By) is required.' }, { status: 400 });
      }
    }

    // Slug update & redirect tracking
    if (body.slug) {
      const candidateSlug = slugifyText(body.slug);
      if (candidateSlug && candidateSlug !== blog.slug) {
        const conflict = await Blog.findOne({ slug: candidateSlug, _id: { $ne: id } });
        if (conflict) {
          return NextResponse.json({ success: false, message: 'This URL slug is already taken by another article.' }, { status: 400 });
        }

        // If previously published, maintain permanent redirect
        if (blog.status === 'published' || blog.publishedAt) {
          if (!blog.redirectFromSlugs.includes(blog.slug)) {
            blog.redirectFromSlugs.push(blog.slug);
          }
        }
        blog.slug = candidateSlug;
      }
    }

    if (body.title) blog.title = String(body.title).trim();
    if (body.content !== undefined) {
      blog.content = String(body.content).trim();
      blog.readTime = calculateReadTime(blog.content);
    }
    if (body.excerpt !== undefined) {
      blog.excerpt = String(body.excerpt).trim() || generateExcerptSuggestion(blog.content);
    }
    if (body.coverImage !== undefined) {
      const newCoverImage = String(body.coverImage).trim();
      if (blog.coverImage && blog.coverImage !== newCoverImage && blog.coverImage.includes('res.cloudinary.com')) {
        try {
          await deleteImageFromCloudinary(blog.coverImage);
        } catch (err) {
          console.error('Failed to delete old cover image from Cloudinary:', err);
        }
      }
      blog.coverImage = newCoverImage;
    }
    if (body.coverImageAlt !== undefined) blog.coverImageAlt = String(body.coverImageAlt).trim();
    if (body.author) blog.author = String(body.author).trim();
    if (body.category) blog.category = String(body.category).trim();
    if (body.categorySlug) blog.categorySlug = slugifyText(body.categorySlug);
    if (body.subcategory !== undefined) blog.subcategory = String(body.subcategory).trim();
    if (body.subcategorySlug !== undefined) blog.subcategorySlug = slugifyText(body.subcategorySlug);

    // Featured article exclusive toggle
    if (body.isFeatured !== undefined) {
      const willBeFeatured = Boolean(body.isFeatured);
      if (willBeFeatured && !blog.isFeatured) {
        await Blog.updateMany({ _id: { $ne: id }, isFeatured: true }, { $set: { isFeatured: false } });
      }
      blog.isFeatured = willBeFeatured;
    }

    // Status & dates
    blog.status = newStatus;
    if (newStatus === 'published' && !blog.publishedAt) {
      blog.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    }
    if (newStatus === 'scheduled') {
      if (!body.scheduledAt || new Date(body.scheduledAt) <= new Date()) {
        return NextResponse.json(
          { success: false, message: 'Scheduled date must be set in the future.' },
          { status: 400 }
        );
      }
      blog.scheduledAt = new Date(body.scheduledAt);
    }

    if (Array.isArray(body.tags)) {
      blog.tags = body.tags.map((t: string) => String(t).trim()).filter(Boolean);
    }

    if (Array.isArray(body.faq)) {
      blog.faq = body.faq
        .map((item: any) => ({
          question: String(item?.question || '').trim(),
          answer: String(item?.answer || '').trim(),
        }))
        .filter((item: any) => item.question || item.answer);
    }

    // SEO updates
    if (body.seo) {
      blog.seo = {
        title: body.seo.title ? String(body.seo.title).trim() : generateSeoTitleSuggestion(blog.title),
        description: body.seo.description ? String(body.seo.description).trim() : generateMetaDescriptionSuggestion(blog.title, blog.excerpt, blog.content),
        canonicalUrl: body.seo.canonicalUrl ? String(body.seo.canonicalUrl).trim() : '',
        noIndex: Boolean(body.seo.noIndex),
      };
    }

    // Social Sharing updates
    if (body.socialSharing) {
      blog.socialSharing = {
        ogTitle: body.socialSharing.ogTitle ? String(body.socialSharing.ogTitle).trim() : (blog.seo?.title || blog.title),
        ogDescription: body.socialSharing.ogDescription ? String(body.socialSharing.ogDescription).trim() : (blog.seo?.description || blog.excerpt),
        ogImage: body.socialSharing.ogImage ? String(body.socialSharing.ogImage).trim() : blog.coverImage,
      };
    }

    await blog.save();

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { id } = await params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    // Collect all Cloudinary image URLs associated with this article
    const imagesToDelete = new Set<string>();

    if (blog.coverImage) {
      imagesToDelete.add(blog.coverImage);
    }

    if (blog.socialSharing?.ogImage) {
      imagesToDelete.add(blog.socialSharing.ogImage);
    }

    // Also collect any Cloudinary images embedded inside the article content
    if (blog.content) {
      const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/[^\s"')<>]+/g;
      const contentMatches = blog.content.match(cloudinaryRegex);
      if (contentMatches) {
        contentMatches.forEach((imgUrl: string) => imagesToDelete.add(imgUrl));
      }
    }

    // Delete all associated images from Cloudinary
    for (const imgUrl of imagesToDelete) {
      try {
        await deleteImageFromCloudinary(imgUrl);
      } catch (imgError) {
        console.error('Error deleting Cloudinary image:', imgUrl, imgError);
      }
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Article and associated images deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
