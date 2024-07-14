import { TShowStore } from '@/types/common.type';
import { create } from 'zustand';

type TBaseSheetFilterStore = TShowStore & {
  toggle: () => void;
};

const useBaseSheetFilterStore = create<TBaseSheetFilterStore>((set, get) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  toggle: () => set({ isOpen: !get().isOpen }),
}));

export default useBaseSheetFilterStore;
