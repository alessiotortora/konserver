'use server';

import { db } from '@/db';
import { content, images, imagesToContent, projects, videos, videosToContent } from '@/db/schema';
import type { ProjectWithContent } from '@/db/schema/types';
import { and, eq } from 'drizzle-orm';

export async function getProject(spaceId: string, projectId: string) {
  try {
    // First get the project with content
    const [projectWithContent] = await db
      .select()
      .from(projects)
      .innerJoin(content, eq(projects.contentId, content.id))
      .where(and(eq(content.spaceId, spaceId), eq(projects.id, projectId)));

    if (!projectWithContent) {
      return {
        success: false,
        error: 'Project not found',
      };
    }

    // Get cover image if exists
    const [coverImage] = projectWithContent.content.coverImageId
      ? await db.select().from(images).where(eq(images.id, projectWithContent.content.coverImageId))
      : [];

    // Get cover video if exists
    const [coverVideo] = projectWithContent.content.coverVideoId
      ? await db.select().from(videos).where(eq(videos.id, projectWithContent.content.coverVideoId))
      : [];

    // Get all images for this content
    const contentImages = await db
      .select()
      .from(imagesToContent)
      .innerJoin(images, eq(images.id, imagesToContent.imageId))
      .where(eq(imagesToContent.contentId, projectWithContent.content.id))
      .then((results) => results.map((r) => r.images));

    // Get all videos for this content
    const contentVideos = await db
      .select()
      .from(videosToContent)
      .innerJoin(videos, eq(videos.id, videosToContent.videoId))
      .where(eq(videosToContent.contentId, projectWithContent.content.id))
      .then((results) => results.map((r) => r.videos));

    const result: ProjectWithContent = {
      ...projectWithContent.projects,
      content: {
        ...projectWithContent.content,
        coverImage: coverImage || null,
        coverVideo: coverVideo || null,
      },
      images: contentImages,
      videos: contentVideos,
    };

    return { success: true, project: result };
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      success: false,
      error: 'Failed to fetch project',
    };
  }
}
