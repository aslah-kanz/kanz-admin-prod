import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Poppins, Rubik } from 'next/font/google';
import '../globals.css';
import Providers from '@/components/common/providers';
import { getCurrentLocale } from '@/locales/server';
import { useLangServer } from '@/hooks/use-lang-server';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const rubik = Rubik({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'KanzWay - Connecting Manufacturers and Buyers Around the World',
  description: '',
  keywords: '',
  authors: [{}],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentLocale = getCurrentLocale();
  const { isAr } = await useLangServer();
  return (
    <html lang={currentLocale}>
      <body
        className={cn(
          isAr ? rubik.className : poppins.className,
          'antialiased',
        )}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
