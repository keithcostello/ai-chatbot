import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Force Node.js runtime
export const runtime = 'nodejs';

const SESSION_COOKIE_NAME = 'session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

    try {
      const { payload } = await jwtVerify(token, secret);

      // Return user from token payload
      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          displayName: payload.displayName,
        },
      });
    } catch {
      // Token invalid or expired
      return NextResponse.json(
        { error: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
      { status: 401 }
    );
  }
}
