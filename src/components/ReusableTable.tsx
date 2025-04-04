import React, { useCallback, useEffect, useMemo, useState } from "react";
import TranslatedText from "./Language/TranslatedText";

interface Column {
  key: string;
  label: React.ReactNode;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface ReusableTableProps {
  data: any[];
  columns: Column[];
  defaultSort?: SortConfig;
  onSort: (key: string, direction: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  Button?: React.ReactNode;
  debounceTime?: number;
  pageSize?: number;
  actions?: (row: any) => React.ReactNode;
}

// 🔷 Tailwind Styles
const TABLE_PARENT =
  "overflow-auto min-w-full bg-white dark:bg-[#15181E] p-4 rounded-xl md:rounded-2xl";
const TABLE_CLASSES =
  "min-w-full table-auto border-separate border-spacing-0 text-sm sm:text-base";
const THEAD_PARENT = "mb-4";
const THEAD_CLASSES =
  "text-gray-500 dark:text-gray-200 bg-[#F8F9FB] dark:bg-gray-700 shadow-sm rounded-lg text-sm sm:text-base";
const TH_CLASSES = "py-3 px-4 sm:px-6 font-medium text-left whitespace-nowrap";
const TD_CLASSES =
  "py-3 px-4 sm:px-6 font-normal text-left text-sm dark:text-gray-300";
const TBODY_PARENT = "bg-white dark:bg-[#15181E]";
const ROW_CLASSES =
  "border-b border-gray-100 dark:border-gray-700 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800";

const ReusableTable: React.FC<ReusableTableProps> = React.memo(
  ({
    data,
    columns,
    defaultSort,
    onSort,
    onPageChange,
    onSearch,
    currentPage,
    totalPages,
    isLoading,
    Button,
    debounceTime = 700,
    pageSize = 10,
    actions,
  }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(
      defaultSort || null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
      if (typeof onSearch !== "function")
        console.error("onSearch callback is required.");
      if (typeof onSort !== "function")
        console.error("onSort callback is required.");
      if (typeof onPageChange !== "function")
        console.error("onPageChange callback is required.");
    }, [onSearch, onSort, onPageChange]);

    const handleSort = useCallback((key: string) => {
      setSortConfig((prevConfig) => {
        let newDirection: "asc" | "desc" = "asc";
        if (prevConfig?.key === key) {
          newDirection = prevConfig.direction === "asc" ? "desc" : "asc";
        }
        return { key, direction: newDirection };
      });
    }, []);

    useEffect(() => {
      if (sortConfig) {
        try {
          onSort(sortConfig.key, sortConfig.direction);
        } catch (error) {
          console.error("Error in onSort callback:", error);
        }
      }
    }, [sortConfig, onSort]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      },
      []
    );

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, debounceTime);
      return () => clearTimeout(handler);
    }, [searchTerm, debounceTime]);

    useEffect(() => {
      try {
        onSearch(debouncedSearchTerm);
      } catch (error) {
        console.error("Error in onSearch callback:", error);
      }
    }, [debouncedSearchTerm, onSearch]);

    const renderTableHeader = useMemo(
      () => (
        <thead className={THEAD_CLASSES}>
          <tr>
            <th scope="col" className={`${TH_CLASSES} rounded-tl-xl`}>
              #
            </th>
            {columns.map((column, index) => (
              <th
                key={column.key}
                scope="col"
                className={`${TH_CLASSES} ${
                  column.sortable ? "cursor-pointer select-none" : ""
                } ${
                  index === columns.length - 1 && !actions
                    ? "rounded-tr-2xl"
                    : ""
                }`}
                onClick={
                  column.sortable ? () => handleSort(column.key) : undefined
                }
              >
                <div className="flex items-center gap-1">
                  <TranslatedText textKey={`${column.label}`} />
                  {column.sortable && (
                    <span aria-hidden="true">
                      <i
                        className={`fa-solid text-xs transition-transform duration-300 ${
                          sortConfig?.key === column?.key
                            ? sortConfig?.direction === "desc"
                              ? "fa-arrow-down rotate-180"
                              : "fa-arrow-down rotate-0"
                            : "fa-arrow-down opacity-30"
                        }`}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && (
              <th className={`${TH_CLASSES} text-center rounded-tr-xl`}>
                <TranslatedText textKey="action" />
              </th>
            )}
          </tr>
        </thead>
      ),
      [columns, handleSort, sortConfig, actions]
    );

    const renderTableBody = useMemo(() => {
      if (isLoading) {
        return (
          <tr>
            <td colSpan={columns.length + 2} className="h-40 text-center">
              Loading...
            </td>
          </tr>
        );
      }

      if (data.length === 0) {
        return (
          <tr>
            <td colSpan={columns.length + 2} className="text-center py-4">
              No data available.
            </td>
          </tr>
        );
      }

      return data.map((row, rowIndex) => (
        <tr key={rowIndex} className={ROW_CLASSES}>
          <td className={TD_CLASSES}>
            {rowIndex + 1 + (currentPage - 1) * pageSize}
          </td>
          {columns.map((column) => (
            <td key={column.key} className={TD_CLASSES}>
              {column.render ? column.render(row) : row[column.key]}
            </td>
          ))}
          {actions && (
            <td className={`${TD_CLASSES} text-center`}>{actions(row)}</td>
          )}
        </tr>
      ));
    }, [isLoading, data, columns, currentPage, pageSize, actions]);

    return (
      <div role="table" aria-label="Data Table">
        {/* Top Controls */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div className="w-full max-w-md">
            <input
              type="search"
              aria-label="Search table"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-100 dark:border-gray-800 focus:outline-none rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex gap-2 flex-wrap">{Button && Button}</div>
        </div>

        {/* Table */}
        <section className={TABLE_PARENT}>
          <div className={THEAD_PARENT}>
            <table className={TABLE_CLASSES}>{renderTableHeader}</table>
          </div>
          <div className={TBODY_PARENT}>
            <table className={TABLE_CLASSES}>
              <tbody className="transition-transform duration-500">
                {renderTableBody}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-5 py-2.5 rounded border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TranslatedText textKey="previous" />
          </button>

          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages || isLoading}
            className="px-5 py-2.5 rounded border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TranslatedText textKey="next" />
          </button>
        </div>
      </div>
    );
  }
);

ReusableTable.displayName = "ReusableTable";

export default ReusableTable;
