import { TPrincipal } from '@/types/principal.type';
import { create } from 'zustand';

type TDetailVendorStore = {
  initialValue: TPrincipal | null;
  setInitialValue: (value: TPrincipal) => void;
  resetInitialValue: () => void;
};

const useDetailVendorStore = create<TDetailVendorStore>((set) => ({
  initialValue: null,
  setInitialValue: (value) => set({ initialValue: value }),
  resetInitialValue: () => set({ initialValue: null }),
}));

export default useDetailVendorStore;
