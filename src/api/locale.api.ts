import { ApiServiceErr } from '@/types/api.type';
import { TCountry } from '@/types/country.type';
import { QueryObserverOptions, useQuery } from 'react-query';
import { TLanguage } from '@/types/language.type';
import { getCountries, getLanguages } from './http/locale.service';

/**
 * Get countries
 * @param opt
 * @returns
 */
export const useGetCountries = (opt?: QueryObserverOptions<TCountry[]>) => {
  return useQuery<TCountry[], ApiServiceErr>(
    ['getCountries'],
    () => getCountries(),
    {
      ...opt,
      placeholderData: [],
    },
  );
};

/**
 * Get languages
 * @param opt
 * @returns
 */
export const useGetLanguages = (opt?: QueryObserverOptions<TLanguage[]>) => {
  return useQuery<TLanguage[], ApiServiceErr>(
    ['getLanguages'],
    () => getLanguages(),
    opt,
  );
};
