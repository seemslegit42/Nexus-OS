
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, style, ...props }, ref) => ( // Added style to props
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary", // bg-secondary is fine for the track
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all" // Removed bg-primary, will be controlled by CSS var
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundColor: 'var(--progress-indicator-color, hsl(var(--primary)))', // Fallback to ShadCN primary
        ...(style || {}), // Merge with any passed styles
       }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
