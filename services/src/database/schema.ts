import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const api_key = pgTable('api_key', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: text('user_id').notNull(),
  prefix: text('prefix').notNull(),
  value: text('value').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_used_at: timestamp('last_used_at').defaultNow(),
  revoked_at: timestamp('revoked_at'),
});
