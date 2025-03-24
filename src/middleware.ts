import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Remove the client-side Cookies import - it won't work in middleware
// import Cookies from "js-cookie";

export function middleware(request: NextRequest) {
  // Get the path from the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  // Using '/' instead of '/login' since your login form is in the root page
  const isPublicPath = path === '/' || path === '/register' || path.startsWith('/api/auth');
  
  // Get tokens from request cookies instead of using js-cookie
  const accessToken = request.cookies.get('accessToken')?.value;
  // const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // If the user is on a public path and has tokens, redirect to dashboard
  if (isPublicPath && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If the user is not on a public path and doesn't have tokens, redirect to login (root page)
  if (!isPublicPath && (!accessToken )) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Otherwise, continue with the request
  return NextResponse.next();
}

// Configure which paths should be protected by the middleware
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes that don't require authentication
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /robots.txt (SEO files)
     */
    '/((?!_next|static|favicon.ico|robots.txt).*)',
  ],
};