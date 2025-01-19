import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { createdAt, updatedAt } from '@/utils/common-fields';

import { users } from './users';

export const socialLinks = pgTable('social_links', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid()
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  twitter: varchar({ length: 256 }),
  github: varchar({ length: 256 }),
  instagram: varchar({ length: 256 }),
  linkedin: varchar({ length: 256 }),
  website: varchar({ length: 256 }),
  other: varchar({ length: 256 }),
  createdAt,
  updatedAt,
});

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  user: one(users, { fields: [socialLinks.userId], references: [users.id] }),
}));

export type SocialLinks = typeof socialLinks.$inferSelect;
export type NewSocialLinks = typeof socialLinks.$inferInsert;
