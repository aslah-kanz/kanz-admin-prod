import { TShowStore } from '@/types/common.type';
import { create } from 'zustand';

type TBaseFilterTable = TShowStore & {
  toggle: () => void;
};

const useBaseFilterTable = create<TBaseFilterTable>((set, get) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  toggle: () => set({ isOpen: !get().isOpen }),
}));

export default useBaseFilterTable;
