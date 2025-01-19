import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { content } from './content';
import { images } from './images';

export const imagesToContent = pgTable('images_to_content', {
  imageId: uuid()
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  contentId: uuid()
    .notNull()
    .references(() => content.id, { onDelete: 'cascade' }),
});

export const imagesToContentRelations = relations(
  imagesToContent,
  ({ one }) => ({
    image: one(images, {
      fields: [imagesToContent.imageId],
      references: [images.id],
    }),
    content: one(content, {
      fields: [imagesToContent.contentId],
      references: [content.id],
    }),
  }),
);

export type ImagesToContent = typeof imagesToContent.$inferSelect;
export type NewImagesToContent = typeof imagesToContent.$inferInsert;
