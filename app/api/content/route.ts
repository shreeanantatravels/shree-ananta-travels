import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ContentSection from '@/lib/db/models/ContentSection';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: any = {};

    if (searchParams.has('sectionType')) filter.sectionType = searchParams.get('sectionType');
    if (searchParams.has('isActive')) filter.isActive = searchParams.get('isActive') === 'true';

    let sections = await ContentSection.find(filter).sort({ position: 1, createdAt: -1 });
    
    // Auto-seed if specific sections are empty
    if (sections.length === 0) {
      let seedData: any[] = [];
      const type = filter.sectionType;
      
      if (!type || type === 'travel_theme') {
        seedData.push(
          { sectionType: 'travel_theme', title: 'Beach & Islands', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', content: '🏖️', isActive: true, position: 1 },
          { sectionType: 'travel_theme', title: 'Adventure & Trekking', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', content: '🏔️', isActive: true, position: 2 },
          { sectionType: 'travel_theme', title: 'Heritage & Culture', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', content: '👑', isActive: true, position: 3 }
        );
      }
      
      if (!type || type === 'faq') {
        seedData.push(
          { sectionType: 'faq', title: 'How do I book a travel package?', content: 'You can book a package by clicking on the package card, reviewing the details, and clicking the "Book Now" button.', isActive: true, position: 1 },
          { sectionType: 'faq', title: 'What payment methods do you accept?', content: 'We accept all major credit/debit cards, UPI, net banking, and EMI options.', isActive: true, position: 2 },
          { sectionType: 'faq', title: 'Can I customize my travel package?', content: 'Yes! We offer complete customization. You can modify the itinerary, accommodation, and activities according to your preferences.', isActive: true, position: 3 }
        );
      }
      
      if (seedData.length > 0) {
        await ContentSection.insertMany(seedData);
        sections = await ContentSection.find(filter).sort({ position: 1, createdAt: -1 });
      }
    }
    
    return NextResponse.json({ success: true, count: sections.length, data: sections });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const body = await req.json();

    if (body.position === undefined) {
      const count = await ContentSection.countDocuments({ sectionType: body.sectionType });
      body.position = count;
    }

    const newSection = await ContentSection.create(body);

    return NextResponse.json({ success: true, data: newSection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
