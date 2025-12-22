/**
 * Next.js Middleware
 * API rate limiting ve auth kontrolü
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CORS headers (development için)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Protect /admin routes - require ADMIN or SUPER_ADMIN role
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // Check if authenticated
    if (!token) {
      const adminLoginUrl = new URL('/admin/login', request.url);
      adminLoginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(adminLoginUrl);
    }

    // Check if user has admin role
    const userRole = token.role as string;
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // Redirect to access denied page or home
      const accessDeniedUrl = new URL('/admin/unauthorized', request.url);
      return NextResponse.redirect(accessDeniedUrl);
    }
  }

  // Protect /siparislerim (orders page) - require authentication
  if (request.nextUrl.pathname.startsWith('/siparislerim')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/siparislerim/:path*',
  ],
};
