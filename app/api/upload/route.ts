import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine Cloudinary folder
    let folder = 'ananda-travel/general';
    if (type === 'logo') {
      folder = 'ananda-travel/logos';
    } else if (type === 'package') {
      const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
      if (!isWebp) {
        return NextResponse.json({ success: false, message: 'Only WebP (.webp) images are allowed for packages.' }, { status: 400 });
      }
      folder = 'ananda-travel/packages';
    }

    // Upload to Cloudinary
    const fileUrl = await uploadImageToCloudinary(buffer, folder);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Upload failed' }, { status: 500 });
  }
}
