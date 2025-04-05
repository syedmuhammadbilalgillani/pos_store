"use client";

import { useUserStore } from "@/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, ReactNode, useState } from "react";
import { navigationByRole } from "./SidebarLayout/navigationItems";
import { UserRole } from "@/constant/types";
import Spinner from "./Spinner";

interface RoleGuardProps {
  children: ReactNode;
}

const RoleGuard = ({ children }: RoleGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const allowedUrls = useMemo(() => {
    if (!user?.role) return [];

    const roleNav = navigationByRole[user.role as UserRole] || [];
    const urls: string[] = [];

    // Define interface that matches your navigation structure
    interface NavItem {
      title: string;
      url: string;
      icon?: any;
      isActive?: boolean;
      items?: Array<{ title: string; url: string }>;
    }

    roleNav.forEach((section) => {
      section.items.forEach((item: NavItem) => {
        urls.push(item.url);
        if (item.items && Array.isArray(item.items)) {
          item.items.forEach((subItem) => urls.push(subItem.url));
        }
      });
    });

    return urls;
  }, [user]);

  useEffect(() => {
    setIsLoading(true);

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedUrls.includes(pathname)) {
      router.replace("/dashboard");
    }

    setIsLoading(false);
  }, [user, pathname, allowedUrls, router]);

  <Spinner isLoading={isLoading} />;

  return <>{children}</>;

  return <>{children}</>;
};

export default RoleGuard;
