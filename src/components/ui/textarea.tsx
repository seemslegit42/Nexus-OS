import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'backdrop-filter-[var(--panel-backdrop-filter)] flex min-h-[80px] w-full rounded-[var(--border-radius-small)] border-[var(--border-color-main)] border-[var(--border-width-main)] bg-[var(--panel-background-color)] px-3 py-2 text-base text-[var(--text-primary-color)] shadow-[var(--panel-box-shadow)] ring-offset-background placeholder:text-[var(--text-secondary-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
