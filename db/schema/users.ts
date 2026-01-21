// schema/users.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  // passwordHash is empty string for OAuth users (Google, etc.)
  // NOT NULL constraint kept for backwards compatibility with existing users
  passwordHash: varchar('password_hash', { length: 255 }).notNull().default(''),
  role: varchar('role', { length: 20 }).default('user'),
  displayName: varchar('display_name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
