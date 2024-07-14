'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useDebouncedCallback } from 'use-debounce';
import useLangClient from '@/hooks/use-lang-client';
import { useI18n } from '@/locales/client';
import { Input } from '../ui/input';

type TBaseSearchProps = {
  className?: string;
  placeholder?: string;
};

export default function BaseSearch({
  className,
  placeholder,
}: TBaseSearchProps) {
  // search params
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

  // hooks
  const qs = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const router = useRouter();
  const pathname = usePathname();
  const { isAr } = useLangClient();
  const t = useI18n();

  // local
  const [localSearch, setLocalSearch] = useState<string>(search || '');

  // handle search
  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      qs.set('search', term);
      qs.set('page', '1');
    } else {
      qs.delete('search');
    }
    router.replace(`${pathname}?${qs.toString()}`);
  }, 500);

  // assign from search params to local
  useEffect(() => {
    setLocalSearch(search || '');
  }, [search]);

  return (
    <div className={cn(' relative w-full lg:w-64', className)}>
      <FiSearch
        size={16}
        className={cn(
          ' absolute top-3 text-gray-500',
          isAr ? 'right-3' : ' left-3',
        )}
      />
      <Input
        value={localSearch}
        onChange={(e) => {
          setLocalSearch(e.target.value);
          handleSearch(e.target.value);
        }}
        className={cn(isAr ? 'pr-10' : ' pl-10')}
        placeholder={placeholder ?? t('common.searchData')}
      />
    </div>
  );
}
