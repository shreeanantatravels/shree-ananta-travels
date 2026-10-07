import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Lead from '@/lib/db/models/Lead';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const lead = await Lead.findById(id);
    
    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const body = await req.json();

    if (body.status === 'converted' && body.dealAmount !== undefined) {
      body.convertedAt = new Date();
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!updatedLead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
