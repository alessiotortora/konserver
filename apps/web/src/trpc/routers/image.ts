import { db } from '@/db';
import { imageInsertSchema, images } from '@/db/schema';

import { TRPCError } from '@trpc/server';

import { and, desc, eq, lt } from 'drizzle-orm';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

const getImagesSchema = z.object({
  spaceId: z.string().uuid(),
  cursor: z.string().uuid().optional(),
  limit: z.number().min(1).max(50).default(20),
});

export const imageRouter = createTRPCRouter({
  getImages: baseProcedure.input(getImagesSchema).query(async ({ input }) => {
    try {
      const { spaceId, cursor, limit } = input;

      if (cursor) {
        const cursorImage = await db.select().from(images).where(eq(images.id, cursor)).limit(1);
        if (cursorImage.length > 0) {
          const items = await db
            .select()
            .from(images)
            .where(and(eq(images.spaceId, spaceId), lt(images.createdAt, cursorImage[0].createdAt)))
            .orderBy(desc(images.createdAt))
            .limit(limit + 1);

          let nextCursor: typeof cursor | undefined = undefined;
          if (items.length > limit) {
            const nextItem = items.pop();
            nextCursor = nextItem?.id;
          }
          return { items, nextCursor };
        }
      }

      const items = await db
        .select()
        .from(images)
        .where(eq(images.spaceId, spaceId))
        .orderBy(desc(images.createdAt))
        .limit(limit + 1);

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
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
