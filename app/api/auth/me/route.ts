import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import AdminUser from '@/lib/db/models/AdminUser';
import { getAuthUserId } from '@/lib/auth';

import SiteConfig from '@/lib/db/models/SiteConfig';

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

    if (!admin.whatsapp) {
      const siteConfig = await SiteConfig.findOne({ _singleton: true }).select('contactPhone').lean();
      if (siteConfig?.contactPhone) {
        admin.whatsapp = siteConfig.contactPhone;
        await AdminUser.findByIdAndUpdate(userId, { $set: { whatsapp: siteConfig.contactPhone } });
      }
    }

    return NextResponse.json({ success: true, data: admin, agent: admin });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
