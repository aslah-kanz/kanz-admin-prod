import { TCustomerProfile } from '@/types/profile.type';
import { create } from 'zustand';
import Cookies from 'js-cookie';

type TProfileStore = {
  profile: TCustomerProfile | null;
  add: (item: TCustomerProfile) => void;
  remove: () => void;
};

const cookieKey = 'kanzway-admin-profile';

const getInitialStateFromCookie = (): TCustomerProfile | null => {
  const cookieValue = Cookies.get(cookieKey);
  return cookieValue ? JSON.parse(decodeURIComponent(atob(cookieValue))) : null;
};

const useProfileStore = create<TProfileStore>((set) => ({
  profile: getInitialStateFromCookie(),
  add: (data) =>
    set((state) => {
      state.profile = data;
      Cookies.set(cookieKey, btoa(encodeURIComponent(JSON.stringify(data))));
      return state;
    }),
  remove: () => set({ profile: null }),
}));

export default useProfileStore;
