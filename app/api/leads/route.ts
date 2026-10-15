import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Lead from '@/lib/db/models/Lead';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Protect route
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const leads = await Lead.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, count: leads.length, data: leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const sanitized: Record<string, any> = { ...body };

    // Map destination to toLocation
    if (sanitized.destination && !sanitized.toLocation) {
      sanitized.toLocation = sanitized.destination;
    }

    // Map passengers string (e.g., "1", "2", "3-5", "6+") to adults count
    if (sanitized.passengers && sanitized.adults === undefined) {
      if (sanitized.passengers === '3-5') sanitized.adults = 4;
      else if (sanitized.passengers === '6+') sanitized.adults = 6;
      else sanitized.adults = Number(sanitized.passengers) || 2;
    }

    // Source tracking has been completely removed

    if (sanitized.departureDate && typeof sanitized.departureDate === 'string') {
      const parsedDate = new Date(sanitized.departureDate);
      if (!isNaN(parsedDate.getTime())) {
        sanitized.departureDate = parsedDate;
      } else {
        delete sanitized.departureDate;
      }
    }

    if (sanitized.numberOfDays !== undefined && sanitized.numberOfDays !== '') {
      const num = Number(sanitized.numberOfDays);
      if (!isNaN(num)) sanitized.numberOfDays = num;
      else delete sanitized.numberOfDays;
    }

    if (sanitized.adults !== undefined) {
      const num = Number(sanitized.adults);
      sanitized.adults = !isNaN(num) ? num : 1;
    }

    if (sanitized.children !== undefined) {
      const num = Number(sanitized.children);
      sanitized.children = !isNaN(num) ? num : 0;
    }

    if (sanitized.budgetRupees !== undefined && sanitized.budgetRupees !== null && sanitized.budgetRupees !== '') {
      if (typeof sanitized.budgetRupees === 'string') {
        const trimmed = sanitized.budgetRupees.trim();
        // If it's pure integer digits without range symbols, store as number; otherwise preserve string intact
        if (/^\d+$/.test(trimmed)) {
          sanitized.budgetRupees = Number(trimmed);
        } else {
          sanitized.budgetRupees = trimmed;
        }
      }
    }

    if (sanitized.hotelBooked === 'yes') {
      sanitized.hotelType = '';
    }

    const newLead = await Lead.create(sanitized);

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

