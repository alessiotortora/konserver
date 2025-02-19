import type { Space } from '@/db/schema';
import { create } from 'zustand';

interface SpaceState {
  currentSpace: Space | null;
  isLoading: boolean;
  setCurrentSpace: (space: Space | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  currentSpace: null,
  isLoading: false,
  setCurrentSpace: (space) => set({ currentSpace: space }),
  setLoading: (isLoading) => set({ isLoading }),
}));
