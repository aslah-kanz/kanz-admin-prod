import Cookies from 'js-cookie';
import { create } from 'zustand';

interface SelectedCountryStore {
  country: string;
  add: (item: string) => void;
  remove: (item: string) => void;
}

const useSelectedCountryStore = create<SelectedCountryStore>()((set) => ({
  country: Cookies.get('KanzwaySelectedCountry') as string,
  add: (item) =>
    set(() => {
      Cookies.set('KanzwaySelectedCountry', item);
      return { country: item };
    }),
  remove: () =>
    set(() => {
      Cookies.remove('KanzwaySelectedCountry');
      return { country: '' };
    }),
}));

export default useSelectedCountryStore;
