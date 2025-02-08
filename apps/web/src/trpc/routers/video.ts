import { db } from '@/db';
import { videos } from '@/db/schema';
import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

/**
 * Input schema for space-related queries
 * Requires a valid UUID for spaceId
 */
const spaceIdSchema = z.object({
  spaceId: z.string().uuid(),
});

/**
 * Video Router
 * Handles all video-related queries
 * Note: Mutations are handled by server actions in the respective components
 * This keeps our architecture consistent:
 * - Queries (reading data) -> tRPC
 * - Mutations (writing data) -> Server Actions
 */
export const videoRouter = createTRPCRouter({
  /**
   * getSpaceVideos
   * Fetches all videos for a given space
   * Returns videos ordered by creation date (newest first)
   *
   * Query is configured to:
   * - Cache results for 5 seconds (staleTime)
   * - Allow background updates (gcTime)
   * - Handle errors gracefully
   */
  getSpaceVideos: baseProcedure.input(spaceIdSchema).query(async ({ input }) => {
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
});
