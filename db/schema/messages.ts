// db/schema/messages.ts
import { pgTable, uuid, varchar, timestamp, text, jsonb, integer } from 'drizzle-orm/pg-core';
import { conversations } from './conversations';

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // 'user', 'assistant', 'system'
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  blocksInjected: jsonb('blocks_injected'),
  totalTokens: integer('total_tokens'),
});
