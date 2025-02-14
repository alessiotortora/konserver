'use server';

import { db } from '@/db';
import { content, imagesToContent, projects, videosToContent } from '@/db/schema';
import { type CreateProjectSchema, createProjectSchema } from '@/lib/schemas/project';
import { createClient } from '@/utils/supabase/client/server';

export async function createProject(spaceId: string, formData: CreateProjectSchema) {
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

    // Create content first
    const [contentEntry] = await db
      .insert(content)
      .values({
        spaceId,
        title,
        description,
        tags,
        status,
        contentType: 'project',
        coverImageId: cover.type === 'image' ? cover.imageId : null,
        coverVideoId: cover.type === 'video' ? cover.videoId : null,
      })
      .returning();

    // Then create project
    const [project] = await db
      .insert(projects)
      .values({
        contentId: contentEntry.id,
        year,
        details,
      })
      .returning();

    // Add images to content if any
    if (images.length > 0) {
      await db.insert(imagesToContent).values(
        images.map((imageId) => ({
          contentId: contentEntry.id,
          imageId,
        }))
      );
    }

    // Add videos to content if any
    if (videos.length > 0) {
      await db.insert(videosToContent).values(
        videos.map((videoId) => ({
          contentId: contentEntry.id,
          videoId,
        }))
      );
    }

    return { success: true, project };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      error: 'Failed to create project',
    };
  }
}
