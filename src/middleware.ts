import { chain } from '@/middlewares/chain';
import { withLocaleMiddleware } from './middlewares/middleware1';
import { withAuthMiddleware } from './middlewares/middleware2';

export default chain([withAuthMiddleware, withLocaleMiddleware]);

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
