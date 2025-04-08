"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchCategories, deleteCategory } from "@/api/apiFuntions"; // <-- Make sure these API functions exist
import BackButton from "@/components/BackButton";
import NotAllowed from "@/components/NotAllowed";
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
import { categoriesTableColumn } from "@/constant/columns"; // <-- Define category table columns
import { PERMISSIONS } from "@/constant/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useDebounce } from "@/utils/debounce";
import { PermissionGuard } from "@/components/PermissionGuard";

const Categories = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { hasPermission, hasAnyPermission } = usePermission();
  const [queryParams, setQueryParams] = useState({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  const debouncedParams = useDebounce(queryParams, 500);
  const shouldFetch = hasPermission(PERMISSIONS.GET_ALL_CATEGORIES);

  const [categoriesData, setCategoriesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchCategories(debouncedParams);
        setCategoriesData(response.data);
      } catch (error: any) {
        toast.error(`Error occurred: ${error?.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldFetch, debouncedParams]);

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
      updateParams({ search: searchTerm.trim() });
    },
    [updateParams]
  );

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteCategory(id);
      setCategoriesData((prev: any) => ({
        ...prev,
        categories: prev?.categories?.filter((item: any) => item._id !== id),
      }));
      toast.success("Category deleted successfully");
    } catch (error: any) {
      toast.error(`Error occurred: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isAccess = hasAnyPermission([
    PERMISSIONS.CREATE_CATEGORY,
    PERMISSIONS.GET_ALL_CATEGORIES,
  ]);

  if (!isAccess) {
    return <NotAllowed />;
  }

  return (
    <main className="p-4">
      <Head>
        <title>Category Management | Admin Dashboard</title>
        <meta
          name="description"
          content="Manage categories in the admin panel."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <Spinner isLoading={isLoading} />

      <section className="mb-4">
        <header>
          <h1 className="text-2xl font-bold mb-2">Category Management</h1>
          <p className="text-sm text-muted-foreground">
            View, search, sort, and manage product categories and sub-categories.
          </p>
        </header>
        <div className="flex flex-wrap gap-2 my-4">
          <PermissionGuard permission={PERMISSIONS.CREATE_CATEGORY}>
            <Button onClick={() => router.push("/category/create")}>add</Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.CREATE_CATEGORY}>
            <Button onClick={() => router.push("/subcategory/create")}>
              Add Sub-Catgory
            </Button>
          </PermissionGuard>
          <BackButton />
        </div>
      </section>

      <section>
        <PermissionGuard permission={PERMISSIONS.GET_ALL_CATEGORIES}>
          {/* <p>{categoriesData?.totalRecords??0}</p> */}
          <ReusableTable
            data={categoriesData?.data || []}
            columns={categoriesTableColumn}
            defaultSort={{
              key: queryParams.sortBy,
              direction: queryParams.sortOrder,
            }}
            actions={(row) => (
              <div className="flex items-center justify-center gap-3">
              {/* Show subcategory edit icon or no subcategory icon */}
              {row.parent_category_id !== null ? (
                <i
                  aria-label="Edit subcategory"
                  className="cursor-pointer fa-duotone fa-pen-to-square text-primary-600 hover:text-primary-700 transition-colors duration-200 text-lg"
                  onClick={() => router.push(`/subcategory/${row._id}`)}
                  title="Edit Subcategory"
                />
              ) : (
                <i
                  aria-label="No subcategory"
                  className="fa-duotone fa-sitemap text-gray-400"
                  title="Main category (no parent)"
                />
              )}
            
              {/* General edit icon (redirects based on type) */}
              <i
                aria-label="Edit category"
                className="cursor-pointer fa-duotone fa-pen text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg"
                onClick={() =>
                  router.push(
                    row.parent_category_id == null
                      ? `/category/${row._id}`
                      : `/subcategory/${row._id}`
                  )
                }
                title="Edit"
              />
            
              {/* Delete icon */}
              <i
                aria-label="Delete category"
                className="cursor-pointer fa-duotone fa-trash-can text-red-500 hover:text-red-700 transition-colors duration-200 text-lg"
                onClick={() => handleDelete(row._id)}
                title="Delete"
              />
            </div>
            
            )}
            onSort={handleSort}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            currentPage={queryParams.page}
            totalPages={categoriesData?.totalPages || 1}
            isLoading={loading}
          />
        </PermissionGuard>
      </section>
    </main>
  );
};

export default Categories;
