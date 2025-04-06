import { UserRole } from "@/constant/types";
import { PERMISSIONS } from "@/constant/permissions";
import { Home, Settings, Users, Users2 } from "lucide-react";

// Role-based navigation configuration
export const navigationByRole = {
  [UserRole.ADMIN]: [
    {
      label: "Platform",
      items: [
        {
          title: "nav.dashboard",
          url: "/dashboard",
          icon: Home,
          isActive: true,
        },
        // {
        //   title: "nav.settings",
        //   url: "/settings",
        //   icon: Settings,
        //   items: [
        //     { title: "General", url: "/settings/general" },
        //     { title: "Profile", url: "/settings/profile" },
        //   ],
        // },
      ],
    },
    {
      label: "nav.management",
      items: [
        {
          title: "nav.user",
          url: "#",
          icon: Users2,
          items: [
            { title: "nav.users", url: "/admin/users" },
            { title: "nav.create", url: "/admin/users/create" },
            // { title: "id", url: "/admin/users/:id" },
          ],
        },
      ],
    },
  ],

  [UserRole.MANAGER]: [
    {
      label: "Platform",
      items: [
        {
          title: "nav.dashboard",
          url: "/dashboard",
          icon: Home,
          isActive: true,
        },
        // {
        //   title: "nav.settings",
        //   url: "/settings",
        //   icon: Settings,
        //   items: [
        //     { title: "General", url: "/settings/general" },
        //     { title: "Profile", url: "/settings/profile" },
        //   ],
        // },
      ],
    },
  ],
  [UserRole.STAFF]: [
    {
      label: "Platform",
      items: [
        {
          title: "nav.dashboard",
          url: "/dashboard",
          icon: Home,
          isActive: true,
        },
        // {
        //   title: "nav.settings",
        //   url: "/settings",
        //   icon: Settings,
        //   items: [
        //     { title: "General", url: "/settings/general" },
        //     { title: "Profile", url: "/settings/profile" },
        //   ],
        // },
      ],
    },
  ],
};

// Default navigation with permission requirements
export const navigation = [
  {
    label: "Platform",
    items: [
      {
        title: "nav.dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        // Dashboard visible to all
      },
      // {
      //   title: "nav.settings",
      //   url: "/settings",
      //   icon: Settings,
      //   items: [
      //     { title: "General", url: "/settings/general" },
      //     { title: "Profile", url: "/settings/profile" },
      //   ],
      // },
    ],
  },
  {
    label: "nav.management",
    items: [
      {
        title: "nav.user",
        url: "#",
        icon: Users2,
        requiredPermissions: [PERMISSIONS.GET_ALL_USERS],
        items: [
          { 
            title: "nav.users", 
            url: "/admin/users",
            requiredPermissions: [PERMISSIONS.GET_ALL_USERS],
          },
          { 
            title: "nav.create", 
            url: "/admin/users/create",
            requiredPermissions: [PERMISSIONS.CREATE_USER], 
          },
          // { title: "id", url: "/admin/users/:id" },
        ],
      },
    ],
  },
];
