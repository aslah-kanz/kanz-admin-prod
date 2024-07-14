'use client';

import { I18nProviderClient, useCurrentLocale } from '@/locales/client';
import { TickSquare } from 'iconsax-react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
// import Cookies from 'js-cookie';
import { Toaster } from '../ui/sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  // hooks
  const currentLocale = useCurrentLocale();

  // logout on close window
  // React.useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     // remove cred
  //     Cookies.remove('kanzway-admin-cred');
  //   };

  //   window.onbeforeunload = handleBeforeUnload;

  //   return () => {
  //     window.onbeforeunload = null;
  //   };
  // }, []);

  return (
    <I18nProviderClient locale={currentLocale}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster
        closeButton
        position="top-center"
        richColors
        icons={{
          success: <TickSquare />,
        }}
      />
    </I18nProviderClient>
  );
}
