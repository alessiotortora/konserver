import { create } from 'zustand';

interface HeaderButton {
  label: string;
  component: React.ReactNode;
  isVisible?: boolean;
}

interface HeaderState {
  title: string;
  button: HeaderButton | null;
  setTitle: (title: string) => void;
  setButton: (button: HeaderButton | null) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  title: '',
  button: null,
  setTitle: (title) => set({ title }),
  setButton: (button) => set({ button }),
}));
