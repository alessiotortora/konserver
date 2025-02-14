import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { SKIP_SESSION_REFRESH_COOKIE, setSkipSessionRefreshCookie } from './utils';

export async function updateSession(request: NextRequest) {
  // Create an initial response instance.
  let supabaseResponse = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  // Initialize the Supabase client using the new getAll/setAll cookie methods.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          'sb-lb-routing-mode': 'alpha-all-services',
        },
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update request cookies.
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set({ name, value, ...options });
          }
          // Recreate the response so we can update its cookies.
          supabaseResponse = NextResponse.next({ request });
          // Update response cookies.
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set({ name, value, ...options });
          }
          // Mark that the session was refreshed so we can skip it on subsequent requests.
          setSkipSessionRefreshCookie(supabaseResponse, true);
        },
      },
    }
  );

  // Only call getUser() if the skip refresh cookie is not present.
  // IMPORTANT: When the cookie is present, we don't refresh the session,
  // which means we also don't retrieve updated user data.
  let user: unknown = null;
  if (!request.cookies.get(SKIP_SESSION_REFRESH_COOKIE)) {
    const {
      data: { user: refreshedUser },
    } = await supabase.auth.getUser();
    user = refreshedUser;
  } else {
    // If the skip cookie is set, we assume the user is still authenticated.
    // WARNING: This is a simplification. In a real implementation you might
    // store cached user details in a cookie or other store.
    user = true; // truthy placeholder so that redirect logic treats the user as logged in
  }

  // Determine the current path.
  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith('/auth');
  const isLoginPage = pathname === '/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Redirect logic:
  // - If a logged-in user tries to access login or auth routes, redirect to dashboard.
  // - If a non-logged in user tries to access protected dashboard routes, redirect to login.
  if (user) {
    if (isAuthRoute || isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // IMPORTANT: Always return the supabaseResponse instance to ensure that the
  // cookies remain in sync between the client and server.
  return supabaseResponse;
}
