import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: "solid" | "soft";
  label: string;
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  variant = "solid",
  label,
}: FilterPillsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex cursor-pointer items-center rounded-full font-semibold whitespace-nowrap transition-colors",
              variant === "solid" ? solidStyle(active) : softStyle(active),
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  "inline-flex h-[18px] min-w-5 items-center justify-center rounded-full px-[6px] text-[11px] font-bold",
                  active ? "bg-admin-orange-badge text-admin-orange-ink" : "bg-admin-count text-admin-subtle",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function solidStyle(active: boolean) {
  return cn(
    "justify-center px-[14px] py-2 text-[12.5px]",
    active
      ? "bg-admin-orange text-white"
      : "border border-admin-border bg-white text-admin-subtle hover:text-admin-text-2",
  );
}

function softStyle(active: boolean) {
  return cn(
    "gap-[6px] py-2 pr-[13px] pl-[14px] text-[13.5px]",
    active
      ? "bg-admin-orange-soft text-admin-orange-ink"
      : "border border-admin-border bg-white text-admin-text-2 hover:bg-admin-field",
  );
}
