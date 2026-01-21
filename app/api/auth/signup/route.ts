import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

// Force Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';

// EXPLICIT: Salt rounds set to 10 per OWASP and CONTEXT.md requirements
const BCRYPT_SALT_ROUNDS = 10;

interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json();
    const { email, password, confirmPassword } = body;

    // Validate required fields
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Email, password, and confirm password are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate password length (min 8 chars)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // SERVER-SIDE password confirmation validation (SC-10)
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    // Hash password with bcrypt - EXPLICIT saltRounds: 10
    // This creates hash starting with $2b$10$ (proving 10 rounds)
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
      })
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        displayName: users.displayName,
        createdAt: users.createdAt,
      });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          displayName: newUser.displayName,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    // Generic error message - no information leakage
    return NextResponse.json(
      { error: 'An error occurred during signup', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
