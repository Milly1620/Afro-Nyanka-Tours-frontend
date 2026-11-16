import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, wrapperClassName, children, ...props }, ref) => (
    <div className={cn("relative", wrapperClassName)}>
      <select ref={ref} className={cn("w-full appearance-none pr-11", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        size={16}
        strokeWidth={1.85}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
      />
    </div>
  ),
);

NativeSelect.displayName = "NativeSelect";
