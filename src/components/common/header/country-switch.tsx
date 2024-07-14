'use client';

import { useGetCountries } from '@/api/locale.api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import useSelectedCountryStore from '@/store/selectedCountry.store';
import useSelectedCountryCodeStore from '@/store/selectedCountryCode.store';
import useSelectedCountryFlagStore from '@/store/selectedCountryFlag.store';
import { getLang } from '@/utils/locale.util';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import Cookies from 'js-cookie';

type TCountrySwitchProps = {
  side?: 'start' | 'end';
};

export default function CountrySwitch({ side = 'start' }: TCountrySwitchProps) {
  // fetch
  const { data: countries, isLoading: loadingCountries } = useGetCountries();
  const params = useParams();

  // store
  const { country, add: selectedCountry } = useSelectedCountryStore();
  const { add: selectedCountryCode } = useSelectedCountryCodeStore();
  const { flag, add: selectedFlag } = useSelectedCountryFlagStore();

  // state
  const [selectedCountryState, setSelectedCountryState] = useState(country);
  // const [selectedCountryCodeState, setSelectedCountryCodeState] =
  //   useState(countryCode);
  // const [selectedFlagState, setSelectedFlagState] = useState(flag);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    selectedCountry(Cookies.get('KanzwaySelectedCountry') ?? 'sa');
    selectedCountryCode(Cookies.get('KanzwaySelectedCountryCode') ?? '966');
    selectedFlag(
      Cookies.get('KanzwaySelectedCountryFlag') ??
        'https://api.kanzway.com/v1/images/download/Saudi_new1.png',
    );
  }, [selectedCountry, selectedCountryCode, selectedFlag]);

  // handle apply
  const handleApply = useCallback(
    (
      selectedCountryValue: string,
      selectedCountryCodeValue: string,
      selectedFlagValue: string,
    ) => {
      selectedCountry(selectedCountryValue);
      selectedCountryCode(selectedCountryCodeValue);
      selectedFlag(selectedFlagValue);
    },
    [selectedCountry, selectedCountryCode, selectedFlag],
  );

  return (
    <div className=" group relative w-fit">
      <Button
        variant="ghost"
        className=" gap-2 px-0 text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800"
      >
        <div className=" relative aspect-square h-4 overflow-hidden rounded-full">
          <Image
            fill
            alt="us"
            className=" object-cover object-center"
            src={
              isClient
                ? flag
                : 'https://api.kanzway.com/v1/images/download/Saudi_new1.png'
            }
          />
        </div>
        <div className="flex gap-1">
          {isClient ? country?.toUpperCase() : 'SA'}{' '}
        </div>
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
        <div className="grid grid-cols-1 border-b">
          <div className="flex-1">
            <div className=" p-4">
              <h1 className=" font-medium">Country</h1>
            </div>
            <div className="flex flex-col">
              {loadingCountries
                ? [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className=" flex h-10 items-center gap-2 p-4"
                    >
                      <Skeleton className=" aspect-square w-4 rounded-full" />
                      <Skeleton className=" h-4 flex-1" />
                    </div>
                  ))
                : countries &&
                  countries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => {
                        setSelectedCountryState(country.code.toLowerCase());
                        // setSelectedFlagState(country.image.url);
                        // setSelectedCountryCodeState(
                        //   country.phoneCode.toString(),
                        // );
                        handleApply(
                          country.code.toLowerCase(),
                          country.phoneCode.toString(),
                          country.image.url,
                        );
                      }}
                      className={cn(
                        ' flex h-10 items-center justify-start gap-2 p-4 hover:bg-primary/10',
                        {
                          'bg-primary/10':
                            selectedCountryState === country.code.toLowerCase(),
                        },
                      )}
                    >
                      <div className=" relative aspect-square h-4 overflow-hidden rounded-full border">
                        <Image
                          src={country.image.url}
                          fill
                          alt={country.name.en}
                          className=" object-cover object-center"
                        />
                      </div>
                      <p className=" flex-1 text-left text-sm font-medium">
                        {getLang(params, country.name)}
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
