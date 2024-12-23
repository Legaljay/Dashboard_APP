import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'outline';

interface TableBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary hover:bg-primary/20',
  secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
  success: 'bg-green-100 text-green-700 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  error: 'bg-red-100 text-red-700 hover:bg-red-200',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
};

export const TableBadge: React.FC<TableBadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
