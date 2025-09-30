import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const sessionCookie = req.cookies.get(process.env.SESSION_COOKIE || 'unitx_session')?.value;

  // public paths
  const publicPaths = ['/login', '/api/login'];
  if (publicPaths.some(p => url.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!sessionCookie || sessionCookie !== (process.env.SESSION_COOKIE_VALUE || 'ok')) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};
