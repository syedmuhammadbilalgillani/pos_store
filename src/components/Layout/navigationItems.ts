// data.ts
// import {
//   CubeIcon,
//   FolderIcon,
//   HomeIcon,
//   PhotoIcon,
// } from "@heroicons/react/24/outline";
import { NavigationItem, Team, UserNavigationItem } from "./types";

// Example navigation data with icons and submenus
export const navigation: NavigationItem[] = [
  {
    name: "nav.dashboard",
    href: "/dashboard",
    icon: null,
    current: true,
  },
  // {
  //   name: "nav.tenants",
  //   href: "/tenants",
  //   icon: null,
  //   current: false,
  // },
  {
    name: "nav.tenant",
    href: "/tenants",
    icon: null,
    current: false,
    subItems: [
      {
        name: "Create",
        href: "/tenants/create",
        icon: null,
      },
      {
        name: "nav.tenants",
        href: "/tenants",
        icon: null,
      },
    ],
  },
  // {
  //   name: "Products",
  //   href: "/product",
  //   icon: null,
  //   current: false,
  //   subItems: [
  //     {
  //       name: "All Products",
  //       href: "/product",
  //       icon: null,
  //     },
  //     {
  //       name: "Add Product",
  //       href: "/product/create",
  //       icon: null,
  //     },
  //     {
  //       name: "Product Settings",
  //       href: "/product/settings",
  //       icon: null,
  //     },
  //   ],
  // },
];

export const teams: Team[] = [
  // { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  // { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  // { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

export const userNavigation: UserNavigationItem[] = [
  { name: "Your profile", href: "#" },
  // { name: "Sign out", href: "#" },
];
