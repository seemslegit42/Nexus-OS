// src/components/ui/card.tsx
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
          "rounded-[var(--border-radius-main)] border-[var(--border-width-main)] border-[var(--border-color-main)] bg-[var(--panel-background-color)] text-[var(--text-primary-color)] backdrop-filter-[var(--panel-backdrop-filter)]",
          "animate-pulse-glow-purple", 
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
    className={cn("flex flex-col space-y-1.5 p-[var(--spacing-sm)] md:p-[var(--spacing-md)]", className)}
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
      "text-size-large font-headline font-weight-bold leading-none tracking-tight text-foreground", 
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
    className={cn("text-size-small text-text-secondary-custom", className)} 
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-[var(--spacing-sm)] md:p-[var(--spacing-md)] pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-[var(--spacing-sm)] md:p-[var(--spacing-md)] pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
