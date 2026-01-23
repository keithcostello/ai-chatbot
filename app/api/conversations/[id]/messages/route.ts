/**
 * Messages API
 *
 * GET /api/conversations/{id}/messages - Get messages for conversation
 * POST /api/conversations/{id}/messages - Save message to conversation
 *
 * Per CONTEXT.md Section 4 lines 362-385
 * Authorization check per DevOps F7 Fix (lines 416-430)
 */

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

/**
 * GET /api/conversations/{id}/messages
 * Returns messages for a conversation (with authorization check)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify authentication
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated', code: 'NOT_AUTHENTICATED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id: conversationId } = await params;

  try {
    // Authorization check per DevOps F7 Fix
    // Verify conversation exists AND belongs to user
    const conversation = await db
      .select({ id: conversations.id, userId: conversations.userId })
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    // Return 404 (not 403) to prevent enumeration - per DevOps F7 Fix
    if (!conversation[0] || conversation[0].userId !== session.user.id) {
      return new Response(
        JSON.stringify({ error: 'Conversation not found', code: 'NOT_FOUND' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get messages ordered by creation time
    const conversationMessages = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
        blocksInjected: messages.blocksInjected,
        totalTokens: messages.totalTokens,
      })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    return new Response(
      JSON.stringify({
        messages: conversationMessages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt?.toISOString(),
          blocksInjected: m.blocksInjected,
          totalTokens: m.totalTokens,
        })),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Messages API] GET error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /api/conversations/{id}/messages
 * Saves a new message to a conversation
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify authentication
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated', code: 'NOT_AUTHENTICATED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id: conversationId } = await params;

  try {
    // Parse request body
    const body = await req.json();
    const { role, content, blocksInjected, totalTokens } = body;

    // Validate required fields
    if (!role || !content) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: role, content',
          code: 'VALIDATION_ERROR',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate role
    if (!['user', 'assistant', 'system'].includes(role)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid role. Must be: user, assistant, or system',
          code: 'VALIDATION_ERROR',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authorization check - verify conversation belongs to user
    const conversation = await db
      .select({ id: conversations.id, userId: conversations.userId })
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation[0] || conversation[0].userId !== session.user.id) {
      return new Response(
        JSON.stringify({ error: 'Conversation not found', code: 'NOT_FOUND' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert message
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId: conversationId,
        role: role,
        content: content,
        blocksInjected: blocksInjected || null,
        totalTokens: totalTokens || null,
      })
      .returning({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
        blocksInjected: messages.blocksInjected,
        totalTokens: messages.totalTokens,
      });

    // Update conversation's updatedAt timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    console.log('[Messages API] Saved message:', newMessage.id, 'role:', role);

    return new Response(
      JSON.stringify({
        id: newMessage.id,
        role: newMessage.role,
        content: newMessage.content,
        createdAt: newMessage.createdAt?.toISOString(),
        blocksInjected: newMessage.blocksInjected,
        totalTokens: newMessage.totalTokens,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Messages API] POST error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
