'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // GENERIC error message - no user enumeration (SC-5)
        // Whether user doesn't exist OR password is wrong, show same message
        setError('Invalid credentials');
        return;
      }

      // Success - redirect to dashboard
      router.push('/');
      router.refresh(); // Refresh to update auth state
    } catch {
      // GENERIC error - no specific information
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-[#2d4a3e] flex-col justify-center items-center p-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#f8f4ed] mb-4">SteerTrue</h1>
          <p className="text-[#f8f4ed] text-lg opacity-90">
            Your AI-powered conversation partner
          </p>
        </div>
      </div>

      {/* Mobile Header - Branding */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#2d4a3e] p-4 z-10">
        <h1 className="text-xl font-bold text-[#f8f4ed] text-center">SteerTrue</h1>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 pt-20 md:pt-8 bg-[#f8f4ed]">
        <div className="w-full max-w-md">
          <div className="bg-[#f0ebe0] rounded-xl p-8 shadow-sm border border-[#e8e0d0]">
            <h2 className="text-2xl font-bold text-[#1e3a3a] mb-6 text-center">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#1e3a3a] mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#e8e0d0] bg-white text-[#1e3a3a] focus:outline-none focus:ring-2 focus:ring-[#5d8a6b] focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#1e3a3a] mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#e8e0d0] bg-white text-[#1e3a3a] focus:outline-none focus:ring-2 focus:ring-[#5d8a6b] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#5d8a6b] text-[#f8f4ed] font-medium rounded-xl hover:bg-[#4a7559] focus:outline-none focus:ring-2 focus:ring-[#5d8a6b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#1e3a3a]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#5d8a6b] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
