import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[25px] w-11 shrink-0 cursor-pointer rounded-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-orange",
        checked ? "bg-admin-accent" : "bg-admin-toggle-off",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] left-[3px] size-[19px] rounded-full bg-white transition-transform",
          checked && "translate-x-[19px]",
        )}
      />
    </button>
  );
}
