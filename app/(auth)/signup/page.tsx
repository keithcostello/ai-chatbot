'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
