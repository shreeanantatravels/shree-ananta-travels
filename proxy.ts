import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // If accessing /admin path (but not /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // We don't verify JWT here because Edge runtime doesn't support jsonwebtoken easily.
    // Full verification happens in API routes and server actions.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
