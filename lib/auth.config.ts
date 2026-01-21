/**
 * AUTH CONFIG - TIER 1 (Edge-compatible)
 *
 * Purpose: Edge-compatible config for middleware.
 *
 * Contains:
 * - Google provider
 * - Credentials provider definition (no authorize function - Edge compatible)
 * - JWT session strategy
 *
 * NOTE: This config is used by middleware which runs on Edge runtime.
 * The actual authorize() logic lives in lib/auth.ts (Node.js runtime).
 * Edge runtime cannot use bcrypt or database connections.
 */
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // Credentials provider definition for Edge compatibility
    // The actual authorize() function is in lib/auth.ts
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
};
