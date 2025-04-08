import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TranslatedText from "./Language/TranslatedText";
import Spinner from "./Spinner";
import { Input } from "./ui/input";
import { Button as PaginationBtn } from "./ui/button";
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
        <TableHeader className="bg-sidebar ">
          <TableRow>
            <TableHead className="rounded-tl-lg  min-w-10 pl-3">#</TableHead>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                onClick={
                  column.sortable ? () => handleSort(column.key) : undefined
                }
                className={`${
                  column.sortable ? "cursor-pointer select-none" : ""
                }`}
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
              </TableHead>
            ))}
            {actions && (
              <TableHead className="text-center rounded-tr-lg">
                <TranslatedText textKey="action" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
      ),
      [columns, handleSort, sortConfig, actions]
    );
    const renderTableBody = useMemo(() => {
      if (data.length === 0) {
        return (
          <TableRow>
            <TableCell
              colSpan={columns.length + 2}
              className="text-center py-4"
            >
              No data available.
            </TableCell>
          </TableRow>
        );
      }

      return data.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell className="min-w-10 pl-3">{rowIndex + 1 + (currentPage - 1) * pageSize}</TableCell>
          {columns.map((column) => (
            <TableCell key={column.key}>
              {column.render ? column.render(row) : row[column.key]}
            </TableCell>
          ))}
          {actions && (
            <TableCell className="text-center">{actions(row)}</TableCell>
          )}
        </TableRow>
      ));
    }, [isLoading, data, columns, currentPage, pageSize, actions]);

    return (
      <div role="table" aria-label="Data Table">
        <Spinner isLoading={isLoading}></Spinner>
        {/* Top Controls */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div className="w-full max-w-md">
            <Input
              type="search"
              aria-label="Search table"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleInputChange}
              // className="w-full p-2 border border-gray-100 dark:border-gray-800 focus:outline-none rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            
          </div>
          <div className="flex gap-2 flex-wrap">{Button && Button}</div>
        </div>

        {/* Table */}
        <section>
          <div className="shadow rounded-xl dark:shadow-sidebar-accent ">
            <Table>
              {renderTableHeader}
              <TableBody>{renderTableBody}</TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <PaginationBtn
              variant={"secondary"}
              size={"sm"}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <TranslatedText textKey="previous" />
            </PaginationBtn>

            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <PaginationBtn
              variant={"secondary"}
              size={"sm"}
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages || isLoading}
            >
              <TranslatedText textKey="next" />
            </PaginationBtn>
          </div>
        </section>
      </div>
    );
  }
);

ReusableTable.displayName = "ReusableTable";

export default ReusableTable;
