'use server';

import { db } from '@/db';
import { spaces } from '@/db/schema';

export async function createDefaultSpace(userId: string) {
  try {
    const [space] = await db
      .insert(spaces)
      .values({
        name: 'My Space',
        userId,
        description: 'My personal space for managing content',
      })
      .returning();

    return { success: true, space };
  } catch (error) {
    console.error('Error creating default space:', error);
    return {
      success: false,
      error: 'Failed to create default space',
    };
  }
}
