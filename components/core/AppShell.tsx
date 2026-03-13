import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

/**
 * AppShell — mobile-first outer container.
 * Constrains the app to a max-width of 430px and centers it on desktop.
 * All screens render inside this shell.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div
        className={cn(
          "relative w-full max-w-[430px] min-h-screen bg-background flex flex-col overflow-x-hidden",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
