'use server';

import { db } from '@/db';
import { content, images, projects, videos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getProjects(spaceId: string) {
  try {
    // First get all projects with content
    const projectsWithContent = await db
      .select({
        id: projects.id,
        year: projects.year,
        featured: projects.featured,
        details: projects.details,
        content: {
          id: content.id,
          title: content.title,
          description: content.description,
          tags: content.tags,
          status: content.status,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
          coverImageId: content.coverImageId,
          coverVideoId: content.coverVideoId,
        },
      })
      .from(projects)
      .innerJoin(content, eq(projects.contentId, content.id))
      .where(eq(content.spaceId, spaceId));

    // Get cover images and videos for all projects
    const projectsWithMedia = await Promise.all(
      projectsWithContent.map(async (project) => {
        // Get cover image if exists
        const [coverImage] = project.content.coverImageId
          ? await db
              .select({
                id: images.id,
                url: images.url,
                alt: images.alt,
              })
              .from(images)
              .where(eq(images.id, project.content.coverImageId))
          : [];

        // Get cover video if exists
        const [coverVideo] = project.content.coverVideoId
          ? await db
              .select({
                id: videos.id,
                playbackId: videos.playbackId,
                alt: videos.alt,
              })
              .from(videos)
              .where(eq(videos.id, project.content.coverVideoId))
          : [];

        return {
          ...project,
          content: {
            ...project.content,
            coverImage: coverImage || null,
            coverVideo: coverVideo || null,
          },
        };
      })
    );

    return { success: true, projects: projectsWithMedia };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      success: false,
      error: 'Failed to fetch projects',
    };
  }
}
