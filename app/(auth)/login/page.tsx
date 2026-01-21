'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('Failed to sign in with Google');
      setIsGoogleLoading(false);
    }
  };

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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 bg-white text-[#1e3a3a] font-medium rounded-xl border border-[#e8e0d0] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5d8a6b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e8e0d0]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#f0ebe0] text-[#1e3a3a] opacity-70">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

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
