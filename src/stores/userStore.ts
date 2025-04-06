// stores/userStore.ts
import { BROWSER_SECRET } from '@/constant/apiUrl';
import { User } from '@/constant/types';
import { decrypt, encrypt } from '@/utils/secureStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Cookies from "js-cookie";

const SECRET = BROWSER_SECRET; // Preferably from env: process.env.NEXT_PUBLIC_SECRET_KEY!

interface UserState {
  user: User | null;
  userPermissions: string[];
  setPermissions: (permissions: string[]) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      userPermissions: [],
      setUser: (user) => set({ user }),
      setPermissions: (permissions) => set({ userPermissions: permissions }),
      clearUser: () => set({ user: null, userPermissions: [] }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const stored = Cookies.get(name);
          if (!stored) return null;
          const decrypted = await decrypt(stored, SECRET);
          return JSON.parse(decrypted);
        },
        setItem: async (name, value) => {
          const stringValue = JSON.stringify(value);
          const encrypted = await encrypt(stringValue, SECRET);
          Cookies.set(name, encrypted);
        },
        removeItem: (name) => Cookies.remove(name),
      })),
    }
  )
);
