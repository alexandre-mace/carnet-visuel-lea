import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useFormStatus } from "react-dom"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 rounded-[var(--radius-md)] cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/90",
        outline: "border border-white/20 hover:bg-white/5",
        ghost: "hover:bg-white/10",
      },
      size: {
        default: "h-9 px-3 py-1.5",
        sm: "h-8 px-2",
        lg: "h-10 px-4",
      },
      loading: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "loading"> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, loading: Boolean(isLoading) }), className)}
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

export function FormSubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" isLoading={pending} {...props}>
      {children}
    </Button>
  )
}
