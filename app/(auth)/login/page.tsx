'use client';

/**
 * SKELETON LOGIN PAGE - TIER 0
 *
 * Purpose: Prove Google OAuth works with absolute minimum code.
 *
 * Contains ONLY:
 * - One button: "Sign in with Google"
 * - Auth.js signIn() call
 *
 * Does NOT contain:
 * - Email/password form
 * - Custom endpoints
 * - Error handling beyond basic
 * - Fancy UI
 *
 * SUCCESS CRITERIA:
 * - Click button → Google consent → see email on dashboard
 */

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

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
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>SteerTrue</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>Skeleton Login - Google OAuth Only</p>

      <button
        onClick={handleGoogleSignIn}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>

      <p style={{ marginTop: '2rem', color: '#999', fontSize: '12px' }}>
        Tier 0: Skeleton - No email/password, just OAuth
      </p>
    </div>
  );
}
