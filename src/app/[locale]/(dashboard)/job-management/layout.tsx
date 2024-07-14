'use client';

import Header from '@/components/common/header/header';
import { useI18n } from '@/locales/client';

export default function JobManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useI18n();
  return (
    <div className=" flex h-full w-full flex-col">
      <Header title={t('sidebar.menu.jobManagement')} />
      {children}
    </div>
  );
}
