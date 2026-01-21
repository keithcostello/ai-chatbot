'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch {
        // Not authenticated - that's fine
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4ed]">
        <div className="text-[#1e3a3a]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f4ed]">
      {/* Header with logout button for authenticated users */}
      {user && (
        <header className="w-full p-4 flex justify-end">
          <div className="flex items-center gap-4">
            <span className="text-[#1e3a3a]">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#2d4a3e] text-[#f8f4ed] font-medium rounded-lg hover:bg-[#1e3a3a] transition-colors"
            >
              Log Out
            </button>
          </div>
        </header>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/profile_image.jpg"
              alt="SteerTrue Logo"
              width={120}
              height={120}
              className="mx-auto rounded-full"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold text-[#1e3a3a] mb-4">SteerTrue</h1>

          {user ? (
            <>
              <p className="text-[#1e3a3a] mb-8">
                Welcome back, {user.displayName || user.email}!
              </p>
              <p className="text-[#5d8a6b] text-lg">
                Dashboard coming soon...
              </p>
            </>
          ) : (
            <>
              <p className="text-[#1e3a3a] mb-8">SteerTrue, Stay True.</p>
              <div className="space-x-4">
                <Link
                  href="/signup"
                  className="inline-block px-6 py-3 bg-[#5d8a6b] text-[#f8f4ed] font-medium rounded-xl hover:bg-[#4a7559] transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 border border-[#5d8a6b] text-[#5d8a6b] font-medium rounded-xl hover:bg-[#5d8a6b] hover:text-[#f8f4ed] transition-colors"
                >
                  Log In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
