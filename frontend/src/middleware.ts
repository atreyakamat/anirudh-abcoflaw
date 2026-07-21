import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = ['/', '/about', '/services', '/blog', '/faq', '/contact', '/book', '/testimonials', '/privacy', '/terms', '/login'];
const portalRoutes = ['/portal'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const { pathname } = request.nextUrl;

  // Public routes - always allow
  if (publicRoutes.includes(pathname) || pathname.startsWith('/blog/') || pathname === '/not-found') {
    return supabaseResponse;
  }

  // Login page - redirect to dashboard if already authenticated
  if (pathname === '/login') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return supabaseResponse;
  }

  // Dashboard routes - require authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/appointments') || pathname.startsWith('/clients') || pathname.startsWith('/blogs') || pathname.startsWith('/faqs') || pathname.startsWith('/payments') || pathname.startsWith('/calendar') || pathname.startsWith('/notifications') || pathname.startsWith('/analytics') || pathname.startsWith('/audit-logs')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return supabaseResponse;
  }

  // Portal routes - require authentication
  if (portalRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};