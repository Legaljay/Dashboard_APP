import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TableDropdownMenu } from "./TableDropdownMenu";

// Define status variants
const statusVariants = {
  success: "bg-green-100 text-green-800 border-green-200",
  error: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

type StatusType = keyof typeof statusVariants;

// Status Badge Component
const StatusBadge = ({
  status,
  label,
}: {
  status: StatusType;
  label: string;
}) => (
  <span
    className={cn(
      "px-2 py-1 text-xs font-medium rounded-full border",
      statusVariants[status]
    )}
  >
    {label}
  </span>
);

export const createTypedColumns = <T extends object>() => {
  // Create a column helper
  const columnHelper = createColumnHelper<T>();

  // Custom column definitions
  const createStatusColumn = <K extends keyof T>(
    accessorKey: K,
    header: string,
    statusMapping: Record<string, StatusType> = {}
  ): ColumnDef<T> => {
    return columnHelper.accessor(accessorKey as any, {
      header: () => header,
      cell: (info) => {
        const value = info.getValue() as string;
        const status = statusMapping[value.toLowerCase()] || "info";
        return <StatusBadge status={status} label={value} />;
      },
    });
  };

  const createTextTruncateColumn = <K extends keyof T>(
    accessorKey: K,
    header: string
  ): ColumnDef<T> => {
    return columnHelper.accessor(accessorKey as any, {
      header: () => header,
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <span className="block w-40 truncate cursor-help" title={value}>
            {value}
          </span>
        );
      },
    });
  };

  const createCustomColumn = <K extends keyof T>(
    accessorKey: K,
    accessorKey2: K,
    header: string
  ): ColumnDef<T> => {
    return columnHelper.accessor(accessorKey as any, {
      header: () => header,
      cell: (info) => {
        const value1 = info.row.getValue(accessorKey as string);
        const value2 = info.row.getValue(accessorKey2 as string);
        return (
          <span>
            {value1 as string} {value2 as string}
          </span>
        );
      },
    });
  };

  const createPriorityColumn = <K extends keyof T>(
    accessorKey: K,
    header: string
  ): ColumnDef<T> => {
    return columnHelper.accessor(accessorKey as any, {
      header: () => header,
      cell: (info) => {
        const priority = info.getValue() as "low" | "medium" | "high";
        const variants = {
          low: "bg-green-100 text-green-800",
          medium: "bg-yellow-100 text-yellow-800",
          high: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              variants[priority]
            )}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        );
      },
    });
  };

  const createProgressColumn = <K extends keyof T>(
    accessorKey: K,
    header: string
  ): ColumnDef<T> => {
    return columnHelper.accessor(accessorKey as any, {
      header: () => header,
      cell: (info) => {
        const value = info.getValue() as number;
        return (
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {value}%
            </span>
          </div>
        );
      },
    });
  };

  const createDateTimeColumn = <K extends keyof T>(
    accessorKey: K,
    header: string,
    size: number,
    options?: Intl.DateTimeFormatOptions
  ): ColumnDef<T> => {
    return columnHelper.accessor(accessorKey as any, {
      header: () => header,
      cell: (info) => {
        const value = info.getValue() as string;
        const date = new Date(value);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return <span className="text-red-500">Invalid Date</span>;
        }
        return (
          <span className="text-gray-600 whitespace-nowrap">
            {date.toLocaleString("en-GB", options)?.replace(" at ", ", ")}
          </span>
        );
      },
    });
  };

  const createTagsColumn = <K extends keyof T>(
    accessorKey: K,
    header: string
  ): ColumnDef<T> => {
    return columnHelper.accessor(accessorKey as any, {
      header: () => header,
      cell: (info) => {
        const tags = info.getValue() as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        );
      },
    });
  };

  // Example of action column with buttons
  const createActionsColumn = (
    actions: Array<{
      label: string;
      onClick: (row: T) => void;
      className?: string;
    }>
  ): ColumnDef<T> => {
    return columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        //   <div className="flex gap-2">
        //     {actions.map((action) => (
        //       <button
        //         key={action.label}
        //         onClick={() => action.onClick(info.row.original)}
        //         className={cn(
        //           "px-2 py-1 text-xs rounded-md border hover:bg-gray-50",
        //           action.className
        //         )}
        //       >
        //         {action.label}
        //       </button>
        //     ))}
        //   </div>
        <TableDropdownMenu actions={actions} info={info} />
      ),
    });
  };

  return {
    createStatusColumn,
    createPriorityColumn,
    createDateTimeColumn,
    createActionsColumn,
    createTagsColumn,
    createProgressColumn,
    createTextTruncateColumn,
    createCustomColumn,
  };
};
