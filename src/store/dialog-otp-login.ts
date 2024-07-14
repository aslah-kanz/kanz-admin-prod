import { TAuthLoginResponse } from '@/types/auth.type';
import { create } from 'zustand';

type TDialogOtpLoginStore = {
  isOpen: boolean;
  loginRespons: TAuthLoginResponse | undefined;
  onClose: () => void;
  onOpen: (respons?: TAuthLoginResponse) => void;
};

const useDialogOtpLoginStore = create<TDialogOtpLoginStore>((set) => ({
  isOpen: false,
  loginRespons: undefined,
  onClose: () =>
    set({
      isOpen: false,
    }),
  onOpen: (respons) =>
    set({
      isOpen: true,
      loginRespons: respons,
    }),
}));

export default useDialogOtpLoginStore;
