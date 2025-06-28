import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-palm focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 tap-target",
  {
    variants: {
      variant: {
        default: "bg-emerald-palm text-white hover:bg-emerald-palm/90",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        outline: "border border-emerald-palm text-emerald-palm bg-transparent hover:bg-emerald-palm/5",
        secondary: "bg-pearl text-emerald-palm hover:bg-pearl/80",
        ghost: "hover:bg-emerald-palm/5 hover:text-emerald-palm",
        link: "text-emerald-palm underline-offset-4 hover:underline",
        gold: "bg-royal-gold text-white hover:bg-royal-gold/90",
        white: "bg-white text-emerald-palm hover:bg-white/90 shadow-md",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }