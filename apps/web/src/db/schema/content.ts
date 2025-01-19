import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { createdAt, updatedAt } from '@/utils/common-fields';

import { images } from './images';
import { imagesToContent } from './images-to-content';
import { spaces } from './spaces';
import { videos } from './videos';
import { videosToContent } from './videos-to-content';

export const contentTypeEnum = pgEnum('content_type', [
  'project',
  'blogPost',
]);

export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'published',
  'archived',
]);

export const content = pgTable('content', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  spaceId: uuid()
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  title: varchar({ length: 256 }),
  description: text(),
  contentType: contentTypeEnum().notNull().default('project'),
  tags: text().array(),
  status: contentStatusEnum().default('draft'),
  coverImageId: uuid().references(() => images.id, {
    onDelete: 'set null',
  }),
  coverVideoId: uuid().references(() => videos.id, {
    onDelete: 'set null',
  }),
  createdAt,
  updatedAt,
});

export const contentRelations = relations(content, ({ one, many }) => ({
  space: one(spaces, {
    fields: [content.spaceId],
    references: [spaces.id],
  }),
  coverImage: one(images, {
    fields: [content.coverImageId],
    references: [images.id],
  }),
  coverVideo: one(videos, {
    fields: [content.coverVideoId],
    references: [videos.id],
  }),
  imagesToContent: many(imagesToContent),
  videosToContent: many(videosToContent),
}));

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
