// Define enums and types
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff",
}
export interface TenantStoreUserDto {
  // Tenant fields
  tenant_name: string;
  tenant_contactEmail: string;
  tenant_contactPhone?: string;
  tenant_isActive: boolean;
  tenant_dbConnectionString: string;
  tenant_settings: Record<string, any>;

  // Store fields
  store_tenantId?: string; // Assuming Types.ObjectId will be string in frontend
  store_name: string;
  store_address?: string;
  store_city?: string;
  store_state?: string;
  store_zipCode?: string;
  store_phone?: string;
  store_email?: string;
  store_timezone?: string;
  store_settings: Record<string, any>;

  // User fields
  user_storeId?: string; // Assuming Types.ObjectId will be string in frontend
  user_firstName: string;
  user_lastName: string;
  user_email: string;
  user_passwordHash: string;
  user_phone: string;
  user_role: UserRole;
  user_isActive: boolean;
  user_lastLogin?: string; // Date as ISO string in frontend
  user_permissions: Record<string, any>;
}

// Form Field Configuration
export interface FormField {
  id: keyof TenantStoreUserDto;
  label: string;
  type: string;
  required?: boolean;
  options?: string[]; // For select inputs
}

// store interface
export interface Tenant {
  _id: string;
  tenantId: string;
  name: string;
  logoUrl: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  timezone: string;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface TenantFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  timezone: string;
  logoUrl: string;
}

export interface User {
  id?: string;
  storeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  lastLogin?: string | null;
  permissions?: Record<string, any>; // Dynamic key-value store
}
