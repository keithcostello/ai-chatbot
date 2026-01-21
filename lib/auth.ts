/**
 * SKELETON AUTH CONFIG - TIER 0
 *
 * Purpose: Absolute minimum Google OAuth that works.
 *
 * Contains ONLY:
 * - Google provider
 * - JWT session strategy
 * - Redirect callback to /dashboard
 *
 * Does NOT contain:
 * - Credentials provider (removed for skeleton)
 * - Database operations in callbacks
 * - User creation logic (defer to later tier)
 */
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
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
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after OAuth
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
  },
});
