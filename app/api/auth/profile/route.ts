import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import AdminUser from '@/lib/db/models/AdminUser';
import { getAuthUserId } from '@/lib/auth';

export async function PUT(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();

    // Isolated validation: validate whatsapp/phone only if provided in update payload
    if (body.whatsapp !== undefined && body.whatsapp !== null && body.whatsapp !== '') {
      const cleanWa = String(body.whatsapp).replace(/[\s\-()]/g, '');
      if (!/^\+?[1-9]\d{9,14}$/.test(cleanWa)) {
        return NextResponse.json(
          { success: false, message: 'Invalid WhatsApp number format. Please provide a valid 10 digit phone number (e.g. +91 7289037447 or 7289037447).' },
          { status: 400 }
        );
      }
    }

    if (body.phone !== undefined && body.phone !== null && body.phone !== '') {
      const cleanPhone = String(body.phone).replace(/[\s\-()]/g, '');
      if (!/^\+?[1-9]\d{9,14}$/.test(cleanPhone)) {
        return NextResponse.json(
          { success: false, message: 'Invalid phone number format. Please provide a valid 10 digit phone number.' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await AdminUser.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      agent: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
