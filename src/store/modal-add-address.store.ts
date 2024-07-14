import { TShippingAddress } from '@/types/address.type';
import { create } from 'zustand';

type TModalAddAddressStore = {
  isOpen: boolean;
  initialValue: TShippingAddress | null;
  onChangeOpen: (value: boolean) => void;
  setInitialValue: (value: TShippingAddress) => void;
  onOpen: () => void;
  onClose: () => void;
};

const useModalAddAddressStore = create<TModalAddAddressStore>((set) => ({
  isOpen: false,
  initialValue: null,
  setInitialValue: (value) => set({ initialValue: value }),
  onChangeOpen: (value) => set({ isOpen: value }),
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useModalAddAddressStore;
