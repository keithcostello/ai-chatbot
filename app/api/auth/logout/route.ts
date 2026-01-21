import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Force Node.js runtime
export const runtime = 'nodejs';

const SESSION_COOKIE_NAME = 'session';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear session cookie by setting maxAge to 0
    // This effectively deletes the cookie
    cookieStore.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed', code: 'LOGOUT_ERROR' },
      { status: 500 }
    );
  }
}
