import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import { slugifyPackage, ensureUniquePackageSlug } from '@/lib/utils/packageUtils';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get('slug') || '';
    const excludeId = searchParams.get('excludeId') || undefined;

    const normalizedSlug = slugifyPackage(rawSlug);

    if (!normalizedSlug) {
      return NextResponse.json({
        available: false,
        slug: '',
        message: 'Slug cannot be empty.',
      });
    }

    const query: any = {
      $or: [{ slug: normalizedSlug }, { redirectFromSlugs: normalizedSlug }],
    };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Package.findOne(query).select('_id title slug').lean();

    if (existing) {
      const suggestedSlug = await ensureUniquePackageSlug(normalizedSlug, excludeId);
      return NextResponse.json({
        available: false,
        slug: normalizedSlug,
        suggestedSlug,
        message: `The slug "${normalizedSlug}" is already in use by "${(existing as any).title}".`,
      });
    }

    return NextResponse.json({
      available: true,
      slug: normalizedSlug,
      message: 'Slug is available.',
    });
  } catch (error: any) {
    return NextResponse.json({ available: false, message: error.message }, { status: 500 });
  }
}
