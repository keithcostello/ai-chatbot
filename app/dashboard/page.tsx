'use client';

/**
 * SKELETON DASHBOARD - TIER 0
 *
 * Purpose: Prove session works after Google OAuth.
 *
 * Contains ONLY:
 * - useSession() from next-auth/react
 * - Display session.user.email
 * - Display session.user.name
 * - Logout button using signOut()
 *
 * Does NOT contain:
 * - Custom API calls
 * - hasSessionCookie() checks
 * - Complex state management
 * - Custom /api/auth/me endpoint usage
 */

import { useSession, signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Loading state
  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated - middleware should redirect, but fallback just in case
  if (status === 'unauthenticated' || !session) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Not authenticated. Redirecting...</p>
      </div>
    );
  }

  // Authenticated - show session info
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
      <h1 style={{ marginBottom: '1rem', color: '#333' }}>Dashboard</h1>
      <p style={{ marginBottom: '0.5rem', color: '#666' }}>Skeleton - Tier 0</p>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '1rem',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '0.5rem', color: '#333' }}>
          <strong>Email:</strong> {session.user?.email || 'No email'}
        </p>
        <p style={{ marginBottom: '1.5rem', color: '#333' }}>
          <strong>Name:</strong> {session.user?.name || 'No name'}
        </p>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      <p style={{ marginTop: '2rem', color: '#999', fontSize: '12px' }}>
        Session verified via Auth.js useSession()
      </p>
    </div>
  );
}
