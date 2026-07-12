import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/about', '/services', '/blog', '/faq', '/contact', '/book', '/testimonials', '/privacy', '/terms', '/login'];
const portalRoutes = ['/portal'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  // Public routes - always allow
  if (publicRoutes.includes(pathname) || pathname.startsWith('/blog/') || pathname === '/not-found') {
    return NextResponse.next();
  }

  // Login page - redirect to dashboard if already authenticated
  if (pathname === '/login') {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Dashboard routes - require authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/appointments') || pathname.startsWith('/clients') || pathname.startsWith('/blogs') || pathname.startsWith('/faqs') || pathname.startsWith('/payments') || pathname.startsWith('/calendar') || pathname.startsWith('/notifications') || pathname.startsWith('/analytics') || pathname.startsWith('/audit-logs')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Portal routes - require authentication
  if (portalRoutes.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};