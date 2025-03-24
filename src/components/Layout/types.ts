import { ReactNode } from "react";

// types.ts
export interface NavigationItem {
  name: string;
  href: string;
  icon: ReactNode | null;
  current: boolean;
  subItems?: NavigationSubItem[];
}

export interface NavigationSubItem {
  name: string;
  href: string;
  icon: ReactNode | null;
}

export interface Team {
  id: string;
  name: string;
  href: string;
  initial: string;
  current: boolean;
}

export interface UserNavigationItem {
  name: string;
  href: string;
}

export interface Stat {
  label: string;
  value: number;
  icon: string;
}
