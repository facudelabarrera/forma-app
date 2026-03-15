import { cn } from "@/lib/utils"

interface OptionButtonProps {
  label: string
  icon?: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function OptionButton({ label, icon, selected, onClick, className }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-14 px-5 rounded-xl",
        "flex items-center gap-3",
        "font-body text-base text-foreground",
        "border border-border bg-card",
        "transition-all duration-200 ease-out",
        "hover:bg-accent hover:border-border",
        "active:scale-[0.98]",
        selected && "border-foreground bg-accent",
        className
      )}
    >
      {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
      <span className="text-left">{label}</span>
    </button>
  )
}
