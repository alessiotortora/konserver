'use server';

import { db } from '@/db';
import { images, videos } from '@/db/schema';
import type { Video } from '@/db/schema/types';
import { eq } from 'drizzle-orm';

export async function getSpaceMedia(spaceId: string) {
  try {
    const [spaceImages, spaceVideos] = await Promise.all([
      db.select().from(images).where(eq(images.spaceId, spaceId)),
      db
        .select()
        .from(videos)
        .where(eq(videos.spaceId, spaceId))
        .then((videos) =>
          videos.filter((video): video is Video => {
            return video.playbackId !== null;
          })
        ),
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
      error: 'Failed to fetch space media',
    };
  }
}
