import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';
import { getAuthUserId } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

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

async function saveUploadedFile(file: File): Promise<string> {
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
    if (body.originalPrice !== undefined) body.originalPrice = Number(body.originalPrice) || 0;
    if (body.discountedPrice !== undefined) body.discountedPrice = Number(body.discountedPrice) || 0;
    if (body.isTrending !== undefined) body.isTrending = String(body.isTrending) === 'true';
    if (body.hasOffer !== undefined) body.hasOffer = String(body.hasOffer) === 'true';
    if (body.isActive !== undefined) body.isActive = String(body.isActive) === 'true';

    const newPackage = await Package.create(body);

    return NextResponse.json({ success: true, data: newPackage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
