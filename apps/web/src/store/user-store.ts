import type { SafeUser } from '@/types/user';
import { create } from 'zustand';

interface UserState {
  user: SafeUser | null;
  isLoading: boolean;
  setUser: (user: SafeUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  // Computed getter
  get isAuthenticated(): boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  get isAuthenticated() {
    return !!get().user;
  },
}));
