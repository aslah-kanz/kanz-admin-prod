import { TShowStore } from '@/types/common.type';
import { create } from 'zustand';

type TDialogConfirmationDeleteStore = TShowStore;

const useDialogConfirmationDeleteStore = create<TDialogConfirmationDeleteStore>(
  (set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  }),
);

export default useDialogConfirmationDeleteStore;
