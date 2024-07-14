import { TRole } from '@/types/role.type';
import { create } from 'zustand';

type TAddRoleSheetStore = {
  isOpen: boolean;
  initialValue: TRole | null;
  onChangeOpen: (value: boolean) => void;
  setInitialValue: (value: TRole) => void;
  onOpen: () => void;
  onClose: () => void;
};

const useAddRoleSheetStore = create<TAddRoleSheetStore>((set) => ({
  isOpen: false,
  initialValue: null,
  setInitialValue: (value) => set({ initialValue: value }),
  onChangeOpen: (value) => set({ isOpen: value }),
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useAddRoleSheetStore;
