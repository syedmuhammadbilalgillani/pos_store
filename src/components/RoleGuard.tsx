"use client";
import { useUserStore } from "@/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, ReactNode, useState } from "react";
import Spinner from "./Spinner";
import { UserRole } from "@/constant/types";

// Define an array of roles with the corresponding paths
export const rolesNavigation = [
  {
    role: "admin" as UserRole,
    paths: [
      { title: "Dashboard", url: "/dashboard" },
      { title: "Overview", url: "/dashboard/overview" },
      { title: "Statistics", url: "/dashboard/statistics" },
      { title: "User Management", url: "/user-management" },
      { title: "Users", url: "/user-management/users" },
      { title: "Roles", url: "/user-management/roles" },
      { title: "Settings", url: "/settings" },
      { title: "General", url: "/settings/general" },
      { title: "Security", url: "/settings/security" },
    ],
  },
  {
    role: "manager" as UserRole,
    paths: [
      { title: "Dashboard", url: "/dashboard" },
      { title: "Overview", url: "/dashboard/overview" },
      { title: "Reports", url: "/dashboard/reports" },
      { title: "Projects", url: "/projects" },
      { title: "Active Projects", url: "/projects/active" },
      { title: "Completed Projects", url: "/projects/completed" },
    ],
  },
  {
    role: "staff" as UserRole,
    paths: [
      { title: "Dashboard", url: "/dashboard" },
      { title: "Overview", url: "/dashboard/overview" },
      { title: "Profile", url: "/profile" },
      { title: "View Profile", url: "/profile/view" },
      { title: "Edit Profile", url: "/profile/edit" },
    ],
  },
];

interface RoleGuardProps {
  children: ReactNode;
}

const RoleGuard = ({ children }: RoleGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  // // Function to check if the current pathname is allowed for the user's role
  // const isPathAllowed = (userRole: UserRole, currentPath: string) => {
  //   // Check if the path starts with any restricted paths based on role
  //   if (userRole === "admin") {
  //     if (currentPath.startsWith("/manager") || currentPath.startsWith("/staff")) {
  //       return false;
  //     }
  //   } else if (userRole === "manager") {
  //     if (currentPath.startsWith("/admin") || currentPath.startsWith("/staff")) {
  //       return false;
  //     }
  //   } else if (userRole === "staff") {
  //     if (currentPath.startsWith("/admin") || currentPath.startsWith("/manager")) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  // useEffect(() => {
  //   setIsLoading(true);

  //   if (!user) {
  //     router.replace("/login");
  //     return;
  //   }

  //   // Check if the current path is allowed based on the user's role
  //   if (!isPathAllowed(user.role, pathname)) {
  //     router.replace("/dashboard");
  //   }

  //   setIsLoading(false);
  // }, [user, pathname, router]);

  // Show spinner while loading
  // if (isLoading) {
  //   return <Spinner isLoading={isLoading} />;
  // }

  return <>{children}</>;
};

export default RoleGuard;
