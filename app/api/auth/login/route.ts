import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import AdminUser from '@/lib/db/models/AdminUser';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide email and password' }, { status: 400 });
    }

    const admin = await AdminUser.findOne({ email }).select('+password');
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = admin.getSignedJwtToken();
    const expireDays = parseInt(process.env.JWT_EXPIRE || '30');

    const response = NextResponse.json({ success: true, data: { id: admin._id, name: admin.name, email: admin.email } });
    
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
