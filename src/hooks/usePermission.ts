// hooks/usePermission.ts

import { useUserStore } from "@/stores/userStore";

export const usePermission = () => {
  const { userPermissions } = useUserStore();
  
  /**
   * Check if user has a specific permission
   * @param permission - Permission to check
   * @returns boolean indicating if user has permission
   */
  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };
  
  /**
   * Check if user has all specified permissions
   * @param permissions - Array of permissions to check
   * @returns boolean indicating if user has all permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return userPermissions.every(permission => permissions.includes(permission));
  };
  
  /**
   * Check if user has any of the specified permissions
   * @param permissions - Array of permissions to check
   * @returns boolean indicating if user has at least one permission
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return userPermissions.some(permission => permissions.includes(permission));
  };
  
  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    userPermissions,
  };
};