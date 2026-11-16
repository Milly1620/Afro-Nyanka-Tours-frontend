import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const adminButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-admin font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-orange",
  {
    variants: {
      variant: {
        primary: "bg-admin-orange text-white hover:bg-admin-orange-deep",
        secondary:
          "border border-admin-border bg-white text-admin-text-2 hover:bg-admin-field",
        tinted:
          "border-[1.2px] border-admin-orange-line-strong bg-admin-orange-tint text-admin-orange-deep hover:bg-admin-orange-soft",
        dashed:
          "border border-dashed border-admin-border-dashed text-admin-orange hover:bg-admin-orange-tint",
      },
      size: {
        md: "px-4 py-[10px] text-[14px]",
        lg: "px-[18px] py-[11px] text-[14px]",
        sm: "px-[13px] py-2 text-[12.5px] rounded-[9px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface AdminButtonProps
  extends ComponentPropsWithRef<"button">,
    VariantProps<typeof adminButtonVariants> {}

export function AdminButton({ className, variant, size, type = "button", ...props }: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cn(adminButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

const iconButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-orange",
  {
    variants: {
      tone: {
        neutral: "bg-admin-icon-btn text-admin-muted hover:bg-admin-border",
        danger: "bg-admin-danger-bg text-admin-danger hover:bg-admin-status-cancelled-bg",
        dangerSoft: "bg-admin-danger-bg-soft text-admin-danger hover:bg-admin-status-cancelled-bg",
      },
      size: {
        sm: "size-[34px] rounded-[8px]",
        md: "size-[42px] rounded-[10px]",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "sm",
    },
  },
);

export interface IconButtonProps
  extends ComponentPropsWithRef<"button">,
    VariantProps<typeof iconButtonVariants> {
  label: string;
}

export function IconButton({ className, tone, size, label, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(iconButtonVariants({ tone, size }), className)}
      {...props}
    />
  );
}
