'use client';

import Header from '@/components/common/header/header';
import { Button } from '@/components/ui/button';
import { PAGES_MENU } from '@/constants/common.constant';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { getLang } from '@/utils/locale.util';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function PagesManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const t = useI18n();
  // get actual pathname
  const actualPathName = useMemo<string>(() => {
    const arrPathname = pathname.split('/');
    arrPathname.splice(0, 2);
    return `/${arrPathname.join('/')}`;
  }, [pathname]);

  return (
    <div className=" flex h-full w-full flex-col">
      <Header title={t('sidebar.menu.pagesManagement')} />
      <div className=" flex h-full w-full flex-col p-6">
        <div className=" w-full">
          <div className=" flex gap-8 overflow-y-auto rounded-t-lg border p-4 pt-2">
            {PAGES_MENU.map((menu, i) => (
              <Button
                key={i}
                variant="ghost"
                className={cn(
                  ' rounded-none border-b-2 border-transparent px-0 text-base text-neutral-500 hover:bg-transparent hover:text-primary',
                  {
                    'border-b-primary text-primary':
                      actualPathName === menu.path,
                  },
                )}
                asChild
              >
                <Link href={menu.path}>{getLang(params, menu.title)}</Link>
              </Button>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
