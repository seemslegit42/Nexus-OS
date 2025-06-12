
import * as React from "react"
import { Slot } from "@radix-ui/react-slot" 
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean 
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div" 
    return (
      <Comp
        ref={ref}
        className={cn(
          "rounded-2xl border border-primary/30 bg-card backdrop-blur-md text-card-foreground shadow-[0_4px_30px_hsl(var(--primary)/0.12)]", // Updated border opacity and shadow
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 md:p-6", className)} // Adjusted padding
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLHeadingElement> 
>(({ className, ...props }, ref) => (
  <div // Keep as div, font styling applied by parent (e.g. Zone)
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight", // Increased base size
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement, 
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div // Keep as div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 md:p-6 pt-0", className)} {...props} /> // Adjusted padding
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 md:p-6 pt-0", className)} // Adjusted padding
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
