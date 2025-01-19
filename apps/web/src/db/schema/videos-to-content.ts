import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { content } from './content';
import { videos } from './videos';

export const videosToContent = pgTable('videos_to_content', {
  videoId: uuid()
    .notNull()
    .references(() => videos.id, { onDelete: 'cascade' }),
  contentId: uuid()
    .notNull()
    .references(() => content.id, { onDelete: 'cascade' }),
});

export const videosToContentRelations = relations(
  videosToContent,
  ({ one }) => ({
    video: one(videos, {
      fields: [videosToContent.videoId],
      references: [videos.id],
    }),
    content: one(content, {
      fields: [videosToContent.contentId],
      references: [content.id],
    }),
  }),
);

export type VideosToContent = typeof videosToContent.$inferSelect;
export type NewVideosToContent = typeof videosToContent.$inferInsert;
