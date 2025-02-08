import type { inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { videoRouter } from './video';

export const appRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  video: videoRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
