import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import AdminUser from '@/lib/db/models/AdminUser';
import { getAuthUserId } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const admin = await AdminUser.findById(userId);
    
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: admin, agent: admin });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
