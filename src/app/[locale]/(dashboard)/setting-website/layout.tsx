'use client';

import Header from '@/components/common/header/header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLang } from '@/utils/locale.util';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function SettingWebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const PAGES_MENU = [
    {
      title: {
        en: 'Website Profile',
        ar: 'الملف الشخصي للموقع',
      },
      path: '/setting-website',
    },
    {
      title: {
        ar: 'وسائل التواصل الاجتماعي',
        en: 'Social Media',
      },
      path: '/setting-website/social-media',
    },
    {
      title: {
        ar: 'إدارة البلاد',
        en: 'Manage Country',
      },
      path: '/setting-website/manage-country',
    },
    // {
    //   title: {
    //     en: 'Contact',
    //     ar: 'اتصال',
    //   },
    //   path: '/setting-website/contact',
    // },
  ];
  const pathname = usePathname();
  // get actual pathname
  const actualPathName = useMemo<string>(() => {
    const arrPathname = pathname.split('/');
    arrPathname.splice(0, 2);
    return `/${arrPathname.join('/')}`;
  }, [pathname]);

  return (
    <div className=" flex h-full w-full flex-col">
      <Header title="Setting Website" />
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
