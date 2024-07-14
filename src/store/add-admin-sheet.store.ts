import { TPrincipal } from '@/types/principal.type';
import { create } from 'zustand';

type TAddAdminSheetStore = {
  isOpen: boolean;
  initialValue: TPrincipal | null;
  onChangeOpen: (value: boolean) => void;
  setInitialValue: (value: TPrincipal | null) => void;
  onOpen: () => void;
  onClose: () => void;
};

const useAddAdminSheetStore = create<TAddAdminSheetStore>((set) => ({
  isOpen: false,
  initialValue: null,
  setInitialValue: (value) => set({ initialValue: value }),
  onChangeOpen: (value) => set({ isOpen: value }),
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useAddAdminSheetStore;
