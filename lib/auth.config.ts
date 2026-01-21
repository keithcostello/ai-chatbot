/**
 * SKELETON AUTH CONFIG - TIER 0 (Edge-compatible)
 *
 * Purpose: Minimal Edge-compatible config for middleware.
 *
 * Contains ONLY:
 * - Google provider
 * - JWT session strategy
 *
 * Does NOT contain:
 * - Credentials provider
 * - Database imports
 * - bcrypt
 */
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
};
