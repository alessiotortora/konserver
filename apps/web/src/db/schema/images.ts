import { integer, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { createdAt, updatedAt } from '@/utils/common-fields';

import { events } from './events';
import { imagesToContent } from './images-to-content';
import { spaces } from './spaces';

export const images = pgTable('images', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  spaceId: uuid()
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  alt: varchar({ length: 256 }),
  publicId: varchar({ length: 512 }).notNull(),
  url: varchar({ length: 512 }).notNull(),
  resolution: jsonb(),
  format: varchar({ length: 256 }),
  bytes: integer(),
  createdAt,
  updatedAt,
});

export const imagesRelations = relations(images, ({ one, many }) => ({
  space: one(spaces, { fields: [images.spaceId], references: [spaces.id] }),
  content: many(imagesToContent),
  events: many(events),
}));

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
