import { getSession } from '@/utils/supabase/session';
import { TRPCError, initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

// create validate api key function

export const createTRPCContext = cache(async () => {
  const {
    data: { session },
  } = await getSession();
  return {
    authenticatedId: session?.user?.id,
  };
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthenticated(opts) {
  const { authenticatedId } = opts.ctx;
  if (!authenticatedId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({ ctx: { authenticatedId } });
});
