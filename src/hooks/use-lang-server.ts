import { getCurrentLocale } from '@/locales/server';

export const useLangServer = async () => {
  const locale = await getCurrentLocale();

  /**
   * Is Arabic
   */
  const isAr = locale === 'ar';

  return { isAr };
};
