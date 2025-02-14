'use server';

import { db } from '@/db';
import { content, imagesToContent, projects, videosToContent } from '@/db/schema';
import { type CreateProjectSchema, createProjectSchema } from '@/lib/schemas/project';
import { createClient } from '@/utils/supabase/client/server';
import { and, eq } from 'drizzle-orm';

export async function updateProject(
  spaceId: string,
  projectId: string,
  contentId: string,
  formData: CreateProjectSchema
) {
  try {
    const validatedFields = createProjectSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid form data',
      };
    }

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const {
      title,
      description,
      year,
      tags,
      details,
      status,
      cover,
      images = [],
      videos = [],
    } = validatedFields.data;

    // Update content
    await db
      .update(content)
      .set({
        title,
        description,
        tags,
        status,
        coverImageId: cover.type === 'image' ? cover.imageId : null,
        coverVideoId: cover.type === 'video' ? cover.videoId : null,
      })
      .where(and(eq(content.id, contentId), eq(content.spaceId, spaceId)));

    // Update project
    const [project] = await db
      .update(projects)
      .set({
        year,
        details,
      })
      .where(eq(projects.id, projectId))
      .returning();

    // Update images
    await db.delete(imagesToContent).where(eq(imagesToContent.contentId, contentId));
    if (images.length > 0) {
      await db.insert(imagesToContent).values(
        images.map((imageId) => ({
          contentId,
          imageId,
        }))
      );
    }

    // Update videos
    await db.delete(videosToContent).where(eq(videosToContent.contentId, contentId));
    if (videos.length > 0) {
      await db.insert(videosToContent).values(
        videos.map((videoId) => ({
          contentId,
          videoId,
        }))
      );
    }

    return { success: true, project };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      success: false,
      error: 'Failed to update project',
    };
  }
}
