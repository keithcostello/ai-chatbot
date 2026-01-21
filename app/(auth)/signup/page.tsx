'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('Failed to sign up with Google');
      setIsGoogleLoading(false);
    }
  };

  // Client-side validation
  const validateForm = (): string | null => {
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    // Password minimum length (8 chars)
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    // Password confirmation match
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      setSuccess(true);
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch {
      setError('An error occurred. Please try again.');
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
              Create Account
            </h2>

            {success ? (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
                  Account created successfully!
                </div>
                <Link
                  href="/login"
                  className="text-[#5d8a6b] hover:underline font-medium"
                >
                  Continue to login
                </Link>
              </div>
            ) : (
              <>
                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  className="w-full py-3 px-4 bg-white text-[#1e3a3a] font-medium rounded-xl border border-[#e8e0d0] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5d8a6b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {isGoogleLoading ? 'Connecting...' : 'Sign up with Google'}
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
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#1e3a3a] mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#e8e0d0] bg-white text-[#1e3a3a] focus:outline-none focus:ring-2 focus:ring-[#5d8a6b] focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#5d8a6b] text-[#f8f4ed] font-medium rounded-xl hover:bg-[#4a7559] focus:outline-none focus:ring-2 focus:ring-[#5d8a6b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
              </>
            )}

            <p className="mt-6 text-center text-sm text-[#1e3a3a]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#5d8a6b] hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
