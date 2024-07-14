import { create } from 'zustand';

type TDialogOtpStore = {
  isOpen: boolean;
  isValidated: boolean;
  onOpen: () => void;
  onClose: () => void;
  setValidated: (data: boolean) => void;
};

const useDialogOtpStore = create<TDialogOtpStore>((set) => ({
  isOpen: false,
  isValidated: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true, isValidated: false }),
  setValidated: (data) =>
    set((state) => {
      state.isValidated = data;
      return state;
    }),
}));

export default useDialogOtpStore;
