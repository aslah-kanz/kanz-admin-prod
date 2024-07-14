import { TCountry } from '@/types/country.type';
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface SelectedCountryCodeStore {
  countryCode: string;
  countries: TCountry[];
  setCountries: (countries: TCountry[]) => void;
  add: (item: string) => void;
  remove: (item: string) => void;
}

const useSelectedCountryCodeStore = create<SelectedCountryCodeStore>()(
  (set) => ({
    countryCode: Cookies.get('KanzwaySelectedCountryCode') as string,
    countries: (typeof window !== 'undefined' &&
    localStorage.getItem('KanzwaySelectedCountries')
      ? JSON.parse(localStorage.getItem('KanzwaySelectedCountries') as string)
      : []) as TCountry[],
    setCountries: (data: TCountry[]) =>
      set(() => {
        localStorage.setItem('KanzwaySelectedCountries', JSON.stringify(data));
        return { countries: data };
      }),
    add: (item) =>
      set(() => {
        Cookies.set('KanzwaySelectedCountryCode', item);
        return { countryCode: item };
      }),
    remove: () =>
      set(() => {
        Cookies.remove('KanzwaySelectedCountryCode');
        return { countryCode: '' };
      }),
  }),
);

export default useSelectedCountryCodeStore;
