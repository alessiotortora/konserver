import { db } from '@/db';
import { imageInsertSchema, images } from '@/db/schema';

import { TRPCError } from '@trpc/server';

import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

const spaceIdSchema = z.object({
  spaceId: z.string().uuid(),
});

export const imageRouter = createTRPCRouter({
  getImages: baseProcedure.input(spaceIdSchema).query(async ({ input }) => {
    try {
      const spaceImages = await db
        .select()
        .from(images)
        .where(eq(images.spaceId, input.spaceId))
        .orderBy(desc(images.createdAt));

      return spaceImages;
    } catch (error) {
      console.error('Error fetching space images:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch images',
      });
    }
  }),

  create: baseProcedure.input(imageInsertSchema).mutation(async ({ input }) => {
    try {
      const image = await db
        .insert(images)
        .values({
          spaceId: input.spaceId,
          filename: input.filename,
          publicId: input.publicId,
          url: input.url,
          resolution: input.resolution,
          format: input.format,
          bytes: input.bytes,
          alt: input.alt,
        })
        .returning();

      return image[0];
    } catch (error) {
      console.error('Error creating image:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create image',
      });
    }
  }),
});
