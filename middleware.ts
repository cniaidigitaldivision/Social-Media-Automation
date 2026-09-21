import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Internal API routes are authenticated exclusively via the x-internal-secret
  // header inside each route handler. They are never called by a browser session
  // (e.g. n8n server-to-server calls), so they must bypass the Supabase session
  // check entirely. Let them pass through untouched.
  if (pathname.startsWith('/api/internal/')) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginRoute = pathname.startsWith('/login');

  // "/" is rewritten to the public marketing page (see next.config.ts), so it
  // must stay reachable when signed out rather than bouncing to /login.
  // NOTE: /api/internal/* is handled above before this point and never reaches here.
  const isPublicRoute = pathname === '/' || pathname === '/privacy' || pathname === '/terms';

  if (isLoginRoute && user) {
    // If user is already logged in, redirect away from /login
    return NextResponse.redirect(new URL('/workspaces', request.url));
  }

  if (!user && !isLoginRoute && !isPublicRoute) {
    // No user and not on /login -> redirect to /login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - landing.html (public marketing landing page)
     * - images, etc...
     */
    '/((?!_next/static|_next/image|favicon.ico|landing.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
