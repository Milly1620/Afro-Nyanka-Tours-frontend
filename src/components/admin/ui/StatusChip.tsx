import { cn } from "@/lib/utils";
import type { PublishStatus, StatusChipVariant } from "@/types/admin";

const chipStyles: Record<StatusChipVariant, string> = {
  new: "bg-admin-status-new-bg text-admin-status-new-ink",
  replied: "bg-admin-status-paid-bg text-admin-status-paid-ink",
  paid: "bg-admin-status-paid-bg text-admin-status-paid-ink",
  confirmed: "bg-admin-status-paid-bg text-admin-status-paid-ink",
  pending: "bg-admin-status-pending-bg text-admin-status-pending-ink",
  cancelled: "bg-admin-status-cancelled-bg text-admin-status-cancelled-ink",
};

const chipLabels: Record<StatusChipVariant, string> = {
  new: "New",
  replied: "Replied",
  paid: "Paid",
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
};

export function StatusChip({ status, className }: { status: StatusChipVariant; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full px-[10px] py-[5px] text-[11px] font-semibold tracking-[0.22px] whitespace-nowrap",
        chipStyles[status],
        className,
      )}
    >
      {chipLabels[status]}
    </span>
  );
}

const publishStyles: Record<PublishStatus, { chip: string; dot: string; label: string }> = {
  published: {
    chip: "bg-admin-published-bg text-admin-published-ink",
    dot: "bg-admin-published-dot",
    label: "Published",
  },
  draft: {
    chip: "bg-admin-draft-bg text-admin-subtle",
    dot: "bg-admin-faint",
    label: "Draft",
  },
};

interface PublishChipProps {
  status: PublishStatus;
  withDot?: boolean;
  className?: string;
}

export function PublishChip({ status, withDot = false, className }: PublishChipProps) {
  const style = publishStyles[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-semibold whitespace-nowrap",
        withDot
          ? "gap-[6px] py-[5px] pr-[11px] pl-[9px] text-[12.5px]"
          : "px-[9px] py-1 text-[11px] tracking-[0.22px]",
        style.chip,
        className,
      )}
    >
      {withDot && <span className={cn("size-[6px] rounded-[3px]", style.dot)} />}
      {style.label}
    </span>
  );
}

interface DraftBadgeProps {
  label: string;
  className?: string;
}

export function DraftBadge({ label, className }: DraftBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[7px] rounded-full bg-admin-draft-bg py-[7px] pr-[13px] pl-[11px] font-semibold text-admin-muted",
        className,
      )}
    >
      <span className="size-[7px] rounded-full bg-admin-subtle" />
      {label}
    </span>
  );
}
