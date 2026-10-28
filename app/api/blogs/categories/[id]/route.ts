import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import BlogCategory from '@/lib/db/models/BlogCategory';
import Blog from '@/lib/db/models/Blog';
import { getAuthUserId } from '@/lib/auth';
import { slugifyText } from '@/lib/utils/blogUtils';

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

    const category = await BlogCategory.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    if (body.name) {
      category.name = String(body.name).trim();
    }
    if (body.slug) {
      const newSlug = slugifyText(body.slug);
      if (newSlug !== category.slug) {
        const conflict = await BlogCategory.findOne({ slug: newSlug, _id: { $ne: id } });
        if (conflict) {
          return NextResponse.json({ success: false, message: 'Category slug already in use.' }, { status: 400 });
        }
        category.slug = newSlug;
      }
    }
    if (body.heading !== undefined) {
      category.heading = String(body.heading).trim();
    }
    if (body.description !== undefined) {
      category.description = String(body.description).trim();
    }
    if (typeof body.order === 'number') {
      category.order = body.order;
    }
    if (body.isActive !== undefined) {
      category.isActive = Boolean(body.isActive);
    }
    if (body.showInNavbar !== undefined) {
      const willBeInNavbar = Boolean(body.showInNavbar);
      if (willBeInNavbar) {
        const currentNavbarCount = await BlogCategory.countDocuments({
          showInNavbar: true,
          _id: { $ne: id },
        });
        if (currentNavbarCount >= 18) {
          return NextResponse.json(
            {
              success: false,
              message: 'A maximum of 18 categories can be added to the Navbar. Please uncheck "Show in Navbar" on an existing category first.',
            },
            { status: 400 }
          );
        }
      }
      category.showInNavbar = willBeInNavbar;
    }
    if (Array.isArray(body.subcategories)) {
      category.subcategories = body.subcategories
        .map((sub: any) => ({
          name: String(sub.name || '').trim(),
          slug: slugifyText(sub.slug || sub.name),
          description: String(sub.description || '').trim(),
          isActive: sub.isActive !== false,
        }))
        .filter((s: any) => s.name && s.slug);
    }

    await category.save();

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update category' }, { status: 500 });
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
    const category = await BlogCategory.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    // Safety check: do not silently orphan articles
    const articleCount = await Blog.countDocuments({ categorySlug: category.slug });
    if (articleCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category: ${articleCount} article(s) are assigned to this category. Please reassign or archive those articles first.`,
        },
        { status: 400 }
      );
    }

    await BlogCategory.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
