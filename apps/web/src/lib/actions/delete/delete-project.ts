'use server';

import { db } from '@/db';
import { content } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteProject(spaceId: string, contentId: string) {
  try {
    await db.delete(content).where(eq(content.id, contentId));

    // Revalidate the projects list page
    revalidatePath(`/dashboard/${spaceId}/projects`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}
