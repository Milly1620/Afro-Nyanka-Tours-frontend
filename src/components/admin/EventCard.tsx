import { CoverImage } from "@/components/admin/ui/CoverImage";
import { PublishChip } from "@/components/admin/ui/StatusChip";
import { formatDays, formatGhs } from "@/lib/adminFormat";
import type { AdminEvent } from "@/types/admin";

export function EventCard({ event }: { event: AdminEvent }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[14px] border border-admin-border bg-white shadow-[0px_4px_12px_0px_rgba(26,26,26,0.05)]">
      <CoverImage src={event.coverImage} alt={event.name} />
      <div className="flex flex-col gap-[11px] px-4 pt-[15px] pb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-[16px] font-medium text-admin-text">{event.name}</h3>
          <PublishChip status={event.status} />
        </div>
        <p className="text-[12px] text-admin-subtle">
          {event.country} · {formatDays(event.durationDays)}
        </p>
        <p className="flex items-baseline gap-[5px] pt-[2px]">
          <span className="text-[12px] text-admin-subtle">from</span>
          <span className="text-[16px] font-medium text-admin-text">{formatGhs(event.price)}</span>
        </p>
      </div>
    </article>
  );
}
