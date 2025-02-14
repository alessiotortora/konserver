// middleware.ts
import { updateSession } from '@/utils/supabase/client/middleware';
import type { NextRequest } from 'next/server';
import { getSession } from './utils/supabase/auth/session';

export async function middleware(request: NextRequest) {
  // Update the session (this handles cookie sync and, if needed, refreshes the session)
  const response = await updateSession(request);

  // Retrieve the current session from your helper
  const {
    data: { session },
  } = await getSession();

  if (!session?.user?.id) {
    return response;
  }

  // If the user is authenticated, return the updated response
  return response;
}

export const config = {
  // Run middleware on all non-API and non-static asset routes
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
