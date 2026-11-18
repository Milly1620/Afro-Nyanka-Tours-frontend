import { useRef } from "react";
import { Calendar } from "lucide-react";
import { TextInput } from "@/components/admin/ui/Field";

interface DateFieldProps {
  id: string;
  type: "date" | "datetime-local";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  textClassName?: string;
}

export function DateField({ id, type, value, onChange, disabled, textClassName }: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input || disabled) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  return (
    <TextInput
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      wrapperClassName={disabled ? "opacity-60" : undefined}
      className={`[&::-webkit-calendar-picker-indicator]:hidden ${textClassName ?? ""}`}
      trailing={
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          aria-label="Open calendar"
          className="shrink-0 cursor-pointer text-admin-subtle disabled:cursor-not-allowed"
        >
          <Calendar size={17} strokeWidth={1.85} absoluteStrokeWidth />
        </button>
      }
    />
  );
}
