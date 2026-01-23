/**
 * AUTH CONFIG - TIER 1
 *
 * Purpose: Google OAuth + Email/Password authentication
 *
 * Contains:
 * - Google provider (working from Tier 0)
 * - Credentials provider for email/password
 * - JWT session strategy
 * - Redirect callback to /dashboard
 *
 * Auth.js Pattern (per OAUTH_BEST_PRACTICES.md):
 * - Use signIn('google') for OAuth - Auth.js handles PKCE
 * - Use signIn('credentials') for email/password - creates compatible session
 */
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const result = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase()))
          .limit(1);

        if (result.length === 0) {
          // User not found
          return null;
        }

        const user = result[0];

        // Check if user has a password (not an OAuth-only user)
        if (!user.passwordHash || user.passwordHash === '') {
          // This is an OAuth-only user, they should use Google sign in
          return null;
        }

        // Verify password with bcrypt
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
          return null;
        }

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          name: user.displayName || user.email,
        };
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
    async signIn({ user, account }) {
      // For Google OAuth, ensure user exists in our database
      if (account?.provider === 'google') {
        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          if (existingUser.length === 0) {
            console.log(`[Auth] Creating new Google user: ${user.email}`);
            const [newUser] = await db
              .insert(users)
              .values({
                email: user.email!,
                displayName: user.name,
                // passwordHash defaults to '' for OAuth users (per schema)
              })
              .returning({ id: users.id });

            user.id = newUser.id;
            console.log(`[Auth] Google user created: ${newUser.id}`);
          } else {
            user.id = existingUser[0].id;
            console.log(`[Auth] Existing Google user found: ${existingUser[0].id}`);
          }
        } catch (error) {
          console.error(`[Auth] Failed to create/find Google user: ${user.email}`, error);
          return false; // Prevent login with broken state
        }
      }
      return true;
    },
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
    async jwt({ token, user }) {
      // Add user id to token on first sign in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to session from token
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
