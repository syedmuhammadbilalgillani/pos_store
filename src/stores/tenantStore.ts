import { Tenant } from '@/constant/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encrypt, decrypt } from '@/utils/secureStorage';
import { BROWSER_SECRET } from '@/constant/apiUrl';
import Cookies from "js-cookie";

const SECRET = BROWSER_SECRET; // Preferably from env

interface TenantState {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      setTenant: (tenant) => set({ tenant }),
      clearTenant: () => set({ tenant: null }),
    }),
    {
      name: 'tenant-storage',
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
