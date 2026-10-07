import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import AdminUser from '@/lib/db/models/AdminUser';
import { sendEmail } from '@/lib/utils/email';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Please provide an email' }, { status: 400 });
    }

    const admin = await AdminUser.findOne({ email });
    
    if (!admin) {
      // Return 200 anyway for security (don't leak user existence)
      return NextResponse.json({ success: true, message: 'If an account exists, an OTP has been sent' });
    }

    // Generate 6 digit OTP
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before saving
    admin.resetPasswordOTP = crypto.createHash('sha256').update(resetOTP).digest('hex');
    admin.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await admin.save();

    // Send email
    const message = `You are receiving this email because you (or someone else) requested a password reset for your Shree Ananta Travels Admin account. \n\n Your OTP is: ${resetOTP} \n\n Valid for 10 minutes.`;

    try {
      await sendEmail({
        email: admin.email,
        subject: 'Password Reset OTP',
        message
      });

      return NextResponse.json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
      admin.resetPasswordOTP = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save();

      return NextResponse.json({ success: false, message: 'Email could not be sent' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
