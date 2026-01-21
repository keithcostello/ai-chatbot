import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

// Create auth instance with Edge-compatible config
// This does NOT import bcrypt or postgres (Node.js-only modules)
const { auth } = NextAuth(authConfig);

// Routes that don't require authentication
const publicRoutes = [
  '/',         // Home page - landing page for unauthenticated users
  '/login',
  '/signup',
  '/api/auth',  // All Auth.js routes - they handle their own security
  '/api/health',
];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/signup'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public API routes and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Session is available on req.auth (Auth.js v5 pattern)
  const isAuthenticated = !!req.auth;

  // If authenticated and trying to access auth routes, redirect to home
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If not authenticated and trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }
    // For pages, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
