import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--border-radius-small)] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_2px_10px_hsla(var(--primary-hsl)/0.3)] hover:bg-primary/90 hover:shadow-[0_4px_15px_hsla(var(--primary-hsl)/0.4),0_0_10px_hsla(var(--secondary-hsl)/0.5)]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_2px_10px_hsla(var(--destructive)/0.3)] hover:shadow-[0_4px_15px_hsla(var(--destructive)/0.4)]',
        outline:
          'border border-primary/40 bg-primary/5 backdrop-blur-sm hover:bg-primary/15 hover:text-accent-foreground text-text-primary-custom',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_2px_8px_hsla(var(--secondary-hsl)/0.25)]',
        ghost:
          'hover:bg-accent/15 hover:text-accent-foreground text-text-secondary-custom hover:text-text-primary-custom',
        link: 'text-primary underline-offset-4 hover:underline hover:text-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 px-2 text-xs',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
