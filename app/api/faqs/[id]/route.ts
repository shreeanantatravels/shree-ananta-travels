import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Faq from '@/lib/db/models/Faq';
import { getAuthUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.question !== undefined) {
      if (String(body.question).trim().length < 5) {
        return NextResponse.json(
          { success: false, message: 'Question must be at least 5 characters long.' },
          { status: 400 }
        );
      }
      updateData.question = String(body.question).trim();
    }

    if (body.answer !== undefined) {
      if (String(body.answer).trim().length < 10) {
        return NextResponse.json(
          { success: false, message: 'Answer must be at least 10 characters long.' },
          { status: 400 }
        );
      }
      updateData.answer = String(body.answer).trim();
    }

    if (body.category !== undefined) {
      updateData.category = String(body.category).trim();
    }

    if (body.position !== undefined) {
      updateData.position = Number(body.position);
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      return NextResponse.json({ success: false, message: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedFaq });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const deletedFaq = await Faq.findByIdAndDelete(id);
    if (!deletedFaq) {
      return NextResponse.json({ success: false, message: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
