'use server';

import { db } from '@/db';
import { videos } from '@/db/schema';
import type { Video } from '@/db/schema/videos';
import { desc, eq } from 'drizzle-orm';

interface SpaceVideosResult {
  success: boolean;
  videos: Video[];
  error?: string;
}

export async function getSpaceVideos(spaceId: string): Promise<SpaceVideosResult> {
  try {
    const spaceVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.spaceId, spaceId))
      .orderBy(desc(videos.createdAt));

    return {
      success: true,
      videos: spaceVideos,
    };
  } catch (error) {
    console.error('Error fetching space videos:', error);
    return {
      success: false,
      videos: [],
      error: 'Failed to fetch space videos',
    };
  }
}
