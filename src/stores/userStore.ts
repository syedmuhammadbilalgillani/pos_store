import { User } from '@/constant/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';



interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);