import { TBankList } from '@/types/bank.type';
import { create } from 'zustand';

type TModalAddBnkStore = {
  isOpen: boolean;
  initialValue: TBankList | null;
  onChangeOpen: (value: boolean) => void;
  setInitialValue: (value: TBankList) => void;
  onOpen: () => void;
  onClose: () => void;
};

const useModalAddBankStore = create<TModalAddBnkStore>((set) => ({
  isOpen: false,
  initialValue: null,
  setInitialValue: (value) => set({ initialValue: value }),
  onChangeOpen: (value) => set({ isOpen: value }),
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useModalAddBankStore;
