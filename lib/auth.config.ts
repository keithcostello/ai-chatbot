// lib/auth.config.ts
// Edge-compatible auth configuration (NO Node.js-specific imports)
// This is used by middleware.ts which runs in Edge Runtime
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

// Edge-compatible auth config - NO bcrypt, NO database imports
// The actual credential verification happens in the full auth.ts via API routes
export const authConfig: NextAuthConfig = {
  providers: [
    // Google OAuth Provider - Edge compatible
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // Credentials provider shell - actual verification in auth.ts
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // This authorize is a placeholder - actual auth happens via /api/auth routes
      // which use the full auth.ts with Node.js runtime
      authorize: async () => {
        // Return null - middleware only checks session, not credentials
        // Actual credential verification happens in /api/auth/[...nextauth]/route.ts
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // JWT callback for Edge - just pass through
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'user';
      }
      return token;
    },
    // Session callback for Edge - just pass through
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
