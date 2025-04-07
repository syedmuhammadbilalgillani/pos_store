"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { deleteUser, fetchUsers } from "@/api/apiFuntions";
import BackButton from "@/components/BackButton";
import UserCsvUploader from "@/components/CSVUploader";
import NotAllowed from "@/components/NotAllowed";
import { PermissionGuard } from "@/components/PermissionGuard";
import ReusableTable from "@/components/ReusableTable";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserExport from "@/components/UsersExport";
import { usersTableColumn } from "@/constant/columns";
import { PERMISSIONS } from "@/constant/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useDebounce } from "@/utils/debounce";

const Users = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { hasPermission, hasAnyPermission } = usePermission();
  const [queryParams, setQueryParams] = useState({
    search: "",
    role: "",
    isActive: undefined as boolean | undefined,
    storeId: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  const debouncedParams = useDebounce(queryParams, 500);

  // Create a condition variable
  const shouldFetchUsers = hasPermission(PERMISSIONS.GET_ALL_USERS);

  const [usersData, setUsersData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch users data
  useEffect(() => {
    if (!shouldFetchUsers) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers(debouncedParams);
        setUsersData(response.data);
      } catch (error: any) {
        toast.error(`Error occurred: ${error?.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [shouldFetchUsers, debouncedParams]);

  const updateParams = useCallback((updates: Partial<typeof queryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...updates,
      page:
        "page" in updates
          ? (updates.page as number)
          : Object.keys(updates).length > 0
          ? 1
          : prev.page,
    }));
  }, []);

  const handleSort = useCallback(
    (key: string, direction: "asc" | "desc") => {
      updateParams({ sortBy: key, sortOrder: direction });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: newPage });
    },
    [updateParams]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      updateParams({ search: searchTerm });
    },
    [updateParams]
  );

  const deleteUserData = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteUser(id);
      setUsersData((prevData: any) => ({
        ...prevData,
        users: prevData.users.filter((user: any) => user._id !== id),
      }));
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(`Error occurred: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isAccess = hasAnyPermission([
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.GET_ALL_USERS,
    PERMISSIONS.IMPORT_USERS,
    PERMISSIONS.EXPORT_USERS,
  ]);
  if (!isAccess) {
    return <NotAllowed />;
  } else
    return (
      <main className="p-4">
        {/* SEO Metadata */}
        <Head>
          <title>User Management | Admin Dashboard</title>
          <meta
            name="description"
            content="Manage users, import CSV, and perform CRUD actions in the admin panel."
          />
          <meta name="robots" content="index, follow" />
        </Head>

        <Spinner isLoading={isLoading} />

        <section className="mb-4">
          <header>
            <h1 className="text-2xl font-bold mb-2">User Management</h1>
            <p className="text-sm text-muted-foreground">
              View, search, sort, and manage users in the system.
            </p>
          </header>
          <div className="flex flex-wrap gap-2 my-4">
            <PermissionGuard permission={PERMISSIONS.CREATE_USER}>
              <Button onClick={() => router.push("/admin/users/create")}>
                Add User
              </Button>
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.EXPORT_USERS}>
              <UserExport />
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.IMPORT_USERS}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Import Users</Button>
                </DialogTrigger>
                <DialogContent className="min-w-fit">
                  <DialogHeader>
                    <DialogTitle>Import Users via CSV</DialogTitle>
                  </DialogHeader>
                  <UserCsvUploader refetch={() => setUsersData(null)} />
                </DialogContent>
              </Dialog>
            </PermissionGuard>
            <BackButton />
          </div>
        </section>

        <section>
          <PermissionGuard permission={PERMISSIONS.GET_ALL_USERS}>
            <ReusableTable
              data={usersData?.users || []}
              columns={usersTableColumn}
              defaultSort={{
                key: queryParams.sortBy,
                direction: queryParams.sortOrder,
              }}
              actions={(row) => (
                <div className="flex items-center justify-center gap-3">
                  <i
                    aria-label="Edit user"
                    className="cursor-pointer fa-duotone fa-pen-to-square text-gray-600 hover:text-gray-800 transition-colors duration-200 text-lg"
                    onClick={() => router.push(`/admin/users/${row._id}`)}
                  />
                  <i
                    aria-label="Delete user"
                    className="cursor-pointer fa-duotone fa-trash-can text-red-500 hover:text-red-700 transition-colors duration-200 text-lg"
                    onClick={() => deleteUserData(row._id)}
                  />
                </div>
              )}
              onSort={handleSort}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
              currentPage={queryParams.page}
              totalPages={usersData?.totalPages || 1}
              isLoading={loading}
            />
          </PermissionGuard>
        </section>
      </main>
    );
};

export default Users;
