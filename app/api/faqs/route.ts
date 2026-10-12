import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Faq from '@/lib/db/models/Faq';
import { getAuthUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const LEGITIMATE_DEFAULT_FAQS = [
  {
    question: 'How do I book a travel package?',
    answer: 'You can book a package by reviewing your preferred destination or package details, and submitting an inquiry. Our travel specialist will connect with you to personalize your itinerary and payment plan.',
    category: 'Booking',
    position: 0,
    isActive: true,
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit/debit cards, UPI, and bank transfers. All payments are processed through secure payment channels with official invoices provided.',
    category: 'Payment',
    position: 1,
    isActive: true,
  },
  {
    question: 'Can I customize my travel package?',
    answer: 'Yes! We offer complete customization. You can modify the itinerary, duration, hotel category, and sightseeing activities according to your preferences.',
    category: 'Customization',
    position: 2,
    isActive: true,
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation terms depend on airline, hotel, and local ground provider policies. Exact cancellation terms and schedules are specified in your customized itinerary quotation before payment.',
    category: 'Policy',
    position: 3,
    isActive: true,
  },
  {
    question: 'Do you provide visa assistance?',
    answer: 'Yes, we provide visa guidance and documentation assistance for international holiday destinations and Kailash Mansarovar Yatra permits.',
    category: 'Documentation',
    position: 4,
    isActive: true,
  },
  {
    question: 'Is travel insurance included in packages?',
    answer: 'Travel insurance is available as an optional add-on for domestic and international itineraries. We recommend securing travel insurance prior to departure.',
    category: 'Insurance',
    position: 5,
    isActive: true,
  },
  {
    question: 'What happens if there is a flight delay or schedule change?',
    answer: 'In case of flight delays or schedule adjustments, our concierge team coordinates with local ground transportation to realign your pickup and itinerary seamlessly where feasible.',
    category: 'Support',
    position: 6,
    isActive: true,
  },
  {
    question: 'Can I make group or family bookings?',
    answer: 'Absolutely. We specialize in customized family trips, couple getaways, and spiritual group yatras with vehicle sizes tailored to your group requirement.',
    category: 'Groups',
    position: 7,
    isActive: true,
  },
];

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const count = await Faq.countDocuments();
    if (count === 0) {
      await Faq.insertMany(LEGITIMATE_DEFAULT_FAQS);
    }

    const filter = activeOnly ? { isActive: { $ne: false } } : {};
    const faqs = await Faq.find(filter).sort({ position: 1, createdAt: 1 }).lean();

    return NextResponse.json({ success: true, count: faqs.length, data: faqs });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.question || String(body.question).trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Question must be at least 5 characters long.' },
        { status: 400 }
      );
    }

    if (!body.answer || String(body.answer).trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Answer must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    if (body.position === undefined) {
      const count = await Faq.countDocuments();
      body.position = count;
    }

    const newFaq = await Faq.create({
      question: String(body.question).trim(),
      answer: String(body.answer).trim(),
      category: body.category ? String(body.category).trim() : 'General',
      position: Number(body.position) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json({ success: true, data: newFaq }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();

    // Batch reorder support
    if (body.action === 'reorder' && Array.isArray(body.orders)) {
      const updatePromises = body.orders.map((item: { id: string; position: number }) =>
        Faq.findByIdAndUpdate(item.id, { position: item.position })
      );
      await Promise.all(updatePromises);
      return NextResponse.json({ success: true, message: 'FAQs reordered successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
