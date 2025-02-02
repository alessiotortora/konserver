import { integer, pgEnum, pgTable, real, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { createdAt, updatedAt } from '@/utils/common-fields';

import { spaces } from './spaces';
import { videosToContent } from './videos-to-content';

export const videoStatusEnum = pgEnum('video_status', ['processing', 'ready', 'failed']);

export const videos = pgTable('videos', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  spaceId: uuid()
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  filename: varchar({ length: 256 }).notNull(),
  alt: varchar({ length: 256 }),
  assetId: varchar({ length: 512 }),
  playbackId: varchar({ length: 512 }),
  status: videoStatusEnum().default('processing'),
  identifier: varchar({ length: 512 }).unique(),
  duration: real(),
  bytes: integer(),
  aspectRatio: varchar({ length: 16 }),
  createdAt,
  updatedAt,
});

export const videosRelations = relations(videos, ({ one, many }) => ({
  space: one(spaces, { fields: [videos.spaceId], references: [spaces.id] }),
  content: many(videosToContent),
}));

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
