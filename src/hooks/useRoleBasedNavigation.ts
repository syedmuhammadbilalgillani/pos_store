import { useUserStore } from "@/stores/userStore";
import { UserRole } from "@/constant/types";
import {
  navigation,
  navigationByRole,
} from "@/components/SidebarLayout/navigationItems";

export const useRoleBasedNavigation = () => {
  // const user = useUserStore((state) => state.user);
  
  // if (user?.role) {
  //   // Get first item if navigation is nested array
  //   return Array.isArray(navigation[0]) ? navigation[0] : navigation;
  // }
  
  // const userRole = user.role as UserRole;
  return navigation;
};