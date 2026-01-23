/**
 * Message Persistence Service
 *
 * Provides functions for persisting messages to the database.
 * Used by SteerTrueAgent to save messages during chat flow.
 *
 * Per Phase 5 Requirements (PROMPT.md lines 389-403):
 * - Save user messages to messages table on send
 * - Save assistant messages to messages table on response
 * - Include blocks_injected and total_tokens in assistant messages
 * - Auto-create conversation if none exists
 */

import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface SaveMessageInput {
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  blocksInjected?: string[] | null;
  totalTokens?: number | null;
}

export interface SavedMessage {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: Date | null;
  blocksInjected: unknown;
  totalTokens: number | null;
}

/**
 * Create a new conversation for a user
 */
export async function createConversation(userId: string, title?: string): Promise<string> {
  const [newConversation] = await db
    .insert(conversations)
    .values({
      userId: userId,
      title: title || 'New Conversation',
    })
    .returning({ id: conversations.id });

  console.log('[Persistence] Created conversation:', newConversation.id);
  return newConversation.id;
}

/**
 * Get or create a conversation for a user
 * If conversationId is provided and valid, returns it
 * Otherwise creates a new conversation
 */
export async function getOrCreateConversation(
  userId: string,
  conversationId?: string | null
): Promise<string> {
  // If conversationId provided, verify it exists and belongs to user
  if (conversationId) {
    const existing = await db
      .select({ id: conversations.id, userId: conversations.userId })
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (existing[0] && existing[0].userId === userId) {
      return existing[0].id;
    }
    // If not found or not owned, create new
    console.log('[Persistence] Conversation not found or not owned, creating new');
  }

  // Create new conversation
  return createConversation(userId);
}

/**
 * Save a message to the database
 */
export async function saveMessage(input: SaveMessageInput): Promise<SavedMessage> {
  const [saved] = await db
    .insert(messages)
    .values({
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      blocksInjected: input.blocksInjected || null,
      totalTokens: input.totalTokens || null,
    })
    .returning({
      id: messages.id,
      conversationId: messages.conversationId,
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
    .where(eq(conversations.id, input.conversationId));

  console.log('[Persistence] Saved message:', saved.id, 'role:', input.role);
  return saved;
}

/**
 * Save user message (convenience wrapper)
 */
export async function saveUserMessage(
  conversationId: string,
  content: string
): Promise<SavedMessage> {
  return saveMessage({
    conversationId,
    role: 'user',
    content,
  });
}

/**
 * Save assistant message with governance metadata (convenience wrapper)
 */
export async function saveAssistantMessage(
  conversationId: string,
  content: string,
  blocksInjected?: string[],
  totalTokens?: number
): Promise<SavedMessage> {
  return saveMessage({
    conversationId,
    role: 'assistant',
    content,
    blocksInjected,
    totalTokens,
  });
}

/**
 * Load messages for a conversation
 */
export async function loadMessages(conversationId: string): Promise<SavedMessage[]> {
  const result = await db
    .select({
      id: messages.id,
      conversationId: messages.conversationId,
      role: messages.role,
      content: messages.content,
      createdAt: messages.createdAt,
      blocksInjected: messages.blocksInjected,
      totalTokens: messages.totalTokens,
    })
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  return result;
}
