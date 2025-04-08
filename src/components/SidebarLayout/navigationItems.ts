import { PERMISSIONS } from "@/constant/permissions";
import { Home, Type, Users2 } from "lucide-react";

export const navigation = [
  {
    label: "Platform",
    items: [
      {
        title: "nav.dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        requiredPermissions: [PERMISSIONS.DASHBOARD],
      },
      {
        title: "Category",
        url: "/category",
        icon: Type,
        isActive: false,
        requiredPermissions: [PERMISSIONS.CATEGORYMANAGEMENT],
      },
    ],
  },
  {
    label: "nav.management",
    items: [
      {
        title: "nav.users",
        url: "/admin/users",
        icon: Users2,
        isActive: true,
        requiredPermissions: [PERMISSIONS.USERSMANAGEMENT],
      },
      // {
      //   title: "nav.user",
      //   url: "#",
      //   icon: Users2,
      //   requiredPermissions: [PERMISSIONS.GET_ALL_USERS],
      //   items: [
      //     {
      //       title: "nav.users",
      //       url: "/admin/users",
      //       requiredPermissions: [PERMISSIONS.GET_ALL_USERS],
      //     },
      //     {
      //       title: "nav.create",
      //       url: "/admin/users/create",
      //       requiredPermissions: [PERMISSIONS.CREATE_USER],
      //     },
      //     // { title: "id", url: "/admin/users/:id" },
      //   ],
      // },
    ],
  },
];
