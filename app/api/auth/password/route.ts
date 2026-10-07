import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import AdminUser from '@/lib/db/models/AdminUser';
import { getAuthUserId } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'Please provide current and new password' }, { status: 400 });
    }

    const admin = await AdminUser.findById(userId).select('+password');
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Incorrect current password' }, { status: 401 });
    }

    admin.password = newPassword; // Pre-save hook will hash it
    await admin.save();

    // Issue new token
    const token = admin.getSignedJwtToken();
    const expireDays = parseInt(process.env.JWT_EXPIRE || '30');

    const response = NextResponse.json({ success: true, message: 'Password updated successfully' });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expireDays * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
