import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

// Force Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';

// Session cookie configuration - security flags per OWASP
const SESSION_COOKIE_NAME = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      // Generic error - no user enumeration (OWASP guidance)
      return NextResponse.json(
        { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Find user by email (case-insensitive)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // User not found - return GENERIC error (no user enumeration per SC-5)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.passwordHash);

    // Invalid password - return SAME GENERIC error (no user enumeration per SC-5)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Set session cookie with security flags (SC-6)
    // HttpOnly: Prevents XSS access to cookie
    // Secure: Cookie only sent over HTTPS
    // SameSite=Strict: Prevents CSRF attacks
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    // Return user data (excluding sensitive fields)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    // Generic error message - no information leakage
    return NextResponse.json(
      { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      { status: 401 }
    );
  }
}
