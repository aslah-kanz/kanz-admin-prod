import { TBanner } from '@/types/banner.type';
import { create } from 'zustand';

type TAddBannerSheetStore = {
  isOpen: boolean;
  initialValue: TBanner | null;
  onChangeOpen: (value: boolean) => void;
  setInitialValue: (value: TBanner | null) => void;
  onOpen: () => void;
  onClose: () => void;
};

const useAddBannerSheetStore = create<TAddBannerSheetStore>((set) => ({
  isOpen: false,
  initialValue: null,
  setInitialValue: (value) => set({ initialValue: value }),
  onChangeOpen: (value) => set({ isOpen: value }),
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useAddBannerSheetStore;
