"use client";

import { navigation } from "@/components/SidebarLayout/navigationItems";
import { usePermission } from "@/hooks/usePermission";
import { useUserStore } from "@/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Spinner from "./Spinner";

interface RouteGuardProps {
  children: ReactNode;
}

/**
 * Guards all routes based on navigation items permission configuration
 * This component should be placed high in the component tree to protect all routes
 */
export const RouteGuard = ({ children }: RouteGuardProps) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const { hasPermission } = usePermission();

  useEffect(() => {
    // Skip for public routes
    const publicRoutes = ["/", "/register", "/forgot-password"];
    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    if (!user) {
      router.replace("/");
      return;
    }

    // Check if the current route requires permissions
    const checkRoutePermission = () => {
      // Flatten all navigation items
      const allNavItems = navigation.flatMap((section) =>
        section.items.flatMap((item: any) =>
          item.items ? [item, ...item.items] : [item]
        )
      );

      // Find the current route in navigation
      const currentRoute = allNavItems.find((item) => item.url === pathname);

      // If route has required permissions, check if user has them
      if (currentRoute?.requiredPermissions?.length) {
        const hasAccess = currentRoute.requiredPermissions.some((permission:any) =>
          hasPermission(permission)
        );

        if (!hasAccess) {
          router.replace("/dashboard");
          return false;
        }
      }

      return true;
    };

    const hasAccess = checkRoutePermission();
    setLoading(!hasAccess);
  }, [pathname, router, user, hasPermission]);

  if (loading) {
    return <Spinner isLoading={true} />;
  }

  return <>{children}</>;
};
