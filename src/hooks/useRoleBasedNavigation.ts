import { useUserStore } from "@/stores/userStore";
import { navigation, navigationByRole } from "@/components/Layout/navigationItems";
import { UserRole } from "@/constant/types";

export const useRoleBasedNavigation = () => {
  const user = useUserStore((state) => state.user);
  
  // If user has no role or role doesn't match defined roles, return default navigation
  if (!user?.role) {
    return navigation;
  }
  
  const userRole = user.role as UserRole;
  
  // Return role-specific navigation if available, otherwise return default
//   return navigationByRole[userRole] || navigation;
  return navigationByRole[userRole] || navigation;
};