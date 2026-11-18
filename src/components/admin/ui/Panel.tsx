import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("overflow-hidden rounded-[16px] border border-admin-border bg-white", className)}
      {...props}
    />
  );
}

interface PanelHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PanelHeading({ title, subtitle, className }: PanelHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-[3px]", className)}>
      <h2 className="text-[16px] font-medium text-admin-ink-900">{title}</h2>
      {subtitle && <p className="text-[12px] text-admin-ink-500">{subtitle}</p>}
    </div>
  );
}

interface SectionEyebrowProps {
  children: ReactNode;
  tone?: "orange" | "muted";
  className?: string;
}

export function SectionEyebrow({ children, tone = "orange", className }: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        tone === "orange"
          ? "text-[11.5px] font-bold tracking-[1.1px] text-admin-orange"
          : "text-[12.5px] font-medium tracking-[1px] text-admin-placeholder",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div role="separator" className={cn("h-px w-full bg-admin-divider-warm", className)} />;
}
