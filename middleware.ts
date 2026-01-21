/**
 * SKELETON MIDDLEWARE - TIER 0
 *
 * Purpose: Minimal route protection.
 *
 * Public routes: /, /login, /signup, /api/auth, /api/health
 * Protected routes: /dashboard (and everything else)
 *
 * Uses auth() from auth.config.ts
 */
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/api/auth', '/api/health'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Session available on req.auth (Auth.js v5)
  const isAuthenticated = !!req.auth;

  // Authenticated users on login/signup -> redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Not authenticated on protected route -> redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
