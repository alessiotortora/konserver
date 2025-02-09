import type { inferRouterOutputs } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../init';
import { imageRouter } from './image';
import { videoRouter } from './video';

export const appRouter = createTRPCRouter({
  video: videoRouter,
  image: imageRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
