import { integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
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

export const playlist = pgTable('playlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: text('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description').default(''),
  limit: integer('playlist_limit').notNull().default(10),
  cover_image_url: text('cover_image_url').default(''),
  total_videos: integer('total_videos').notNull().default(0),
  total_duration: integer('total_duration').notNull().default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
