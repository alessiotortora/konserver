import { db } from '@/db';
import { videoInsertSchema, videos } from '@/db/schema';

import { TRPCError } from '@trpc/server';

import { and, desc, eq, lt } from 'drizzle-orm';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

const getVideosSchema = z.object({
  spaceId: z.string().uuid(),
  cursor: z.string().uuid().optional(),
  limit: z.number().min(1).max(50).default(20),
});

export const videoRouter = createTRPCRouter({
  getVideos: baseProcedure.input(getVideosSchema).query(async ({ input }) => {
    try {
      const { spaceId, cursor, limit } = input;

      if (cursor) {
        const cursorVideo = await db.select().from(videos).where(eq(videos.id, cursor)).limit(1);
        if (cursorVideo.length > 0) {
          const items = await db
            .select()
            .from(videos)
            .where(and(eq(videos.spaceId, spaceId), lt(videos.createdAt, cursorVideo[0].createdAt)))
            .orderBy(desc(videos.createdAt))
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
        .from(videos)
        .where(eq(videos.spaceId, spaceId))
        .orderBy(desc(videos.createdAt))
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
