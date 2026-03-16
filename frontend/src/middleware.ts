import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // We rely on client-side auth checks since tokens live in localStorage.
  // This middleware just redirects the bare root.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};