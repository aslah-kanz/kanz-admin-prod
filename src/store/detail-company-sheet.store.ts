import { TPrincipal } from '@/types/principal.type';
import { create } from 'zustand';

type TDetailCompanySheetStore = {
  isOpen: boolean;
  initialValue: TPrincipal | null;
  onChangeOpen: (value: boolean) => void;
  setInitialValue: (value: TPrincipal | null) => void;
  onOpen: () => void;
  onClose: () => void;
};

const useDetailCompanySheetStore = create<TDetailCompanySheetStore>((set) => ({
  isOpen: false,
  initialValue: null,
  setInitialValue: (value) => set({ initialValue: value }),
  onChangeOpen: (value) => set({ isOpen: value }),
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useDetailCompanySheetStore;
