'use client';

import { useI18n } from '@/locales/client';
import Image from 'next/image';

type TEmptyStateProps = {
  description?: string;
};

export default function EmptyState({ description }: TEmptyStateProps) {
  const t = useI18n();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 py-16">
      <div className=" relative aspect-square w-32">
        <Image
          src="/images/empty-folder.png"
          fill
          alt="empty"
          className=" object-contain object-center"
        />
      </div>
      <p className=" max-w-md text-center text-neutral-500">
        {description ?? t('common.emptyState')}
      </p>
    </div>
  );
}
