import type { InferSelectModel } from 'drizzle-orm';
import type { content, images, imagesToContent, projects, videos, videosToContent } from '.';

export type Image = InferSelectModel<typeof images>;
export type Video = InferSelectModel<typeof videos>;
export type Content = InferSelectModel<typeof content>;
export type Project = InferSelectModel<typeof projects>;
export type ImageToContent = InferSelectModel<typeof imagesToContent>;
export type VideoToContent = InferSelectModel<typeof videosToContent>;

export type ProjectWithContent = Project & {
  content: Content & {
    coverImage?: Image | null;
    coverVideo?: Video | null;
  };
  images?: Image[];
  videos?: Video[];
};
