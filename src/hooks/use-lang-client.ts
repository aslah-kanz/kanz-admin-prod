// React
import { useMemo } from 'react';

// Locale
import { useCurrentLocale } from '@/locales/client';

const useLangClient = () => {
  const locale = useCurrentLocale();

  /**
   * Is Arabic
   */
  const isAr = useMemo(() => {
    return locale === 'ar';
  }, [locale]);

  return { isAr };
};

export default useLangClient;
