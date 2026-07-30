import { timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { real } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { bigint } from 'drizzle-orm/pg-core';
import { integer, text, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

const videoStatusEnum = pgEnum('video_status', [
  'PENDING',
  'PROCESSING',
  'SUCCESS',
  'FAILED',
]);

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

export const plan = pgTable(
  'plan',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    tier: text('tier').notNull(),
    price: integer('price').notNull(),
    currency: text('currency').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('plan_user_id_tier_idx').on(table.user_id, table.tier),
  ],
);

export const usage = pgTable(
  'usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: text('user_id').notNull(),
    storage_usage: bigint('storage_usage', { mode: 'number' }).default(0),
    storage_limit: bigint('storage_limit', { mode: 'number' }).default(0),
    minutes_streamed: bigint('minutes_streamed', { mode: 'number' }).default(0),
    minutes_streamed_limit: bigint('minutes_streamed_limit', {
      mode: 'number',
    }).default(0),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [uniqueIndex('usage_user_id_idx').on(table.user_id)],
);

export const video_metadata = pgTable('video_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  videoFileName: text('video_file_name').notNull(),
  videoContentType: text('video_content_type').notNull(),
  videoSize: bigint('video_size', { mode: 'number' }).notNull(),
  thumbnailFileName: text('thumbnail_file_name').notNull(),
  thumbnailContentType: text('thumbnail_content_type').notNull(),
  thumbnailSize: bigint('thumbnail_size', { mode: 'number' }).notNull(),
  videoDuration: real('video_duration').notNull(),
  timestamps: text('timestamps').default(''),
  tags: text('tags').array().notNull().default([]),
  playlist_id: uuid('playlist_id').references(() => playlist.id),
  generateSubtitle: boolean('generate_subtitle').default(false),
  includeWatermark: boolean('include_watermark').default(false),
  videoTracking_id: text('video_tracking_id'),
  thumbnailTracking_id: text('thumbnail_tracking_id'),
  status: videoStatusEnum('status').default('PENDING').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const pending_uploads = pgTable('pending_uploads', {
  id: uuid('id').primaryKey().defaultRandom(),
  video_id: uuid('video_id')
    .notNull()
    .references(() => video_metadata.id),
  videoSize: bigint('video_size', { mode: 'number' }).notNull(),
  started_at: timestamp('started_at', { withTimezone: true }).defaultNow(),
});

export const transcoding_metadata = pgTable('transcoding_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  video_id: uuid('video_id')
    .notNull()
    .references(() => video_metadata.id),
  fileCount: integer('file_count').default(0),
  resolution: text('resolution').array().default([]).notNull(),
  totalSizeBytes: bigint('total_size_bytes', { mode: 'number' }).default(0),
  status: videoStatusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
