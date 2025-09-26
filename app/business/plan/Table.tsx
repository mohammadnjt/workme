'use client';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const tableVariants = cva(
  'w-full border-collapse bg-primary-50/70 dark:bg-primary-900/70 backdrop-blur-md rounded-lg shadow-lg overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border border-primary-200 dark:border-secondary-700',
        ghost: 'border-none',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const cellVariants = cva(
  'px-6 py-4 text-left transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'border-b border-primary-200 dark:border-secondary-700',
        ghost: 'border-none',
      },
      type: {
        header: 'font-semibold bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-sm text-secondary-800 dark:text-secondary-200 uppercase tracking-wider sticky top-0 z-10',
        cell: 'text-secondary-800 dark:text-secondary-200',
      },
    },
    defaultVariants: {
      variant: 'default',
      type: 'cell',
    },
  }
);

export interface TableProps extends VariantProps<typeof tableVariants> {
  headers: string[];
  data: Array<Record<string, any>>;
  disableMotion?: boolean;
  renderActions?: (row: Record<string, any>) => React.ReactNode;
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    { headers, data, variant, size, disableMotion = false, renderActions, className },
    ref
  ) => {
    // Normalize header keys to match data keys (case-sensitive)
    const normalizeKey = (header: string) => header;

    return (
      <div className="overflow-x-auto scrollbar-hide">
        {data.length === 0 ? (
          <div className="p-4 text-center text-secondary-600 dark:text-secondary-400 bg-primary-50/70 dark:bg-secondary-900/70 backdrop-blur-md rounded-lg border border-primary-200 dark:border-secondary-700">
            No data available
          </div>
        ) : (
          <table className={cn(tableVariants({ variant, size, className }))}>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={cn(cellVariants({ variant, type: 'header' }))}
                  >
                    {header}
                  </th>
                ))}
                {renderActions && (
                  <th className={cn(cellVariants({ variant, type: 'header' }))}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {data.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={disableMotion ? {} : { opacity: 0, y: 20 }}
                    animate={disableMotion ? {} : { opacity: 1, y: 0 }}
                    exit={disableMotion ? {} : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
                    className={cn(
                      'hover:bg-primary-100/50 dark:hover:bg-secondary-800/50 transition-colors',
                      rowIndex % 2 === 0 && 'bg-primary-50/50 dark:bg-primary-900/50'
                    )}
                  >
                    {headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn(cellVariants({ variant, type: 'cell' }))}
                      >
                        {row[normalizeKey(header)] || '-'}
                      </td>
                    ))}
                    {renderActions && (
                      <td className={cn(cellVariants({ variant, type: 'cell' }))}>
                        {renderActions(row)}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    );
  }
);
Table.displayName = 'Table';

export { Table, tableVariants };