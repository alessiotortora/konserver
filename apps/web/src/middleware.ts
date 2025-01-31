import { updateSession } from '@/utils/supabase/middleware';
import type { NextRequest } from 'next/server';
import { getSession } from './utils/supabase/session';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const {
    data: { session },
  } = await getSession();

  if (!session?.user.id) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Protected routes that require authentication
    '/dashboard/:path*',
    // Auth routes that need session checking
    '/login',
    '/auth/:path*',
  ],
};
