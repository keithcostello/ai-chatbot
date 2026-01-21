'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
}

// Helper to check if session cookie exists (client-side)
function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('session='));
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Quick check: if no session cookie, redirect immediately (no API call needed)
      if (!hasSessionCookie()) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Not authenticated - redirect to login
          setAuthError('Session expired. Please log in again.');
          router.push('/login');
        }
      } catch {
        // Error checking auth - redirect to login
        setAuthError('Unable to verify authentication.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4ed]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d8a6b] mx-auto mb-4"></div>
          <p className="text-[#1e3a3a]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f4ed]">
      {/* Header */}
      <header className="w-full p-4 bg-[#2d4a3e] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/profile_image.jpg"
            alt="SteerTrue Logo"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <h1 className="text-xl font-bold text-[#f8f4ed]">SteerTrue</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#f8f4ed]">{user.displayName || user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#f8f4ed] text-[#2d4a3e] font-medium rounded-lg hover:bg-[#e8e0d0] transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1e3a3a] mb-6">Dashboard</h2>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#e8e0d0]">
            <h3 className="text-xl font-semibold text-[#1e3a3a] mb-4">
              Welcome, {user.displayName || user.email}!
            </h3>
            <p className="text-[#1e3a3a] mb-4">
              You are successfully logged in to SteerTrue.
            </p>
            <div className="bg-[#f0ebe0] rounded-lg p-4">
              <h4 className="font-medium text-[#1e3a3a] mb-2">Account Details</h4>
              <ul className="text-sm text-[#1e3a3a] space-y-1">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Role:</strong> {user.role}</li>
                {user.displayName && (
                  <li><strong>Display Name:</strong> {user.displayName}</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-[#5d8a6b] bg-opacity-10 rounded-xl p-6 border border-[#5d8a6b] border-opacity-20">
            <h3 className="text-lg font-semibold text-[#1e3a3a] mb-2">
              Coming Soon
            </h3>
            <p className="text-[#1e3a3a]">
              Chat features and AI coaching will be available here soon. Stay tuned!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
