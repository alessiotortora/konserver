'use server';

import { db } from '@/db';
import { videoStatusEnum, videos } from '@/db/schema';

export async function createVideo(
  spaceId: string,
  filename: string,
  identifier: string,
  assetId?: string | null,
  playbackId?: string | null,
  alt?: string
) {
  try {
    const [video] = await db
      .insert(videos)
      .values({
        spaceId,
        filename,
        identifier,
        status: videoStatusEnum.enumValues[0],
        assetId: assetId || null,
        playbackId: playbackId || null,
        alt: alt || filename,
      })
      .returning();

    return video;
  } catch (error) {
    console.error('Error creating video:', error);
    throw new Error('Failed to create video');
  }
}
