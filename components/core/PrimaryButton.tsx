import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  fullWidth?: boolean
}

export function PrimaryButton({
  children,
  loading = false,
  fullWidth = true,
  disabled,
  className,
  ...props
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={cn(
        "flex items-center justify-center gap-2",
        "h-12 px-6 rounded-xl",
        "bg-primary text-primary-foreground shadow-sm",
        "font-body font-medium text-base",
        "transition-all duration-200 ease-out",
        "hover:opacity-90 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}
