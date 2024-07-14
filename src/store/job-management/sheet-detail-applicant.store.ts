import { TShowStore } from '@/types/common.type';
import { TApplicant } from '@/types/job.type';
import { create } from 'zustand';

type TSheetDetailApplicantStore = TShowStore & {
  applicant: TApplicant | undefined;
  setApplicant: (applicant: TApplicant) => void;
  toggle: () => void;
};

const useSheetDetailApplicantStore = create<TSheetDetailApplicantStore>(
  (set, get) => ({
    applicant: undefined,
    setApplicant: (applicant) => set({ applicant }),
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
    toggle: () => set({ isOpen: !get().isOpen }),
  }),
);

export default useSheetDetailApplicantStore;
