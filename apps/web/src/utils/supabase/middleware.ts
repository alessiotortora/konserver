import { type NextRequest, NextResponse } from 'next/server';
import { getServerUser } from './server';

export async function updateSession(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const pathname = requestUrl.pathname;

    if (pathname === '/') {
      return NextResponse.next();
    }

    // Create single response instance
    const response = NextResponse.next({
      request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return response;
    }

    const user = await getServerUser();

    // Handle auth redirects
    const isAuthRoute = pathname.startsWith('/auth');
    const isLoginPage = pathname === '/login';
    const isDashboardRoute = pathname.startsWith('/dashboard');

    if (user) {
      // Logged in user trying to access login/auth pages
      if (isLoginPage || isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // Non-logged in user trying to access protected routes
      if (isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Error in updateSession:', error);
    return NextResponse.next();
  }
}
