'use client';

import { useGetLanguages } from '@/api/locale.api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useChangeLocale, useCurrentLocale } from '@/locales/client';
import { getLang } from '@/utils/locale.util';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

type TLangSwitchProps = {
  side?: 'start' | 'end';
};

export default function LangSwitch({ side = 'start' }: TLangSwitchProps) {
  // hooks
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  // fetch
  const { data: languages, isLoading: loadingLanguages } = useGetLanguages();
  const params = useParams();

  // state
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>(
    currentLocale,
  );

  // handle apply
  const handleApply = useCallback(
    (language: 'en' | 'ar') => {
      changeLocale(language);
    },
    [changeLocale],
  );

  return (
    <div className=" group relative w-fit">
      <Button
        variant="ghost"
        className=" gap-2 px-0 text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800"
      >
        <div className="flex gap-1">{currentLocale.toUpperCase()}</div>
        <FaChevronDown
          size={8}
          className=" transition-all duration-300 group-hover:rotate-180"
        />
      </Button>
      <div
        className={cn(
          ' invisible absolute z-[50] flex w-[400px] flex-col rounded-lg border bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100',
          { 'right-0': side === 'end' },
          { 'left-0': side === 'start' },
        )}
        dir="ltr"
      >
        <div className="grid grid-cols-1 divide-x border-b">
          <div className="flex-1">
            <div className=" p-4">
              <h1 className=" font-medium">Language</h1>
            </div>
            <div className="flex flex-col">
              {loadingLanguages
                ? [...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className=" flex h-10 items-center gap-2 p-4"
                    >
                      <Skeleton className=" aspect-square w-4 rounded-full" />
                      <Skeleton className=" h-4 flex-1" />
                    </div>
                  ))
                : languages &&
                  languages.map((language) => (
                    <button
                      key={language.id}
                      onClick={() => {
                        setSelectedLanguage(
                          language.code.toLowerCase() as 'en' | 'ar',
                        );
                        handleApply(language.code.toLowerCase() as 'en' | 'ar');
                      }}
                      className={cn(
                        ' flex h-10 items-center justify-start gap-2 p-4 hover:bg-primary/10',
                        {
                          'bg-primary/10':
                            selectedLanguage === language.code.toLowerCase(),
                        },
                      )}
                    >
                      <div className=" relative aspect-square h-4 overflow-hidden rounded-full">
                        <Image
                          src={language.image.url}
                          fill
                          alt={language.name.en}
                          className=" object-cover object-center"
                        />
                      </div>
                      <p className=" text-sm font-medium">
                        {getLang(params, language.name)}
                      </p>
                    </button>
                  ))}
            </div>
          </div>
        </div>
        {/* <div className=" flex h-10 w-full items-center justify-center">
          <button
            // href="/"
            className=" text-sm text-primary"
            onClick={handleApply}
          >
            Apply
          </button>
        </div> */}
      </div>
    </div>
  );
}
