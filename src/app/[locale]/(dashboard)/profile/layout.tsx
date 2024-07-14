'use client';

import Header from '@/components/common/header/header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const PROFILE_MENU = [
    {
      title: 'Update Profile',
      path: '/profile',
    },
    {
      title: 'Update Password',
      path: '/profile/password',
    },
    // {
    //   title: 'Manage Address',
    //   path: '/profile/address',
    // },
    // {
    //   title: 'Manage Bank Account',
    //   path: '/profile/bank-account',
    // },
    // {
    //   title: 'Total Income/Wallet',
    //   path: '/profile/income',
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
      <Header title="Profile" />
      <div className=" flex h-full w-full flex-col p-6">
        <div className="no-scrollbar flex gap-8 border-b">
          {PROFILE_MENU.map((menu, i) => (
            <Button
              key={i}
              variant="ghost"
              className={cn(
                ' rounded-none border-b-2 border-transparent px-0 text-base text-neutral-500 hover:bg-transparent hover:text-primary',
                {
                  'border-b-primary text-primary': actualPathName === menu.path,
                },
              )}
              asChild
            >
              <Link href={menu.path}>{menu.title}</Link>
            </Button>
          ))}
        </div>
        <div className=" mt-6 h-full w-full">{children}</div>
      </div>
    </div>
  );
}
