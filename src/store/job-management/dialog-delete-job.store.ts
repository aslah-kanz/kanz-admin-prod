import { TShowStore } from '@/types/common.type';
import { create } from 'zustand';

type TDialogDeleteJobStore = TShowStore & {
  jobId: number | undefined;
  setJobId: (jobId: number | undefined) => void;
  toggle: () => void;
};

const useDialogDeleteJobStore = create<TDialogDeleteJobStore>((set, get) => ({
  jobId: undefined,
  setJobId: (jobId) => set({ jobId }),
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  toggle: () => set({ isOpen: !get().isOpen }),
}));

export default useDialogDeleteJobStore;
