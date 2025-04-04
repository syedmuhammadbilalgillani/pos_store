// data.ts
// import {
//   CubeIcon,
//   FolderIcon,
//   HomeIcon,
//   PhotoIcon,
// } from "@heroicons/react/24/outline";
import { NavigationItem, Team, UserNavigationItem } from "./types";
import { UserRole } from "@/constant/types";

// Role-based navigation configuration
export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  [UserRole.ADMIN]: [
    {
      name: "nav.dashboard",
      href: "/dashboard",
      icon: null,
      current: true,
    },
    {
      name: "nav.users",
      href: "/admin/users",
      icon: null,
      current: true,
    },
    // {
    //   name: "nav.user",
    //   href: "/user",
    //   icon: null,
    //   current: false,
    //   subItems: [
    //     {
    //       name: "nav.create",
    //       href: "/user/create",
    //       icon: null,
    //     },
    //     {
    //       name: "nav.users",
    //       href: "/user",
    //       icon: null,
    //     },
    //   ],
    // },
    // {
    //   name: "nav.tenants",
    //   href: "/tenants",
    //   icon: null,
    //   current: false,
    // },
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
  ],
  [UserRole.MANAGER]: [
    // {
    //   name: "nav.dashboard",
    //   href: "/dashboard",
    //   icon: null,
    //   current: true,
    // },
    // {
    //   name: "nav.user",
    //   href: "/user",
    //   icon: null,
    //   current: false,
    //   subItems: [
    //     {
    //       name: "nav.users",
    //       href: "/user",
    //       icon: null,
    //     },
    //   ],
    // },
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
    //   ],
    // },
  ],
  [UserRole.STAFF]: [
    {
      name: "nav.dashboard",
      href: "/dashboard",
      icon: null,
      current: true,
    },
    {
      name: "Products",
      href: "/product",
      icon: null,
      current: false,
      subItems: [
        {
          name: "All Products",
          href: "/product",
          icon: null,
        },
      ],
    },
  ],
};

// Default navigation (keeping for backward compatibility)
export const navigation: NavigationItem[] = [
  {
    name: "nav.dashboard",
    href: "/dashboard",
    icon: null,
    current: true,
  },
  {
    name: "nav.user",
    href: "/user",
    icon: null,
    current: false,
    subItems: [
      {
        name: "nav.create",
        href: "/user/create",
        icon: null,
      },
      {
        name: "nav.users",
        href: "/user",
        icon: null,
      },
    ],
  },
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
