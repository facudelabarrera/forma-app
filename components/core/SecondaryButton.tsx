import { cn } from "@/lib/utils"

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "ghost"
  fullWidth?: boolean
}

/**
 * SecondaryButton — secondary action button.
 * Two variants: outline (bordered) and ghost (text-only).
 */
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
        "h-14 px-6 rounded-2xl",
        "font-body font-medium text-base",
        "transition-all duration-150",
        "active:scale-[0.98]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "outline" && [
          "border border-border",
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
