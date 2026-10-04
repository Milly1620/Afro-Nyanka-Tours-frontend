import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-[10px] border border-admin-border bg-admin-field font-admin text-[14px] text-admin-text outline-none transition-colors placeholder:text-admin-subtle focus-within:border-admin-orange-line-strong focus-within:ring-2 focus-within:ring-admin-orange-soft";

interface FieldProps {
  label: string;
  hint?: ReactNode;
  labelClassName?: string;
  className?: string;
  children: (id: string) => ReactNode;
}

export function Field({ label, hint, labelClassName, className, children }: FieldProps) {
  const id = useId();
  return (
    <div className={cn("flex min-w-0 flex-col gap-[7px]", className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className={cn("text-[12.5px] font-medium text-admin-subtle", labelClassName)}>
          {label}
        </label>
        {hint}
      </div>
      {children(id)}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  trailing?: ReactNode;
  leading?: ReactNode;
  wrapperClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ trailing, leading, wrapperClassName, className, ...props }, ref) => (
    <div className={cn(controlBase, "flex h-[42px] items-center gap-[10px] px-[14px]", wrapperClassName)}>
      {leading}
      <input
        ref={ref}
        className={cn("h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-admin-subtle", className)}
        {...props}
      />
      {trailing}
    </div>
  ),
);

TextInput.displayName = "TextInput";

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(controlBase, "min-h-[54px] resize-y px-[14px] pt-3 pb-2 leading-[1.4] text-admin-text-2", className)}
      {...props}
    />
  ),
);

TextArea.displayName = "TextArea";
