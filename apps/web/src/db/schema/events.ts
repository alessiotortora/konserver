import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { createdAt, updatedAt } from '@/utils/common-fields';

import { images } from './images';
import { spaces } from './spaces';

export const eventTypeEnum = pgEnum('event_type', [
  'exhibition',
  'workshop',
  'conference',
  'meetup',
  'other',
]);
export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'scheduled',
  'ongoing',
  'completed',
  'canceled',
]);

export const events = pgTable('events', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  title: varchar({ length: 256 }),
  description: text(),
  startDate: timestamp().notNull(),
  endDate: timestamp(),
  location: varchar({ length: 256 }),
  client: varchar({ length: 256 }),
  link: varchar({ length: 512 }),
  type: eventTypeEnum().default('other'),
  status: eventStatusEnum().default('draft'),
  details: jsonb(),
  coverImageId: uuid().references(() => images.id, {
    onDelete: 'set null',
  }),
  spaceId: uuid()
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
});

export const eventsRelations = relations(events, ({ one }) => ({
  space: one(spaces, { fields: [events.spaceId], references: [spaces.id] }),
  coverImage: one(images, {
    fields: [events.coverImageId],
    references: [images.id],
  }),
}));

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
