import { CustomMiddleware } from '@/middlewares/chain';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextFetchEvent, NextRequest } from 'next/server';

const I18Middleware = createI18nMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});

export function withLocaleMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = I18Middleware(request);
    return middleware(request, event, response);
  };
}
