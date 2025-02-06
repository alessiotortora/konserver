'use server';

import { db } from '@/db';
import { images } from '@/db/schema';
import type { Image } from '@/db/schema/types';
import { desc, eq } from 'drizzle-orm';

interface SpaceImagesResult {
  success: boolean;
  images: Image[];
  error?: string;
}

export async function getSpaceImages(spaceId: string): Promise<SpaceImagesResult> {
  try {
    const spaceImages = await db
      .select()
      .from(images)
      .where(eq(images.spaceId, spaceId))
      .orderBy(desc(images.createdAt));

    return {
      success: true,
      images: spaceImages,
    };
  } catch (error) {
    console.error('Error fetching space images:', error);
    return {
      success: false,
      images: [],
      error: 'Failed to fetch space images',
    };
  }
}
