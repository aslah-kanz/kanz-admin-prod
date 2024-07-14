import Cookies from 'js-cookie';
import { create } from 'zustand';

interface SelectedCountryFlagStore {
  flag: string;
  add: (item: string) => void;
  remove: (item: string) => void;
}

const useSelectedCountryFlagStore = create<SelectedCountryFlagStore>()(
  (set) => ({
    flag: Cookies.get('KanzwaySelectedCountryFlag') as string,
    add: (item) =>
      set(() => {
        Cookies.set('KanzwaySelectedCountryFlag', item);
        return { flag: item };
      }),
    remove: () =>
      set(() => {
        Cookies.remove('KanzwaySelectedCountryFlag');
        return { flag: '' };
      }),
  }),
);

export default useSelectedCountryFlagStore;
