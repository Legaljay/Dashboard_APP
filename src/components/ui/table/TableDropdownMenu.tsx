import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TableAction {
  label: string;
  icon?: React.ReactNode;
  // onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  onClick: (row: any) => void;
  className?: string;
}

interface TableDropdownMenuProps {
  actions: TableAction[];
  className?: string;
  info: any;
}

export const TableDropdownMenu: React.FC<TableDropdownMenuProps> = ({
  actions,
  className,
  info,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            'hover:bg-accent hover:text-accent-foreground',
            'h-8 w-8 p-0',
            className
          )}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          {actions.map((action, index) => (
            <DropdownMenu.Item
              key={index}
              className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'transition-colors focus:bg-accent focus:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                action.variant === 'destructive' && 'text-red-600 focus:text-red-50'
              )}
              onClick={() => action.onClick(info.row.original)}
              disabled={action.disabled}
            >
              {action.icon && (
                <span className="mr-2 h-4 w-4">
                  {action.icon}
                </span>
              )}
              {action.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
