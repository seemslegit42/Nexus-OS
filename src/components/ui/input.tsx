import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'backdrop-filter-[var(--panel-backdrop-filter)] flex h-10 w-full rounded-[var(--border-radius-small)] border-[var(--border-color-main)] border-[var(--border-width-main)] bg-[var(--panel-background-color)] px-3 py-2 text-base text-[var(--text-primary-color)] shadow-[var(--panel-box-shadow)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
