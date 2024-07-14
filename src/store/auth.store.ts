// Zustand
import { create } from 'zustand';

// Cookie
import Cookies from 'js-cookie';

// Types
import { TAuthLoginResponse, TAuthStore } from '@/types/auth.type';

const cookieKey = 'kanzway-admin-cred';

const getInitialStateFromCookie = (): TAuthLoginResponse | null => {
  const cookieValue = Cookies.get(cookieKey);
  return cookieValue ? JSON.parse(decodeURIComponent(atob(cookieValue))) : null;
};

const useAuthStore = create<TAuthStore>((set, get) => ({
  credential: getInitialStateFromCookie(),
  setCredential: (data) =>
    set((state) => {
      state.credential = data;
      Cookies.set(cookieKey, btoa(encodeURIComponent(JSON.stringify(data))));
      return state;
    }),
  resetCredential: () => set({ credential: null }),

  isLoggedIn: () => !!get().credential,
}));

export default useAuthStore;
