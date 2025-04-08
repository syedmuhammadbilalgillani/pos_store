import Image from "next/image";

export const usersTableColumn = [
  {
    key: "fullName",
    label: "user.table.fullName",
    sortable: true,
    render: (row: any) => `${row?.firstName} ${row?.lastName}`,
  },
  {
    key: "email",
    label: "user.table.email",
    sortable: true,
  },
  {
    key: "phone",
    label: "user.table.phone",
    sortable: true,
  },
  {
    key: "role",
    label: "user.table.role",
    sortable: false,
    render: (row: any) => row?.role ?? "",
  },
  {
    key: "isActive",
    label: "user.table.isActive",
    sortable: false,
    render: (row: any) => (row?.isActive ? "Active" : "Inactive"),
  },
  {
    key: "lastLogin",
    label: "user.table.lastLogin",
    sortable: true,
    render: (row: any) => new Date(row?.lastLogin).toLocaleString(),
  },
  // {
  //   key: "permissions",
  //   label: "user.table.permissions",
  //   render: (row: any) =>
  //     row?.permissions
  //       ? Object.entries(row?.permissions).map(([key, value]) => (
  //           <div key={key}>
  //             <strong>{key}:</strong> {String(value)}
  //           </div>
  //         ))
  //       : "N/A",
  // },
];
export const categoriesTableColumn = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  {
    key: "image_url",
    label: "Image",
    render: (row: any) => (
      <>
        <img
          src={row.image_url}
          height={80}
          width={80}
          loading="lazy"
          className="rounded-full"
          alt={row.name ?? "alt text"}
        />
      </>
    ),
  },
  { key: "createdAt", label: "Created At" },
];
