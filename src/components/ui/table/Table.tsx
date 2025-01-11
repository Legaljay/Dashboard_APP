import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  ColumnResizeMode,
  flexRender,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, MoreHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableCard } from "../skeleton/LoadingSkeleton";
import { Button } from "../button/button";

// Debounce utility function
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export interface TableColumn {
  header: string; // The header displayed for the column
  accessorKey: string; // The key used to access the data for this column
}

export interface TableProps<T> {
  border?: boolean;
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRowClick?: (row: Row<T>) => void;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableResizing?: boolean;
  enableDragging?: boolean;
  enableVirtualization?: boolean;
  enableSelection?: boolean;
  enableColumnVisibility?: boolean;
  enablePolling?: boolean;
  pollingInterval?: number;
  emptyStateMessage?: string;
  loadingMessage?: string;
  className?: string;
  onRefresh?: () => Promise<void>;
  handleButtonClick?: () => void;
  handleBulkAction?: () => void;
  renderEmptyState?: () => React.ReactNode;
  customEmptyStateMessage?: () => React.ReactNode;
  setPageSize?: (pageSize: number) => void;
  setPageCount?: (pageCount: number) => void;
}

const defaultPollingInterval = 30000; // 30 seconds

export function Table<T>({
  border = false,
  data,
  columns,
  isLoading = false,
  isError = false,
  errorMessage = "An error occurred while loading the data.",
  onRowClick,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableResizing = true,
  enableDragging = false,
  enableVirtualization = false,
  enableSelection = false,
  enableColumnVisibility = true,
  enablePolling = false,
  pollingInterval = defaultPollingInterval,
  emptyStateMessage,
  loadingMessage = "Loading...",
  className,
  onRefresh,
  handleButtonClick,
  handleBulkAction,
  renderEmptyState,
  customEmptyStateMessage,
  setPageSize,
  setPageCount,
}: TableProps<T>) {
  // State management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: enableSelection,
    enableColumnResizing: enableResizing,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
  });

  // Virtualization setup
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45, // Estimated row height
    overscan: 10,
  });

  // Polling setup
  useEffect(() => {
    if (!enablePolling || !onRefresh) return;

    const pollData = async () => {
      try {
        await onRefresh();
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    const intervalId = setInterval(pollData, pollingInterval);
    return () => clearInterval(intervalId);
  }, [enablePolling, onRefresh, pollingInterval]);

  // Debounced search
  const debouncedSetGlobalFilter = useMemo(
    () => debounce((value: string) => setGlobalFilter(value), 300),
    []
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-[#FAFAFA] z-10">
          <tr>
            {columns.map((column: any) => (
              <th
                key={column.accessorKey}
                className="px-4 py-2 text-left text-sm font-medium text-gray-500 border-b"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <div className="my-20 flex flex-col items-center gap-3">
        {renderEmptyState && renderEmptyState()}
        {customEmptyStateMessage && customEmptyStateMessage()}
        {emptyStateMessage && (<p className="text-gray-500">{emptyStateMessage}</p>)}
        {onRefresh && (
          <Button
            variant="black"
            className="px-4 py-2 mt-4 text-white"
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
        {handleButtonClick && (
          <Button
            variant="black"
            onClick={handleButtonClick}
            className="outline-none py-3 w-auto px-5 bg-[#121212] rounded-lg text-white text-[14px] font-semibold"
          >
            Add Instructions
          </Button>
        )}
      </div>
    </div>
  );

  // Loading state component
  const LoadingState = () => (
    // <div className="flex items-center justify-center p-8">
    //   <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
    //   <span className="text-gray-500">{loadingMessage}</span>
    // </div>
    <div className="flex flex-col items-center justify-center">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-[#FAFAFA] z-10">
          <tr>
            {columns.map((column: any) => (
              <th
                key={column.accessorKey}
                className="px-4 py-2 text-left text-sm font-medium text-gray-500 border-b"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <div className="relative w-full">
        <TableCard />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
          {loadingMessage}
        </span>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-red-500">
      <p>{errorMessage}</p>
    </div>
  );

  // Render table content
  const renderTableContent = () => {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState />;
    if (!data.length)
      return renderEmptyState ? renderEmptyState() : <EmptyState />;

    return (
      <div ref={tableContainerRef} className="overflow-auto max-h-[600px]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-newAsh z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-2 text-left text-sm font-medium text-gray-500 border-b",
                      header.column.getCanSort() && "cursor-pointer select-none",
                      "cursor-col-resize select-none",
                      header.column.getIsResizing() && "bg-secondary-50",
                    )}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              "w-3 h-3",
                              header.column.getIsSorted() === "asc"
                                ? "text-primary"
                                : "text-gray-400"
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "w-3 h-3",
                              header.column.getIsSorted() === "desc"
                                ? "text-primary"
                                : "text-gray-400"
                            )}
                          />
                        </div>
                      )}
                      {enableResizing && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none",
                            header.column.getIsResizing() && "bg-primary"
                          )}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {enableVirtualization
              ? rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <motion.tr
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={(el) => {
                        if (el) {
                          rowVirtualizer.measureElement(el);
                        }
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn(
                        "hover:bg-gray-50 transition-colors",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-2 text-sm text-gray-900"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })
              : table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "hover:bg-gray-50 transition-colors border-b last:border-b-0 border-b-gray-50",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Search and filters */}
      {enableFiltering && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-full max-w-sm bg-transparent outline-none"
            onChange={(e) => debouncedSetGlobalFilter(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {renderTableContent()}
      </div>

      {/* Pagination */}
      {enablePagination && data.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              title="First Page"
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              title="Previous Page"
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              title="Next Page"
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              title="Last Page"
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <select
              className="px-2 py-1 border rounded-md bg-transparent"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
                setPageSize?.(Number(e.target.value));
              }}
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
