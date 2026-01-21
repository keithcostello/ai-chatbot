import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // Credentials Provider (email/password)
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) {
          // Generic error - no user enumeration
          return null;
        }

        // Check if user signed up with OAuth (no password set)
        if (!user.passwordHash) {
          // User exists but signed up with OAuth, not credentials
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          // Generic error - no user enumeration
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          role: user.role,
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
    async redirect({ url, baseUrl }) {
      // After OAuth, redirect to dashboard by default
      // If callbackUrl was specified in signIn(), use that
      // But ensure we don't redirect to external URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default fallback - redirect to dashboard for authenticated users
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        if (!user.email) {
          return false;
        }

        // Check if user already exists
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (!existingUser) {
          // Create new user for Google OAuth
          const [newUser] = await db
            .insert(users)
            .values({
              email: user.email,
              passwordHash: '', // Empty string for OAuth users (no password)
              displayName: user.name || null,
              avatarUrl: user.image || null,
              role: 'user',
            })
            .returning();

          // Update user object with database ID
          user.id = newUser.id;
        } else {
          // User exists - use their existing ID
          user.id = existingUser.id;
          // Optionally update display name and avatar if not set
          if (!existingUser.displayName && user.name) {
            await db
              .update(users)
              .set({
                displayName: user.name,
                avatarUrl: user.image || existingUser.avatarUrl,
                updatedAt: new Date(),
              })
              .where(eq(users.id, existingUser.id));
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'user';
      }
      // For OAuth, fetch role from database
      if (account?.provider === 'google' && token.email) {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email as string))
          .limit(1);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
