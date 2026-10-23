import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import { getAuthUserId } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import {
  slugifyPackage,
  ensureUniquePackageSlug,
  generatePackageSeoTitle,
  generatePackageMetaDescription,
  generatePackageFocusKeyword,
  generatePackageRelatedKeywords,
} from '@/lib/utils/packageUtils';

const safeParseJson = (str: any, fallback: any = []) => {
  if (!str || typeof str !== 'string') return str || fallback;
  const trimmed = str.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (trimmed.includes('\n')) {
      return trimmed.split('\n').map(s => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
};

function isWebpFile(file: File): boolean {
  return file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
}

async function saveUploadedFile(file: File): Promise<string> {
  if (!isWebpFile(file)) {
    throw new Error(`Only WebP (.webp) images are allowed for packages.`);
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return await uploadImageToCloudinary(buffer, 'ananda-travel/packages');
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: any = {};

    // Apply optional filters
    if (searchParams.has('category')) filter.category = searchParams.get('category');
    if (searchParams.has('isActive')) filter.isActive = searchParams.get('isActive') === 'true';
    if (searchParams.has('isTrending')) filter.isTrending = searchParams.get('isTrending') === 'true';
    if (searchParams.has('packageType')) filter.packageType = searchParams.get('packageType');

    const packages = await Package.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, count: packages.length, data: packages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Protect route
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      body.agentId = userId;

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          if (value.name && value.size > 0) {
            if (!isWebpFile(value)) {
              return NextResponse.json(
                { success: false, message: `Only WebP (.webp) images are allowed for packages. File "${value.name}" is not WebP.` },
                { status: 400 }
              );
            }
            const uploadedUrl = await saveUploadedFile(value);
            if (key === 'image1') body.imageUrl1 = uploadedUrl;
            else if (key === 'image2') body.imageUrl2 = uploadedUrl;
            else if (key === 'image3') body.imageUrl3 = uploadedUrl;
            else if (key === 'image4') body.imageUrl4 = uploadedUrl;
          }
        } else {
          body[key] = value;
        }
      }
    } else {
      body = await req.json();
      body.agentId = userId;
    }

    if (body.itinerary) body.itinerary = safeParseJson(body.itinerary, []);
    if (body.badges) body.badges = safeParseJson(body.badges, []);
    if (body.inclusions) body.inclusions = safeParseJson(body.inclusions, []);
    if (body.exclusions) body.exclusions = safeParseJson(body.exclusions, []);
    if (body.termsAndConditions) body.termsAndConditions = safeParseJson(body.termsAndConditions, []);
    if (body.registrationSteps) body.registrationSteps = safeParseJson(body.registrationSteps, []);
    if (body.travelEssentials) body.travelEssentials = safeParseJson(body.travelEssentials, []);
    if (body.trustFeatures) body.trustFeatures = safeParseJson(body.trustFeatures, []);
    if (body.originalPrice !== undefined) body.originalPrice = Number(body.originalPrice) || 0;
    if (body.discountedPrice !== undefined) body.discountedPrice = Number(body.discountedPrice) || 0;
    if (body.isTrending !== undefined) body.isTrending = String(body.isTrending) === 'true';
    if (body.hasOffer !== undefined) body.hasOffer = String(body.hasOffer) === 'true';
    if (body.isActive !== undefined) body.isActive = String(body.isActive) === 'true';
    if (body.enableRouteMap !== undefined) body.enableRouteMap = String(body.enableRouteMap) === 'true';
    if (body.enableAltitude !== undefined) body.enableAltitude = String(body.enableAltitude) === 'true';

    // Handle slug
    let finalSlug = slugifyPackage(body.slug || '');
    if (!finalSlug) {
      finalSlug = await ensureUniquePackageSlug(slugifyPackage(body.title || 'package'));
    } else {
      const existingSlug = await Package.findOne({
        $or: [{ slug: finalSlug }, { redirectFromSlugs: finalSlug }],
      }).lean();
      if (existingSlug) {
        return NextResponse.json(
          {
            success: false,
            message: `The slug "${finalSlug}" is already in use. Please choose another unique slug.`,
          },
          { status: 400 }
        );
      }
    }
    body.slug = finalSlug;

    // Handle tags
    if (body.tags !== undefined) {
      const parsedTags = safeParseJson(body.tags, []);
      body.tags = Array.isArray(parsedTags)
        ? parsedTags.map((t: any) => String(t).trim()).filter(Boolean)
        : [];
    } else {
      body.tags = [];
    }

    // Handle SEO
    let seoData: any = {};
    if (body.seo) {
      seoData = safeParseJson(body.seo, {});
    }
    body.seo = {
      title: seoData.title?.trim() || generatePackageSeoTitle(body.title, body.location),
      description:
        seoData.description?.trim() ||
        generatePackageMetaDescription(body.title, body.location, body.duration, body.description),
      focusKeyword:
        seoData.focusKeyword?.trim() || generatePackageFocusKeyword(body.title, body.location),
      relatedKeywords: Array.isArray(seoData.relatedKeywords)
        ? seoData.relatedKeywords.map((k: any) => String(k).trim()).filter(Boolean)
        : typeof seoData.relatedKeywords === 'string'
        ? safeParseJson(seoData.relatedKeywords, [])
        : generatePackageRelatedKeywords(body.title, body.location, body.category),
    };

    const newPackage = await Package.create(body);

    return NextResponse.json({ success: true, data: newPackage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
