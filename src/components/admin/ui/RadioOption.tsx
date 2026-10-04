import { cn } from "@/lib/utils";

interface RadioOptionProps {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  titleClassName?: string;
}

export function RadioOption({ name, checked, onSelect, title, description, titleClassName }: RadioOptionProps) {
  return (
    <label className="flex w-full cursor-pointer items-start gap-[11px]">
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span
        className={cn(
          "mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-admin-orange",
          checked ? "border-admin-orange" : "border-admin-radio-idle",
        )}
      >
        {checked && <span className="size-2 rounded-full bg-admin-orange" />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span
          className={cn(
            "text-[14px] font-semibold",
            checked ? "text-admin-text" : "text-admin-text-2",
            titleClassName,
          )}
        >
          {title}
        </span>
        <span className="text-[12px] text-admin-subtle">{description}</span>
      </span>
    </label>
  );
}
