import { cn } from "@/lib/utils"

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "ghost"
  fullWidth?: boolean
}

export function SecondaryButton({
  children,
  variant = "outline",
  fullWidth = true,
  className,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2",
        "h-12 px-6 rounded-xl",
        "font-body font-medium text-base",
        "transition-all duration-200 ease-out",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "outline" && [
          "border border-border bg-card",
          "text-foreground",
          "hover:bg-accent",
        ],
        variant === "ghost" && [
          "text-muted-foreground",
          "hover:text-foreground",
        ],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
