import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true, data: {} });
  
  response.cookies.set('token', 'none', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10, // Expires in 10 seconds
    path: '/',
  });

  return response;
}
