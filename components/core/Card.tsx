import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  const Tag = onClick ? "button" : "div"

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "w-full bg-card rounded-xl border border-border p-5 shadow-sm",
        "text-left",
        onClick && [
          "transition-all duration-200 ease-out",
          "hover:shadow-md hover:border-border",
          "active:scale-[0.99]",
          "cursor-pointer",
        ],
        className
      )}
    >
      {children}
    </Tag>
  )
}
