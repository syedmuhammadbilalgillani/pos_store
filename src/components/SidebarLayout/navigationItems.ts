
import { UserRole } from "@/constant/types";
import { Home, Settings, Users } from "lucide-react";

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
        {
          title: "nav.settings",
          url: "/settings",
          icon: Settings,
          items: [
            { title: "General", url: "/settings/general" },
            { title: "Profile", url: "/settings/profile" },
          ],
        },
      ],
    },
    {
      label: "nav.management",
      items: [
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
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
        {
          title: "nav.settings",
          url: "/settings",
          icon: Settings,
          items: [
            { title: "General", url: "/settings/general" },
            { title: "Profile", url: "/settings/profile" },
          ],
        },
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
        {
          title: "nav.settings",
          url: "/settings",
          icon: Settings,
          items: [
            { title: "General", url: "/settings/general" },
            { title: "Profile", url: "/settings/profile" },
          ],
        },
      ],
    },
   
  ],
};

// Default navigation (keeping for backward compatibility)
export const navigation = [
  [
    {
      label: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
          isActive: true,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          items: [
            { title: "General", url: "/settings/general" },
            { title: "Profile", url: "/settings/profile" },
          ],
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
      ],
    },
  ],
];
