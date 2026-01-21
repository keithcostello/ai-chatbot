'use client';

/**
 * SessionProvider wrapper for Auth.js
 *
 * Required for useSession() to work in client components.
 * Must be a client component (hence 'use client' directive).
 */

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
