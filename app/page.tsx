/**
 * SKELETON HOME PAGE - TIER 0
 *
 * Purpose: Simple landing page with links.
 *
 * Contains ONLY:
 * - "Get Started" link -> /login
 * - "Log In" link -> /login
 *
 * Does NOT contain:
 * - Auth checks
 * - API calls
 * - useSession()
 * - Conditional rendering based on auth state
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ marginBottom: '1rem', color: '#333', fontSize: '2.5rem' }}>
        SteerTrue
      </h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Skeleton - Tier 0
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          href="/login"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4285F4',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Get Started
        </Link>
        <Link
          href="/login"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: 'transparent',
            color: '#4285F4',
            textDecoration: 'none',
            borderRadius: '4px',
            border: '1px solid #4285F4'
          }}
        >
          Log In
        </Link>
      </div>

      <p style={{ marginTop: '2rem', color: '#999', fontSize: '12px' }}>
        Google OAuth only - no email/password
      </p>
    </div>
  );
}
