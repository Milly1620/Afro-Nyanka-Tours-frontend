import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  wrapperClassName?: string;
}

export function SearchInput({ wrapperClassName, className, placeholder = "Search…", ...props }: SearchInputProps) {
  return (
    <label
      className={cn(
        "flex h-10 items-center gap-2 rounded-[10px] border border-admin-border bg-admin-panel px-3 focus-within:border-admin-orange-line-strong",
        wrapperClassName,
      )}
    >
      <Search size={16} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0 text-admin-placeholder" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder.replace("…", "")}
        className={cn(
          "min-w-0 flex-1 bg-transparent font-admin text-[13.5px] text-admin-text outline-none placeholder:text-admin-placeholder",
          className,
        )}
        {...props}
      />
    </label>
  );
}
