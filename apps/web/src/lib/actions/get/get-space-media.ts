'use server';

import { db } from '@/db';
import { images, videos } from '@/db/schema';
import type { Image } from '@/db/schema/types';
import type { Video } from '@/db/schema/videos';
import { desc, eq } from 'drizzle-orm';

interface SpaceMediaResult {
  success: boolean;
  images: Image[];
  videos: Video[];
  error?: string;
}

export async function getSpaceMedia(spaceId: string): Promise<SpaceMediaResult> {
  try {
    const [spaceImages, spaceVideos] = await Promise.all([
      db.select().from(images).where(eq(images.spaceId, spaceId)).orderBy(desc(images.createdAt)),
      db.select().from(videos).where(eq(videos.spaceId, spaceId)).orderBy(desc(videos.createdAt)),
    ]);

    return {
      success: true,
      images: spaceImages,
      videos: spaceVideos,
    };
  } catch (error) {
    console.error('Error fetching space media:', error);
    return {
      success: false,
      images: [],
      videos: [],
      error: 'Failed to fetch space media',
    };
  }
}
