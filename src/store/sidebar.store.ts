import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  isShow: boolean;
  onClose: () => void;
  onOpen: () => void;
  onShow: () => void;
  onHide: () => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  isShow: true,
  onShow: () => set({ isShow: true }),
  onHide: () => set({ isShow: false }),
}));

export default useSidebarStore;
