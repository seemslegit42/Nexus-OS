
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
          // Updated to use new theme variables for glassmorphism
          "rounded-[var(--border-radius-main)] border-[var(--border-width-main)] border-[var(--border-color-main)] bg-[var(--panel-background-color)] text-[var(--text-primary-color)] shadow-[var(--panel-box-shadow)] backdrop-filter-[var(--panel-backdrop-filter)]",
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
    className={cn("flex flex-col space-y-1.5 p-[var(--spacing-sm)] md:p-[var(--spacing-md)]", className)} // Use spacing tokens
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLHeadingElement> 
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "text-size-large font-headline font-weight-bold leading-none tracking-tight text-text-primary-custom", // Use new font tokens
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("text-size-small text-text-secondary-custom", className)} // Use new font tokens
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-[var(--spacing-sm)] md:p-[var(--spacing-md)] pt-0", className)} {...props} /> // Use spacing tokens
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-[var(--spacing-sm)] md:p-[var(--spacing-md)] pt-0", className)} // Use spacing tokens
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
