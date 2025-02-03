'use server';

import { db } from '@/db';
import { images } from '@/db/schema';

export async function createImage(
  spaceId: string,
  filename: string,
  publicId: string,
  url: string,
  resolution: string,
  format: string,
  alt: string
) {
  try {
    const [image] = await db
      .insert(images)
      .values({
        spaceId,
        filename,
        publicId,
        url,
        resolution,
        format,
        alt,
      })
      .returning();

    return image;
  } catch (error) {
    console.error('Error creating image:', error);
    throw new Error('Failed to create image');
  }
}
