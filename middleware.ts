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

  // 🏛️ Protect /admin routes - Phase 2: SUPER_ADMIN or ADMIN role only
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // Check if authenticated
    if (!token) {
      const unauthorizedUrl = new URL('/auth/unauthorized', request.url);
      unauthorizedUrl.searchParams.set('reason', 'not-authenticated');
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Check if user has admin role
    const userRole = token.role as string;
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // Redirect to unauthorized page
      const unauthorizedUrl = new URL('/auth/unauthorized', request.url);
      unauthorizedUrl.searchParams.set('reason', 'insufficient-role');
      unauthorizedUrl.searchParams.set('requiredRole', 'SUPER_ADMIN|ADMIN');
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Log admin access for security audit (Phase 2)
    console.log(`[ADMIN ACCESS] User ${token.email} (${userRole}) accessed ${request.nextUrl.pathname}`);
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
