'use client';

// React
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

// Types
import { TBaseCountryCodeInputProps } from '@/types/base-component.type';
import { TCountry } from '@/types/country.type';

// Utils
import clsx from 'clsx';

// API
import { useGetCountries } from '@/api/locale.api';

const BaseCountryCodeInput = forwardRef<
  HTMLDivElement,
  Partial<TBaseCountryCodeInputProps>
>((props, ref) => {
  const { value, onChange, children } = props;

  const { data, isLoading: _loading } = useGetCountries();
  const countries = useMemo<TCountry[]>(() => data ?? [], [data]);

  // Show hide list number variable
  const [showListNum, setShowListNum] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<number | null>(null);

  useEffect(() => {
    setLocalValue(value ?? null);
  }, [value]);

  /**
   * Show hide list number dropdown
   */
  const handleToggleListNumber = useCallback(() => {
    setShowListNum(!showListNum);
  }, [showListNum]);

  // Search Region Code
  const [searchRegion, setSearchRegion] = useState<string>('');

  // Filter Region Phone Codes
  const filteredRegionPhoneCodes = useMemo<TCountry[]>(() => {
    if (searchRegion) {
      return countries.filter(
        (item) =>
          item.name.en
            .toLocaleLowerCase()
            .indexOf(searchRegion.toLocaleLowerCase()) !== -1 ||
          item.phoneCode
            .toString()
            .toLocaleLowerCase()
            .indexOf(searchRegion.toLocaleLowerCase()) !== -1 ||
          item.code
            .toLocaleLowerCase()
            .indexOf(searchRegion.toLocaleLowerCase()) !== -1,
      );
    }

    return countries;
  }, [countries, searchRegion]);

  // Get phone number code
  const getCurrentCountry = useMemo<TCountry | undefined>(() => {
    return countries.find((item) => item.phoneCode === localValue);
  }, [countries, localValue]);

  // Handling if the user has entered a value at the beginning
  const [firstTime, setFirstTime] = useState<boolean>(true);
  useEffect(() => {
    if (getCurrentCountry && onChange && firstTime) {
      onChange(getCurrentCountry.phoneCode, getCurrentCountry);
      setFirstTime(false);
    }
  }, [firstTime, getCurrentCountry, onChange]);

  /**
   * Handle selected region
   * @param value
   */
  const handleSelectedRegionCode = useCallback(
    (val: TCountry) => {
      if (val.phoneCode !== localValue) {
        if (onChange) {
          onChange(val.phoneCode, val);
          setLocalValue(val.phoneCode);
        }
      }
      setShowListNum(false);
    },
    [localValue, onChange],
  );

  return (
    <div
      className="number-choose bg-neutral-200/50"
      ref={ref}
    >
      <div className="list-number">
        <div
          role="presentation"
          className="number-wrapper"
          onClick={handleToggleListNumber}
        >
          <span>
            {getCurrentCountry ? (
              <span>
                {getCurrentCountry?.code} +{getCurrentCountry?.phoneCode}
              </span>
            ) : (
              <span style={{ fontSize: '11px' }}>...</span>
            )}
          </span>
        </div>
        <div
          className={clsx('lists-number-wrapper', showListNum ? 'active' : '')}
        >
          <div className="search-number bg-neutral-200/100">
            <input
              type="text"
              className="form-control bg-neutral-200/50"
              placeholder="Search here"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearchRegion(e.target.value);
              }}
            />
          </div>
          <ul className="no-list bg-neutral-200/100">
            {filteredRegionPhoneCodes.map((item) => (
              <li
                role="presentation"
                key={item.code}
                className={clsx(
                  'number-wrapper-button',
                  localValue === item.phoneCode ? 'active' : '',
                )}
                onClick={() => handleSelectedRegionCode(item)}
              >
                {item.name.en} +{item.phoneCode}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="input-value">{children}</div>
    </div>
  );
});

BaseCountryCodeInput.displayName = 'BaseCountryCodeInput';

export default BaseCountryCodeInput;
