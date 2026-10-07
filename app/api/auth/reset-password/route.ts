import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import AdminUser from '@/lib/db/models/AdminUser';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, message: 'Please provide email, OTP, and new password' }, { status: 400 });
    }

    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    const admin = await AdminUser.findOne({
      email,
      resetPasswordOTP: hashedOTP,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password');

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Set new password
    admin.password = newPassword;
    admin.resetPasswordOTP = undefined;
    admin.resetPasswordExpire = undefined;
    
    await admin.save();

    // Issue new token immediately
    const token = admin.getSignedJwtToken();
    const expireDays = parseInt(process.env.JWT_EXPIRE || '30');

    const response = NextResponse.json({ success: true, message: 'Password reset successful' });
    
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
