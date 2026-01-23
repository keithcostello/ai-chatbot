/**
 * Conversations API
 *
 * GET /api/conversations - List user's conversations
 * POST /api/conversations - Create new conversation
 *
 * Per CONTEXT.md Section 4 lines 324-359
 */

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { conversations } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/conversations
 * Returns list of conversations for authenticated user
 */
export async function GET() {
  // Verify authentication
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated', code: 'NOT_AUTHENTICATED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get user's conversations ordered by most recent
    const userConversations = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .where(eq(conversations.userId, session.user.id))
      .orderBy(desc(conversations.updatedAt));

    return new Response(
      JSON.stringify({
        conversations: userConversations.map(c => ({
          id: c.id,
          title: c.title,
          createdAt: c.createdAt?.toISOString(),
          updatedAt: c.updatedAt?.toISOString(),
        })),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Conversations API] GET error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /api/conversations
 * Creates a new conversation for authenticated user
 */
export async function POST(req: NextRequest) {
  // Verify authentication
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated', code: 'NOT_AUTHENTICATED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body (title is optional)
    let title = 'New Conversation';
    try {
      const body = await req.json();
      if (body.title && typeof body.title === 'string') {
        title = body.title;
      }
    } catch {
      // Empty body is fine, use default title
    }

    // Create new conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        userId: session.user.id,
        title: title,
      })
      .returning({
        id: conversations.id,
        title: conversations.title,
        createdAt: conversations.createdAt,
      });

    console.log('[Conversations API] Created conversation:', newConversation.id);

    return new Response(
      JSON.stringify({
        id: newConversation.id,
        title: newConversation.title,
        createdAt: newConversation.createdAt?.toISOString(),
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Conversations API] POST error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
