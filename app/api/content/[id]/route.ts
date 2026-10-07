import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ContentSection from '@/lib/db/models/ContentSection';
import { getAuthUserId } from '@/lib/auth';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    const section = await ContentSection.findById(id);
    
    if (!section) {
      return NextResponse.json({ success: false, message: 'Content section not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: section });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const body = await req.json();

    const oldSection = await ContentSection.findById(id);
    if (!oldSection) {
      return NextResponse.json({ success: false, message: 'Content section not found' }, { status: 404 });
    }

    if (body.imageUrl !== undefined && body.imageUrl !== oldSection.imageUrl) {
      if (oldSection.imageUrl) await deleteImageFromCloudinary(oldSection.imageUrl);
    }

    const updatedSection = await ContentSection.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!updatedSection) {
      return NextResponse.json({ success: false, message: 'Content section not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSection });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const deletedSection = await ContentSection.findByIdAndDelete(id);

    if (!deletedSection) {
      return NextResponse.json({ success: false, message: 'Content section not found' }, { status: 404 });
    }

    if (deletedSection.imageUrl) {
      await deleteImageFromCloudinary(deletedSection.imageUrl);
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
