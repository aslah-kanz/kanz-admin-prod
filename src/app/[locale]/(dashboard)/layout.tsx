'use client';

import Sidebar from '@/components/common/sidebar/sidebar';
import { cn } from '@/lib/utils';
import useSidebarStore from '@/store/sidebar.store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isShow } = useSidebarStore();

  return (
    <div className=" flex w-full">
      <Sidebar />
      <div
        className={cn(
          '-ml-[265px] flex h-screen w-[265px] transition-all lg:ml-0',
          {
            ' w-0': !isShow,
          },
        )}
      />
      <div
        id="content-wrapper"
        className="w-full flex-1 overflow-hidden pt-[56px] lg:pt-20"
      >
        {children}
      </div>
    </div>
  );
}
