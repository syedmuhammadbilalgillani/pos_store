import { Tenant } from "./types";

export const TenantColumn = [
  {
    header: "tenant.table.name",
    accessor: (item: Tenant) => item.name,
    align: "center" as const,
  },
  {
    header: "tenant.table.email",
    accessor: (item: Tenant) => item.email,
    align: "center" as const,
  },
  {
    header: "tenant.table.phone",
    accessor: (item: Tenant) => item.phone,
    align: "center" as const,
  },
  {
    header: "tenant.table.createdAt",
    accessor: (item: Tenant) => new Date(item.createdAt).toLocaleString(),
    align: "center" as const,
  },
  {
    header: "tenant.table.updatedAt",
    accessor: (item: Tenant) => new Date(item.updatedAt).toLocaleString(),
    align: "center" as const,
  },
];
