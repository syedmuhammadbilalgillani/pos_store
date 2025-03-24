"use client";

import { ReactNode, useState, useEffect, useMemo } from "react";
import TranslatedText from "./Language/TranslatedText";

function SkeletonLoader({
  columns,
  actions,
}: {
  columns: number;
  actions?: boolean;
}) {
  return (
    <tr>
      {Array.from({ length: columns + (actions ? 1 : 0) }).map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );
}

type Column<T> = {
  header: string | ReactNode;
  accessor: keyof T | ((item: T) => ReactNode);
  align?: "left" | "right" | "center";
  searchable?: boolean; // Flag to determine if this column should be included in search
};

type DateFilter = {
  startDate: string | null;
  endDate: string | null;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[] | null | undefined;
  loading?: boolean;
  actions?: (item: T) => ReactNode;
  title?: string;
  headerContent?: ReactNode;
  pageSize?: number;
  searchPlaceholder?: string;
  onSearch?: (filteredData: T[]) => void; // Optional callback for parent component
  errorMessage?: string;
  // Date filter props
  enableDateFilter?: boolean;
  dateKey?: keyof T;
  dateFilterLabel?: string;
};

export default function DataTable<T>({
  columns,
  data,
  loading,
  actions,
  title,
  headerContent,
  pageSize = 10,
  searchPlaceholder = "Search...",
  onSearch,
  errorMessage = "An error occurred while loading data.",
  // Date filter props
  enableDateFilter = false,
  dateKey,
  dateFilterLabel = "Filter by date",
}: TableProps<T>) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  // Safely handle data - ensure we always have an array even if data is null/undefined
  const safeData = useMemo(() => {
    // Check if data is valid
    if (data === null || data === undefined) {
      setError("No data available");
      return [];
    }

    // Verify data is an array
    if (!Array.isArray(data)) {
      setError("Invalid data format");
      return [];
    }

    // Clear any previous errors if data is valid
    setError(null);
    return data;
  }, [data]);

  // Reset to page 1 when search term changes or data changes or date filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, data, dateFilter]);

  // Parse date string to timestamp for comparison
  const parseDate = (dateString: string | null): number => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    return date.getTime();
  };

  // Handle date filter changes
  const handleDateFilterChange = (type: "start" | "end", value: string) => {
    setDateFilter((prev) => ({
      ...prev,
      [type === "start" ? "startDate" : "endDate"]: value || null,
    }));

    // Update active state based on whether any date is set
    const isActive =
      type === "start"
        ? !!value || !!dateFilter.endDate
        : !!dateFilter.startDate || !!value;

    setIsDateFilterActive(isActive);
  };

  // Reset date filters
  const resetDateFilter = () => {
    setDateFilter({ startDate: null, endDate: null });
    setIsDateFilterActive(false);
  };

  // Apply date filtering
  const applyDateFilter = (items: T[]): T[] => {
    if (!enableDateFilter || !dateKey || !isDateFilterActive) return items;

    try {
      return items.filter((item) => {
        try {
          const itemDateValue = item[dateKey];

          // Skip if date value is missing
          if (itemDateValue === null || itemDateValue === undefined)
            return false;

          // Convert item date to timestamp
          let itemDate: number;

          if (itemDateValue instanceof Date) {
            itemDate = itemDateValue.getTime();
          } else if (typeof itemDateValue === "string") {
            itemDate = new Date(itemDateValue).getTime();
          } else if (typeof itemDateValue === "number") {
            // Assume it's already a timestamp
            itemDate = itemDateValue;
          } else {
            // Try to convert to string and parse
            itemDate = new Date(String(itemDateValue)).getTime();
          }

          // Skip invalid dates
          if (isNaN(itemDate)) return false;

          const startTimestamp = parseDate(dateFilter.startDate);
          const endTimestamp = parseDate(dateFilter.endDate);

          // Apply start date filter if set
          if (dateFilter.startDate && itemDate < startTimestamp) {
            return false;
          }

          // Apply end date filter if set
          if (dateFilter.endDate) {
            // Add one day to end date to include the entire day
            const endOfDay = new Date(endTimestamp);
            endOfDay.setHours(23, 59, 59, 999);
            if (itemDate > endOfDay.getTime()) {
              return false;
            }
          }

          return true;
        } catch (err) {
          console.error("Error filtering item by date:", err);
          return false;
        }
      });
    } catch (err) {
      console.error("Error applying date filter:", err);
      return items;
    }
  };

  // Calculate filtered data
  const filteredData = useMemo(() => {
    let filtered = safeData;

    // Apply date filtering first
    if (enableDateFilter && dateKey && isDateFilterActive) {
      filtered = applyDateFilter(filtered);
    }

    // Then apply search term filtering
    if (!searchTerm.trim()) return filtered;

    try {
      return filtered.filter((item) => {
        if (!item) return false;

        return columns.some((column) => {
          // Skip columns that aren't searchable
          if (column.searchable === false) return false;

          try {
            let cellValue: any;

            if (typeof column.accessor === "function") {
              try {
                // Safely call accessor function
                const rendered = column.accessor(item) as any;

                // Try to get text content if it's a React element
                if (
                  rendered &&
                  typeof rendered === "object" &&
                  "props" in rendered
                ) {
                  cellValue = String(rendered.props.children || "");
                } else {
                  cellValue = String(rendered || "");
                }
              } catch (err) {
                console.error("Error accessing column with function:", err);
                return false;
              }
            } else {
              // Safely access property using accessor as key
              const accessorKey = column.accessor as keyof T;
              const propertyValue = item[accessorKey];
              cellValue =
                propertyValue !== null && propertyValue !== undefined
                  ? String(propertyValue)
                  : "";
            }

            return cellValue.toLowerCase().includes(searchTerm.toLowerCase());
          } catch (err) {
            console.error("Error during column search:", err);
            return false;
          }
        });
      });
    } catch (err) {
      console.error("Error during data filtering:", err);
      setError("Error filtering data");
      return [];
    }
  }, [
    safeData,
    columns,
    searchTerm,
    enableDateFilter,
    dateKey,
    isDateFilterActive,
    applyDateFilter,
  ]);
  // before
  // }, [
  //   safeData,
  //   columns,
  //   searchTerm,
  //   enableDateFilter,
  //   dateKey,
  //   isDateFilterActive,
  //   dateFilter,
  // ]);

  // Notify parent component about filtered data if callback provided
  useEffect(() => {
    if (onSearch && Array.isArray(filteredData)) {
      try {
        onSearch(filteredData);
      } catch (err) {
        console.error("Error in onSearch callback:", err);
      }
    }
  }, [filteredData, onSearch]);

  // Sort data when sortColumn changes
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    try {
      return [...filteredData].sort((a, b) => {
        try {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];

          // Handle null/undefined values in sorting
          if (aValue === null || aValue === undefined)
            return sortDirection === "asc" ? -1 : 1;
          if (bValue === null || bValue === undefined)
            return sortDirection === "asc" ? 1 : -1;

          // Handle date values
          if (
            (aValue instanceof Date && bValue instanceof Date) ||
            (typeof aValue === "string" &&
              typeof bValue === "string" &&
              !isNaN(Date.parse(aValue)) &&
              !isNaN(Date.parse(bValue)))
          ) {
            const aDate =
              aValue instanceof Date
                ? aValue.getTime()
                : new Date(aValue).getTime();
            const bDate =
              bValue instanceof Date
                ? bValue.getTime()
                : new Date(bValue).getTime();
            return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
          }

          // Handle sorting for different types
          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
          }

          // Default comparison for other types
          return sortDirection === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        } catch (err) {
          console.error("Error comparing values for sorting:", err);
          return 0;
        }
      });
    } catch (err) {
      console.error("Error sorting data:", err);
      return filteredData;
    }
  }, [filteredData, sortColumn, sortDirection]);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil((sortedData?.length || 0) / pageSize)
  );

  const paginatedData = useMemo(() => {
    try {
      if (!Array.isArray(sortedData) || sortedData.length === 0) {
        return [];
      }

      const startIndex = (currentPage - 1) * pageSize;
      return sortedData.slice(startIndex, startIndex + pageSize);
    } catch (err) {
      console.error("Error creating paginated data:", err);
      return [];
    }
  }, [sortedData, currentPage, pageSize]);

  // Handle column sort
  const handleSort = (column: Column<T>) => {
    try {
      if (typeof column.accessor === "function") return; // Can't sort renderer columns

      const accessor = column.accessor as keyof T;
      if (sortColumn === accessor) {
        // Toggle direction if clicking the same column
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(accessor);
        setSortDirection("asc");
      }
    } catch (err) {
      console.error("Error handling sort:", err);
    }
  };

  // Handle page change
  const goToPage = (page: number) => {
    try {
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      setCurrentPage(page);
    } catch (err) {
      console.error("Error changing page:", err);
      setCurrentPage(1);
    }
  };

  // Reset current state when errors occur
  useEffect(() => {
    if (error) {
      setCurrentPage(1);
    }
  }, [error]);

  // Calculate start and end item numbers
  const startItem = Math.min(
    (currentPage - 1) * pageSize + 1,
    sortedData.length || 0
  );
  const endItem = Math.min(currentPage * pageSize, sortedData.length || 0);

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="flex flex-col space-y-4">
        {/* Header section with title, search, date filter and additional content */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          {title && <h2 className="text-black font-[500] text-xl">{title}</h2>}

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Additional header content */}
            {headerContent && <div className="flex gap-2">{headerContent}</div>}
          </div>
        </div>

        {/* Date filter section - only render if enabled */}
        {enableDateFilter && dateKey && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 dark:bg-[#303643] rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {dateFilterLabel}:
            </span>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="start-date"
                  className="text-sm text-gray-600 dark:text-gray-200"
                >
                  From:
                </label>
                <input
                  id="start-date"
                  type="date"
                  className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-white "
                  max={dateFilter.endDate || today}
                  value={dateFilter.startDate || ""}
                  onChange={(e) =>
                    handleDateFilterChange("start", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="end-date"
                  className="text-sm text-gray-600 dark:text-gray-200"
                >
                  To:
                </label>
                <input
                  id="end-date"
                  type="date"
                  className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  min={dateFilter.startDate || ""}
                  max={today}
                  value={dateFilter.endDate || ""}
                  onChange={(e) =>
                    handleDateFilterChange("end", e.target.value)
                  }
                />
              </div>

              {isDateFilterActive && (
                <button
                  className="px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 dark:bg-black dark:text-white dark:border-none dark:hover:text-black rounded-md hover:bg-gray-100"
                  onClick={resetDateFilter}
                >
                  Clear
                </button>
              )}
            </div>

            {isDateFilterActive && (
              <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Date filter active
              </div>
            )}
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div className="p-4 border-l-4 border-red-500 bg-red-50 text-red-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error || errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto shadow-md rounded-lg [&::-webkit-scrollbar]:h-1.5">
          <table className="min-w-dvw bg-white">
            <thead className="bg-[#F8F9FB] dark:bg-[#303643] ">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-${
                      column.align || "left"
                    } text-xs font-medium text-black dark:text-white uppercase tracking-wider whitespace-nowrap cursor-pointer`}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <TranslatedText textKey={column.header as string} />
                      {typeof column.accessor !== "function" &&
                        sortColumn === column.accessor && (
                          <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                        )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                    <TranslatedText textKey="action" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <>
                  {Array.from({ length: pageSize }).map((_, index) => (
                    <SkeletonLoader
                      key={index}
                      columns={columns.length}
                      actions={!!actions}
                    />
                  ))}
                </>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-4 text-center text-sm text-gray-900"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-4 text-center text-sm text-gray-900"
                  >
                    {searchTerm || isDateFilterActive
                      ? "No matching results found"
                      : "No data available"}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 ">
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap max-w-[50vw] min-w-auto text-wrap break-words text-sm text-gray-900 dark:text-white dark:bg-[#15181E]  text-${
                          column.align || "left"
                        }`}
                      >
                        {(() => {
                          try {
                            if (typeof column.accessor === "function") {
                              return column.accessor(item);
                            } else {
                              const value = item[column.accessor];
                              return value !== null && value !== undefined
                                ? String(value)
                                : "";
                            }
                          } catch (err) {
                            console.error("Error rendering cell:", err);
                            return "Error";
                          }
                        })()}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white dark:bg-[#15181E]">
                        {(() => {
                          try {
                            return actions(item);
                          } catch (err) {
                            console.error("Error rendering actions:", err);
                            return <span className="text-red-500">Error</span>;
                          }
                        })()}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls - only show if we have data and no errors */}
        {!loading && !error && totalPages > 1 && (
  <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-background dark:border-gray-700 sm:px-6">
    <div className="flex justify-between w-full">
      <div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {sortedData.length > 0 ? (
            <>
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{sortedData.length}</span> results
            </>
          ) : (
            "No results"
          )}
        </p>
      </div>
      <div className="flex space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 transition ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          Previous
        </button>

        {/* Page Number Buttons */}
        <div className="hidden md:flex">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
            let pageNum = currentPage;
            if (currentPage < 3) {
              pageNum = idx + 1;
            } else if (currentPage > totalPages - 2) {
              pageNum = totalPages - 4 + idx;
            } else {
              pageNum = currentPage - 2 + idx;
            }

            return pageNum > 0 && pageNum <= totalPages ? (
              <button
                key={idx}
                onClick={() => goToPage(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 transition ${
                  currentPage === pageNum
                    ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            ) : null;
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 transition ${
            currentPage === totalPages
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
}
// usage
{
  /* <DataTable<Order>
  columns={[
    { header: "Order ID", accessor: "id" },
    { header: "Customer", accessor: "customerName" },
    { header: "Amount", accessor: "amount", align: "right" },
    { header: "Date", accessor: "orderDate" }
  ]}
  data={orders}
  loading={isLoading}
  title="Order History"
  // Date filter configuration
  enableDateFilter={true}
  dateKey="orderDate"
  dateFilterLabel="Filter by order date"
/> */
}
// const emailsColumn = [
//   {
//     header: "NAME",
//     accessor: (item: EmailLeadData) => item.email,
//     align: "center" as const,
//   },
//   {
//     header: "USED",
//     align: "center" as const,
//     accessor: (item: EmailLeadData) => (
//       <span
//         aria-label={item.isSend ? "Email sent" : "Email not sent"}
//         title={item.isSend ? "Email sent" : "Email not sent"}
//       >
//         <i
//           className={`fa fa-dutone ${
//             item.isSend ? "fa-check text-green-400" : "fa-xmark text-red-600"
//           }`}
//           aria-hidden="true"
//         ></i>
//       </span>
//     ),
//   },
// ];

// ########################
// "use client";

// import { ReactNode, useState, useEffect, useMemo } from "react";

// // Skeleton Loader Component
// const SkeletonLoader = ({ columns, actions }: { columns: number; actions?: boolean }) => (
//   <tr>
//     {Array.from({ length: columns + (actions ? 1 : 0) }).map((_, index) => (
//       <td key={index} className="px-6 py-4 whitespace-nowrap">
//         <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
//       </td>
//     ))}
//   </tr>
// );

// // Types
// type Column<T> = {
//   header: string | ReactNode;
//   accessor: keyof T | ((item: T) => ReactNode);
//   align?: "left" | "right" | "center";
//   searchable?: boolean;
// };

// type DateFilter = { startDate: string | null; endDate: string | null };

// type TableProps<T> = {
//   columns: Column<T>[];
//   data: T[] | null | undefined;
//   loading?: boolean;
//   actions?: (item: T) => ReactNode;
//   title?: string;
//   headerContent?: ReactNode;
//   pageSize?: number;
//   searchPlaceholder?: string;
//   onSearch?: (filteredData: T[]) => void;
//   errorMessage?: string;
//   enableDateFilter?: boolean;
//   dateKey?: keyof T;
//   dateFilterLabel?: string;
//   onPageChange?: (page: number) => void; // New prop for API pagination
// };

// // Date Filter Component
// const DateFilterComponent = <T,>({
//   enableDateFilter,
//   dateKey,
//   dateFilterLabel,
//   dateFilter,
//   setDateFilter,
//   isDateFilterActive,
//   setIsDateFilterActive,
// }: {
//   enableDateFilter?: boolean;
//   dateKey?: keyof T;
//   dateFilterLabel?: string;
//   dateFilter: DateFilter;
//   setDateFilter: (filter: DateFilter) => void;
//   isDateFilterActive: boolean;
//   setIsDateFilterActive: (active: boolean) => void;
// }) => {
//   const today = new Date().toISOString().split("T")[0];

//   const handleDateFilterChange = (type: "start" | "end", value: string) => {
//     setDateFilter({
//       ...dateFilter,
//       [type === "start" ? "startDate" : "endDate"]: value || null,
//     });
//     const isActive = type === "start"
//       ? !!value || !!dateFilter.endDate
//       : !!dateFilter.startDate || !!value;
//     setIsDateFilterActive(isActive);
//   };

//   const resetDateFilter = () => {
//     setDateFilter({ startDate: null, endDate: null });
//     setIsDateFilterActive(false);
//   };

//   if (!enableDateFilter || !dateKey) return null;

//   return (
//     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
//       <span className="text-sm font-medium text-gray-700">{dateFilterLabel}:</span>
//       <div className="flex flex-col sm:flex-row gap-2">
//         <div className="flex items-center gap-2">
//           <label htmlFor="start-date" className="text-sm text-gray-600">From:</label>
//           <input
//             id="start-date"
//             type="date"
//             className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
//             max={dateFilter.endDate || today}
//             value={dateFilter.startDate || ""}
//             onChange={(e) => handleDateFilterChange("start", e.target.value)}
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <label htmlFor="end-date" className="text-sm text-gray-600">To:</label>
//           <input
//             id="end-date"
//             type="date"
//             className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
//             min={dateFilter.startDate || ""}
//             max={today}
//             value={dateFilter.endDate || ""}
//             onChange={(e) => handleDateFilterChange("end", e.target.value)}
//           />
//         </div>
//         {isDateFilterActive && (
//           <button
//             className="px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
//             onClick={resetDateFilter}
//           >
//             Clear
//           </button>
//         )}
//       </div>
//       {isDateFilterActive && (
//         <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//           Date filter active
//         </div>
//       )}
//     </div>
//   );
// };

// // Pagination Component
// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   sortedDataLength,
//   pageSize,
//   useApiPagination,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   sortedDataLength: number;
//   pageSize: number;
//   useApiPagination?: boolean;
// }) => {
//   const startItem = Math.min((currentPage - 1) * pageSize + 1, sortedDataLength || 0);
//   const endItem = Math.min(currentPage * pageSize, sortedDataLength || 0);

//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
//       <div className="flex justify-between w-full">
//         <div>
//           <p className="text-sm text-gray-700">
//             {sortedDataLength > 0 ? (
//               <>Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{sortedDataLength}</span> results</>
//             ) : "No results"}
//           </p>
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"} border border-gray-300`}
//           >
//             Previous
//           </button>
//           {!useApiPagination && (
//             <div className="hidden md:flex">
//               {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
//                 const pageNum = currentPage < 3 ? idx + 1 : currentPage > totalPages - 2 ? totalPages - 4 + idx : currentPage - 2 + idx;
//                 if (pageNum > 0 && pageNum <= totalPages) {
//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => onPageChange(pageNum)}
//                       className={`px-4 py-2 text-sm font-medium ${currentPage === pageNum ? "bg-white text-white" : "bg-white text-gray-700 hover:bg-gray-50"} border border-gray-300`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 }
//                 return null;
//               })}
//             </div>
//           )}
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"} border border-gray-300`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main DataTable Component
// export default function DataTable<T>({
//   columns,
//   data,
//   loading,
//   actions,
//   title,
//   headerContent,
//   pageSize = 10,
//   searchPlaceholder = "Search...",
//   onSearch,
//   errorMessage = "An error occurred while loading data.",
//   enableDateFilter = false,
//   dateKey,
//   dateFilterLabel = "Filter by date",
//   onPageChange,
// }: TableProps<T>) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
//   const [error, setError] = useState<string | null>(null);
//   const [dateFilter, setDateFilter] = useState<DateFilter>({ startDate: null, endDate: null });
//   const [isDateFilterActive, setIsDateFilterActive] = useState(false);

//   const safeData = useMemo(() => {
//     if (data === null || data === undefined) {
//       setError("No data available");
//       return [];
//     }
//     if (!Array.isArray(data)) {
//       setError("Invalid data format");
//       return [];
//     }
//     setError(null);
//     return data;
//   }, [data]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, data, dateFilter]);

//   const parseDate = (dateString: string | null): number => {
//     if (!dateString) return 0;
//     return new Date(dateString).getTime();
//   };

//   const applyDateFilter = (items: T[]): T[] => {
//     if (!enableDateFilter || !dateKey || !isDateFilterActive) return items;
//     return items.filter((item) => {
//       const itemDateValue = item[dateKey!];
//       if (!itemDateValue) return false;
//       const itemDate = typeof itemDateValue === "string" ? new Date(itemDateValue).getTime() : itemDateValue instanceof Date ? itemDateValue.getTime() : Number(itemDateValue);
//       if (isNaN(itemDate)) return false;
//       const startTimestamp = parseDate(dateFilter.startDate);
//       const endTimestamp = parseDate(dateFilter.endDate);
//       if (dateFilter.startDate && itemDate < startTimestamp) return false;
//       if (dateFilter.endDate && itemDate > new Date(endTimestamp).setHours(23, 59, 59, 999)) return false;
//       return true;
//     });
//   };

//   const filteredData = useMemo(() => {
//     let filtered = applyDateFilter(safeData);
//     if (!searchTerm.trim()) return filtered;
//     return filtered.filter((item) =>
//       columns.some((column) => {
//         if (column.searchable === false) return false;
//         const value = typeof column.accessor === "function"
//           ? String(column.accessor(item) || "")
//           : String(item[column.accessor as keyof T] || "");
//         return value.toLowerCase().includes(searchTerm.toLowerCase());
//       })
//     );
//   }, [safeData, columns, searchTerm, enableDateFilter, dateKey, isDateFilterActive, dateFilter]);

//   useEffect(() => onSearch?.(filteredData), [filteredData, onSearch]);

//   const sortedData = useMemo(() => {
//     if (!sortColumn) return filteredData;
//     return [...filteredData].sort((a, b) => {
//       const aValue = a[sortColumn];
//       const bValue = b[sortColumn];
//       if (aValue == null) return sortDirection === "asc" ? -1 : 1;
//       if (bValue == null) return sortDirection === "asc" ? 1 : -1;
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
//       }
//       return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
//     });
//   }, [filteredData, sortColumn, sortDirection]);

//   const paginatedData = useMemo(() => {
//     if (onPageChange) return sortedData; // Return full data if using API pagination
//     const startIndex = (currentPage - 1) * pageSize;
//     return sortedData.slice(startIndex, startIndex + pageSize);
//   }, [sortedData, currentPage, pageSize, onPageChange]);

//   const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

//   const handleSort = (column: Column<T>) => {
//     if (typeof column.accessor === "function") return;
//     const accessor = column.accessor as keyof T;
//     setSortColumn(sortColumn === accessor ? sortColumn : accessor);
//     setSortDirection(sortColumn === accessor ? (sortDirection === "asc" ? "desc" : "asc") : "asc");
//   };

//   const handlePageChange = (page: number) => {
//     if (onPageChange) {
//       onPageChange(page);
//       setCurrentPage(page);
//     } else {
//       setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
//         {title && <h2 className="text-black font-[500] text-xl">{title}</h2>}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder={searchPlaceholder}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 onClick={() => setSearchTerm("")}
//               >
//                 ×
//               </button>
//             )}
//           </div>
//           {headerContent && <div className="flex gap-2">{headerContent}</div>}
//         </div>
//       </div>

//       <DateFilterComponent
//         enableDateFilter={enableDateFilter}
//         dateKey={dateKey}
//         dateFilterLabel={dateFilterLabel}
//         dateFilter={dateFilter}
//         setDateFilter={setDateFilter}
//         isDateFilterActive={isDateFilterActive}
//         setIsDateFilterActive={setIsDateFilterActive}
//       />

//       {error && (
//         <div className="p-4 border-l-4 border-red-500 bg-red-50 text-red-700">
//           <div className="flex">
//             <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <p className="ml-3 text-sm">{error || errorMessage}</p>
//           </div>
//         </div>
//       )}

//       <div className="w-full overflow-x-auto shadow-md rounded-lg [&::-webkit-scrollbar]:h-1.5">
//         <table className="min-w-dvw bg-white">
//           <thead className="bg-[#F8F9FB] dark:bg-[#303643]">
//             <tr>
//               {columns.map((column, index) => (
//                 <th
//                   key={index}
//                   className={`px-6 py-3 text-${column.align || "left"} text-xs font-medium text-black dark:text-white uppercase tracking-wider whitespace-nowrap cursor-pointer`}
//                   onClick={() => handleSort(column)}
//                 >
//                   <div className="flex items-center justify-center gap-1">
//                     {column.header}
//                     {typeof column.accessor !== "function" && sortColumn === column.accessor && (
//                       <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
//                     )}
//                   </div>
//                 </th>
//               ))}
//               {actions && <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">ACTIONS</th>}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {loading ? (
//               Array.from({ length: pageSize }).map((_, index) => (
//                 <SkeletonLoader key={index} columns={columns.length} actions={!!actions} />
//               ))
//             ) : error ? (
//               <tr>
//                 <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-900">
//                   {error}
//                 </td>
//               </tr>
//             ) : paginatedData.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-900">
//                   {searchTerm || isDateFilterActive ? "No matching results found" : "No data available"}
//                 </td>
//               </tr>
//             ) : (
//               paginatedData.map((item, rowIndex) => (
//                 <tr key={rowIndex} className="hover:bg-gray-50">
//                   {columns.map((column, colIndex) => (
//                     <td
//                       key={colIndex}
//                       className={`px-6 py-4 whitespace-nowrap max-w-[50vw] min-w-auto text-wrap break-words text-sm text-gray-900 dark:text-white dark:bg-[#15181E] text-${column.align || "left"}`}
//                     >
//                       {typeof column.accessor === "function" ? column.accessor(item) : String(item[column.accessor] ?? "")}
//                     </td>
//                   ))}
//                   {actions && (
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       {actions(item)}
//                     </td>
//                   )}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {!loading && !error && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//           sortedDataLength={sortedData.length}
//           pageSize={pageSize}
//           useApiPagination={!!onPageChange}
//         />
//       )}
//     </div>
//   );
// }
