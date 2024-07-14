import { CustomMiddleware } from '@/middlewares/chain';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const exeptionPages = ['login', 'forgot-password', 'reset-password'];

export function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const actualPathname = request.nextUrl.pathname.replace(/^(.*)\//gm, '');
    const isLoggedIn = cookies().has('kanzway-admin-cred');

    if (
      !isLoggedIn &&
      !exeptionPages.some((page) => actualPathname.startsWith(page))
    ) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }

    const response = NextResponse.next();
    return middleware(request, event, response);
  };
}
