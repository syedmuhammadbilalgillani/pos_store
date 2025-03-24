import { Tenant } from '@/constant/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      name: 'tenant-storage', // unique name for localStorage key
    }
  )
);