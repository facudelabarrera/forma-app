import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  fullWidth?: boolean
}

/**
 * PrimaryButton — main CTA button.
 * Full-width by default, FORMA accent color.
 */
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
        "h-14 px-6 rounded-2xl",
        "bg-primary text-primary-foreground",
        "font-body font-medium text-base",
        "transition-all duration-150",
        "hover:opacity-90 active:scale-[0.98]",
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
