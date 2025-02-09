import { db } from '@/db';
import { videoInsertSchema, videos } from '@/db/schema';

import { TRPCError } from '@trpc/server';

import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

const spaceIdSchema = z.object({
  spaceId: z.string().uuid(),
});

export const videoRouter = createTRPCRouter({
  getVideos: baseProcedure.input(spaceIdSchema).query(async ({ input }) => {
    try {
      const spaceVideos = await db
        .select()
        .from(videos)
        .where(eq(videos.spaceId, input.spaceId))
        .orderBy(desc(videos.createdAt));

      return spaceVideos;
    } catch (error) {
      console.error('Error fetching space videos:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch videos',
      });
    }
  }),

  create: baseProcedure.input(videoInsertSchema).mutation(async ({ input }) => {
    try {
      const video = await db
        .insert(videos)
        .values({
          spaceId: input.spaceId,
          filename: input.filename,
          identifier: input.identifier,
          playbackId: input.playbackId,
          assetId: input.assetId,
          alt: input.alt,
          status: 'processing',
        })
        .returning();

      return video[0];
    } catch (error) {
      console.error('Error creating video:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create video',
      });
    }
  }),
});
