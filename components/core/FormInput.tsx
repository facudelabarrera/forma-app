import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="font-body text-sm font-medium text-foreground"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-12 px-4 rounded-2xl",
            "border border-border bg-card",
            "font-body text-base text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-foreground/20",
            "transition-colors duration-150",
            error && "border-red-400 focus:ring-red-400/20",
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p className="font-body text-xs text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="font-body text-xs text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"
