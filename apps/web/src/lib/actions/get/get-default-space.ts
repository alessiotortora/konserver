'use server';

import { db } from '@/db';
import { spaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getDefaultSpace(userId: string) {
  try {
    // Get the first space created by the user (which would be their default space)
    const [space] = await db
      .select()
      .from(spaces)
      .where(eq(spaces.userId, userId))
      .orderBy(spaces.createdAt)
      .limit(1);

    return { success: true, space };
  } catch (error) {
    console.error('Error getting default space:', error);
    return {
      success: false,
      error: 'Failed to get default space',
    };
  }
}
