import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import BlogCategory from '@/lib/db/models/BlogCategory';
import Blog from '@/lib/db/models/Blog';
import { getAuthUserId } from '@/lib/auth';
import { seedDefaultCategoriesIfNeeded, slugifyText } from '@/lib/utils/blogUtils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    await seedDefaultCategoriesIfNeeded();

    const { searchParams } = new URL(req.url);
    const navbarOnly = searchParams.get('navbar') === 'true';

    let query: any = { isActive: true };
    if (navbarOnly) {
      const navbarCount = await BlogCategory.countDocuments({ isActive: true, showInNavbar: true });
      if (navbarCount > 0) {
        query.showInNavbar = true;
      }
    }

    const categoriesQuery = BlogCategory.find(query).sort({ order: 1, name: 1 });
    if (navbarOnly) {
      categoriesQuery.limit(18);
    }
    const categories = await categoriesQuery.lean();

    // Compute published blog counts for each category
    const counts = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$categorySlug', count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    counts.forEach((c) => {
      if (c._id) countMap[c._id] = c.count;
    });

    const enriched = categories.map((cat: any) => ({
      ...cat,
      publishedCount: countMap[cat.slug] || 0,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (error: any) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch categories' }, { status: 500 });
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
    const name = String(body.name || '').trim();
    if (!name || name.length < 2) {
      return NextResponse.json({ success: false, message: 'Category name must be at least 2 characters.' }, { status: 400 });
    }

    const slug = slugifyText(body.slug || name);
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Invalid slug generated.' }, { status: 400 });
    }

    const existing = await BlogCategory.findOne({ slug }).lean();
    if (existing) {
      return NextResponse.json({ success: false, message: 'A category with this name or slug already exists.' }, { status: 400 });
    }

    const showInNavbar = Boolean(body.showInNavbar);
    if (showInNavbar) {
      const currentNavbarCount = await BlogCategory.countDocuments({ showInNavbar: true });
      if (currentNavbarCount >= 18) {
        return NextResponse.json(
          {
            success: false,
            message: 'Navbar me maximum 18 categories hi add ki ja sakti hain. Kripya pehle kisi category se "Show in Navbar" uncheck karein.',
          },
          { status: 400 }
        );
      }
    }

    const count = await BlogCategory.countDocuments();
    const subcategories = Array.isArray(body.subcategories)
      ? body.subcategories.map((sub: any) => ({
          name: String(sub.name || '').trim(),
          slug: slugifyText(sub.slug || sub.name),
          description: String(sub.description || '').trim(),
          isActive: sub.isActive !== false,
        })).filter((s: any) => s.name && s.slug)
      : [];

    const newCategory = await BlogCategory.create({
      name,
      slug,
      heading: String(body.heading || '').trim(),
      description: String(body.description || '').trim(),
      subcategories,
      order: typeof body.order === 'number' ? body.order : count + 1,
      isActive: body.isActive !== false,
      showInNavbar,
    });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog category:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();

    // Toggle navbar status
    if (body.action === 'toggleNavbar' && body.id) {
      const category = await BlogCategory.findById(body.id);
      if (!category) {
        return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
      }
      const willBeInNavbar = !category.showInNavbar;
      if (willBeInNavbar) {
        const currentNavbarCount = await BlogCategory.countDocuments({
          showInNavbar: true,
          _id: { $ne: body.id },
        });
        if (currentNavbarCount >= 18) {
          return NextResponse.json(
            {
              success: false,
              message: 'Navbar me maximum 18 categories hi add ki ja sakti hain. Kripya pehle kisi category se "Show in Navbar" uncheck karein.',
            },
            { status: 400 }
          );
        }
      }
      category.showInNavbar = willBeInNavbar;
      await category.save();
      return NextResponse.json({
        success: true,
        data: category,
        message: willBeInNavbar ? 'Category Navbar me add kar di gayi' : 'Category Navbar se hata di gayi',
      });
    }

    // Reorder categories
    if (body.action === 'reorder' && Array.isArray(body.orders)) {
      const updates = body.orders.map((item: { id: string; order: number }) =>
        BlogCategory.findByIdAndUpdate(item.id, { order: item.order })
      );
      await Promise.all(updates);
      return NextResponse.json({ success: true, message: 'Categories reordered successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to update categories' }, { status: 500 });
  }
}
