import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import { getAuthUserId } from '@/lib/auth';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/cloudinary';
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

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    let pkg: any = null;
    if (mongoose.isValidObjectId(id)) {
      pkg = await Package.findById(id);
    }
    if (!pkg) {
      pkg = await Package.findOne({
        $or: [{ slug: id }, { redirectFromSlugs: id }],
      });
    }
    
    if (!pkg) {
      return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pkg });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    // Protect route
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const oldPackage = await Package.findById(id);
    if (!oldPackage) {
      return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
    }

    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();

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
            if (key === 'image1') {
              body.imageUrl1 = uploadedUrl;
              if (oldPackage.imageUrl1) await deleteImageFromCloudinary(oldPackage.imageUrl1);
            }
            else if (key === 'image2') {
              body.imageUrl2 = uploadedUrl;
              if (oldPackage.imageUrl2) await deleteImageFromCloudinary(oldPackage.imageUrl2);
            }
            else if (key === 'image3') {
              body.imageUrl3 = uploadedUrl;
              if (oldPackage.imageUrl3) await deleteImageFromCloudinary(oldPackage.imageUrl3);
            }
            else if (key === 'image4') {
              body.imageUrl4 = uploadedUrl;
              if (oldPackage.imageUrl4) await deleteImageFromCloudinary(oldPackage.imageUrl4);
            }
          }
        } else {
          body[key] = value;
        }
      }
    } else {
      body = await req.json();
    }
      
    // Handle image URL updates and deletions for imageUrl1..imageUrl4
    const handleImageFieldUpdate = async (field: 'imageUrl1' | 'imageUrl2' | 'imageUrl3' | 'imageUrl4') => {
      if (body[field] !== undefined) {
        const val = typeof body[field] === 'string' ? body[field].trim() : '';
        if (!val) {
          if (oldPackage[field]) await deleteImageFromCloudinary(oldPackage[field]);
          body[field] = null;
        } else if (val !== (oldPackage[field] || '')) {
          if (oldPackage[field] && oldPackage[field] !== val) {
            await deleteImageFromCloudinary(oldPackage[field]);
          }
          body[field] = val;
        }
      }
    };

    await handleImageFieldUpdate('imageUrl1');
    await handleImageFieldUpdate('imageUrl2');
    await handleImageFieldUpdate('imageUrl3');
    await handleImageFieldUpdate('imageUrl4');

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

    // Handle slug update and redirect preservation
    if (body.slug !== undefined) {
      const newSlug = slugifyPackage(body.slug);
      if (newSlug && newSlug !== oldPackage.slug) {
        // Validate uniqueness excluding this document
        const existingWithSlug = await Package.findOne({
          $or: [{ slug: newSlug }, { redirectFromSlugs: newSlug }],
          _id: { $ne: id },
        }).lean();

        if (existingWithSlug) {
          return NextResponse.json(
            {
              success: false,
              message: `The slug "${newSlug}" is already in use by another package. Please choose a unique slug.`,
            },
            { status: 400 }
          );
        }

        // Preserve old slug in redirectFromSlugs
        const oldRedirects = Array.isArray(oldPackage.redirectFromSlugs) ? oldPackage.redirectFromSlugs : [];
        const updatedRedirects = new Set(oldRedirects);
        if (oldPackage.slug) {
          updatedRedirects.add(oldPackage.slug);
        }
        updatedRedirects.delete(newSlug);
        body.redirectFromSlugs = Array.from(updatedRedirects);
        body.slug = newSlug;
      } else if (!newSlug && !oldPackage.slug) {
        body.slug = await ensureUniquePackageSlug(slugifyPackage(body.title || oldPackage.title), id);
      }
    }

    // Handle tags
    if (body.tags !== undefined) {
      const parsedTags = safeParseJson(body.tags, []);
      body.tags = Array.isArray(parsedTags)
        ? parsedTags.map((t: any) => String(t).trim()).filter(Boolean)
        : [];
    }

    // Handle SEO
    if (body.seo !== undefined) {
      const seoData = safeParseJson(body.seo, {});
      const existingSeo = oldPackage.seo || {};
      body.seo = {
        title:
          seoData.title !== undefined
            ? seoData.title.trim()
            : existingSeo.title ||
              generatePackageSeoTitle(body.title || oldPackage.title, body.location || oldPackage.location),
        description:
          seoData.description !== undefined
            ? seoData.description.trim()
            : existingSeo.description ||
              generatePackageMetaDescription(
                body.title || oldPackage.title,
                body.location || oldPackage.location,
                body.duration || oldPackage.duration,
                body.description || oldPackage.description
              ),
        focusKeyword:
          seoData.focusKeyword !== undefined
            ? seoData.focusKeyword.trim()
            : existingSeo.focusKeyword ||
              generatePackageFocusKeyword(body.title || oldPackage.title, body.location || oldPackage.location),
        relatedKeywords:
          seoData.relatedKeywords !== undefined
            ? Array.isArray(seoData.relatedKeywords)
              ? seoData.relatedKeywords.map((k: any) => String(k).trim()).filter(Boolean)
              : typeof seoData.relatedKeywords === 'string'
              ? safeParseJson(seoData.relatedKeywords, [])
              : []
            : existingSeo.relatedKeywords ||
              generatePackageRelatedKeywords(
                body.title || oldPackage.title,
                body.location || oldPackage.location,
                body.category || oldPackage.category
              ),
      };
    }

    const updatedPackage = await Package.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedPackage });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    // Protect route
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const pkg = await Package.findById(id);
    if (!pkg) {
      return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
    }

    // Delete associated images from Cloudinary
    if (pkg.imageUrl1) await deleteImageFromCloudinary(pkg.imageUrl1);
    if (pkg.imageUrl2) await deleteImageFromCloudinary(pkg.imageUrl2);
    if (pkg.imageUrl3) await deleteImageFromCloudinary(pkg.imageUrl3);
    if (pkg.imageUrl4) await deleteImageFromCloudinary(pkg.imageUrl4);

    await Package.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
