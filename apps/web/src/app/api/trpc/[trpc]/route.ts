import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

/**
 * tRPC API Route Handler for Next.js App Router
 * This handles all tRPC requests from the client
 * The [trpc] dynamic segment allows for procedure paths
 */
const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => await createTRPCContext(),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };
