// components/PermissionGuard.tsx
import React from 'react';
import { usePermission } from '@/hooks/usePermission';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  type?: 'all' | 'any';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component to conditionally render UI elements based on user permissions
 * 
 * @param permission - Single permission to check
 * @param permissions - Array of permissions to check (used with type)
 * @param type - 'all': user must have all permissions, 'any': user must have at least one permission
 * @param fallback - Optional component to render if user doesn't have permission
 * @param children - Content to show if user has permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions = [],
  type = 'all',
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermission();
  
  // Check if the user has access
  let hasAccess = false;
  
  if (permission) {
    // Single permission check
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    // Multiple permissions check
    hasAccess = type === 'all' 
      ? hasAllPermissions(permissions) 
      : hasAnyPermission(permissions);
  } else {
    // No permission specified, allow access
    hasAccess = true;
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};