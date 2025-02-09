'use server';

import { db } from '@/db';
import { content, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getProjects(spaceId: string) {
  try {
    const projectsList = await db
      .select({
        id: projects.id,
        contentId: content.id,
        year: projects.year,
        title: content.title,
        description: content.description,
        status: content.status,
        createdAt: content.createdAt,
      })
      .from(projects)
      .innerJoin(content, eq(projects.contentId, content.id))
      .where(eq(content.spaceId, spaceId));

    return { success: true, projects: projectsList };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      success: false,
      error: 'Failed to fetch projects',
    };
  }
}
