"use client";
import { deleteUser, fetchUsers } from "@/api/apiFuntions";
import Button from "@/components/Button";
import UserCsvUploader from "@/components/CSVUploader";
import ReusableTable from "@/components/ReusableTable";
import Spinner from "@/components/Spinner";
import { usersTableColumn } from "@/constant/columns";
import { useFetchData } from "@/hooks/useFetchData";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Users = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // State to track all query parameters
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

  // Use our custom debounce hook
  const debouncedParams = useDebounce(queryParams, 500);

  // Use the hook with debounced parameters
  const { data, loading, refetch } = useFetchData(fetchUsers, {
    initialParams: debouncedParams,
    enabled: false, // Disable automatic fetching
  });

  // Effect to trigger API call when debounced params change
  useEffect(() => {
    refetch(debouncedParams);
  }, [debouncedParams, refetch]);

  // Update parameters without immediate refetch
  const updateParams = useCallback((updates: Partial<typeof queryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...updates,
      // Reset to page 1 if anything other than page changes
      page:
        "page" in updates
          ? (updates.page as number)
          : Object.keys(updates).length > 0
          ? 1
          : prev.page,
    }));
  }, []);

  // Handler functions
  const handleSort = useCallback(
    (key: string, direction: "asc" | "desc") => {
      updateParams({ sortBy: key, sortOrder: direction });
    },
    [updateParams]
  );
  const handlePageChange = useCallback(
    (newPage: number) => {
      console.log("Page change triggered:", newPage);
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
      // console.log()
      toast.success("Operation successfull");
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(`unknown error occured : ${error?.message}`);
    }
  };
  return (
    <div className="p-4 parent">
      <Spinner isLoading={isLoading} />
      <UserCsvUploader refetch={refetch} />

      <ReusableTable
        data={data?.users || []} // Access the users array from response
        columns={usersTableColumn}
        defaultSort={{
          key: queryParams.sortBy,
          direction: queryParams.sortOrder,
        }}
        actions={(row) => (
          <div className="flex gap-2 justify-center">
            <i
              aria-label="edit-btn"
              className="cursor-pointer fa fa-pencil text-purple-500"
              onClick={() => deleteUserData(row._id)}
            ></i>
            <i
              aria-label="delete-btn"
              className="cursor-pointer fa fa-trash text-red-500"
              onClick={() => deleteUserData(row._id)}
            ></i>
          </div>
        )}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        currentPage={queryParams.page}
        totalPages={data?.totalPages || 1} // Use totalPages from response
        isLoading={loading}
        Button={
          <>
            <Button onClick={() => router.push("/admin/users/create")}>
              add
            </Button>

            <Button onClick={() => router.back()}>back</Button>
          </>
        }
      />
    </div>
  );
};

export default Users;
