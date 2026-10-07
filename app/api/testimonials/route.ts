import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Testimonial from '@/lib/db/models/Testimonial';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    let testimonials = await Testimonial.find({}).sort({ position: 1, createdAt: -1 });
    
    if (testimonials.length === 0) {
      const defaultTestimonials = [
        { customerName: 'Priya Sharma', destination: 'Maldives', rating: 5, review: 'The trip was perfectly organized! From the water villa in Maldives to seamless airport transfers, everything was 10/10. Highly recommended!', position: 1 },
        { customerName: 'Rahul & Ananya', destination: 'Switzerland & Paris', rating: 5, review: 'Our honeymoon was pure magic. Custom itinerary, top-notch hotels, and 24/7 support whenever we had questions. Will book all our future trips here.', position: 2 },
        { customerName: 'Vikram Malhotra', destination: 'Dubai', rating: 5, review: 'Best travel agency experience ever. Got us amazing deals on desert safari and Burj Khalifa tickets. Super professional and responsive team.', position: 3 },
      ];
      await Testimonial.insertMany(defaultTestimonials);
      testimonials = await Testimonial.find({}).sort({ position: 1, createdAt: -1 });
    }
    
    return NextResponse.json({ success: true, count: testimonials.length, data: testimonials });
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
      const count = await Testimonial.countDocuments();
      body.position = count;
    }

    const newTestimonial = await Testimonial.create(body);

    return NextResponse.json({ success: true, data: newTestimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
