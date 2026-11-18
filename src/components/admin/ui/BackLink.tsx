import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

interface BackLinkProps {
  to: string;
  label: string;
  className?: string;
}

export function BackLink({ to, label, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-[6px] text-[12.5px] font-medium text-admin-subtle hover:text-admin-text-2",
        className,
      )}
    >
      <ChevronLeft size={14} strokeWidth={1.85} absoluteStrokeWidth />
      {label}
    </Link>
  );
}
