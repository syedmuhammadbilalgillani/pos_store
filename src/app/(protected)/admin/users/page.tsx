"use client";

import React, { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteUser, fetchUsers } from "@/api/apiFuntions";
import Button from "@/components/Button";
import UserCsvUploader from "@/components/CSVUploader";
import ReusableTable from "@/components/ReusableTable";
import Spinner from "@/components/Spinner";
import { usersTableColumn } from "@/constant/columns";
import { useFetchData } from "@/hooks/useFetchData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const Users = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [queryParams, setQueryParams] = useState({
    search: "",
    role: "",
    isActive: undefined as boolean | undefined,
    storeId: "",
    page: 1,
    limit: 10,
    sortBy: "fullName",
    sortOrder: "desc" as "asc" | "desc",
  });

  const debouncedParams = useDebounce(queryParams, 500);
  const { data, loading, refetch } = useFetchData(fetchUsers, {
    initialParams: debouncedParams,
    enabled: false,
  });

  useEffect(() => {
    refetch(debouncedParams);
  }, [debouncedParams, refetch]);

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
      refetch(debouncedParams);
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(`Error occurred: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4">
      {/* SEO Metadata */}
      <Head>
        <title>User Management | Admin Dashboard</title>
        <meta name="description" content="Manage users, import CSV, and perform CRUD actions in the admin panel." />
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
        <div className="flex gap-2 my-4">
          <Button onClick={() => router.push("/admin/users/create")}>
            Add User
          </Button>
          <Button onClick={() => router.back()}>Back</Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Import Users</Button>
            </DialogTrigger>
            <DialogContent className="min-w-fit">
              <DialogHeader>
                <DialogTitle>Import Users via CSV</DialogTitle>
              </DialogHeader>
              <UserCsvUploader refetch={refetch} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section>
        <ReusableTable
          data={data?.users || []}
          columns={usersTableColumn}
          defaultSort={{
            key: queryParams.sortBy,
            direction: queryParams.sortOrder,
          }}
          actions={(row) => (
            <div className="flex gap-2 justify-center">
              <i
                aria-label="Edit user"
                className="cursor-pointer fa fa-pencil text-purple-500"
                onClick={() => router.push(`/admin/users/${row._id}`)}
              />
              <i
                aria-label="Delete user"
                className="cursor-pointer fa fa-trash text-red-500"
                onClick={() => deleteUserData(row._id)}
              />
            </div>
          )}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          currentPage={queryParams.page}
          totalPages={data?.totalPages || 1}
          isLoading={loading}
        />
      </section>
    </main>
  );
};

export default Users;
