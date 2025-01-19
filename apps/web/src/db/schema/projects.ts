import { boolean, integer, jsonb, pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { createdAt, updatedAt } from '@/utils/common-fields';

import { content } from './content';

export const projects = pgTable('projects', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  contentId: uuid()
    .notNull()
    .references(() => content.id, { onDelete: 'cascade' }),
  year: integer(),
  featured: boolean().default(false),
  details: jsonb(),
  createdAt,
  updatedAt,
});

export const projectsRelations = relations(projects, ({ one }) => ({
  content: one(content, {
    fields: [projects.contentId],
    references: [content.id],
  }),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
