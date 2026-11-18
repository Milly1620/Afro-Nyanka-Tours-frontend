import { Link } from "react-router-dom";
import { Trash } from "lucide-react";
import { IconButton } from "@/components/admin/ui/AdminButton";
import { CoverImage } from "@/components/admin/ui/CoverImage";
import { PublishChip } from "@/components/admin/ui/StatusChip";
import { dateOnly } from "@/components/admin/listings/listingMapping";
import { formatDays, formatPrice, formatShortDate } from "@/lib/adminFormat";
import type { AdminEvent } from "@/types/api";

interface EventCardProps {
  event: AdminEvent;
  onDelete: (event: AdminEvent) => void;
}

export function seatsLabel(event: Pick<AdminEvent, "capacity" | "seats_booked" | "seats_left">): string {
  if (event.capacity === null) return `${event.seats_booked} booked · no seat limit`;
  if (event.seats_left === 0) return `${event.seats_booked} / ${event.capacity} booked · sold out`;
  return `${event.seats_booked} / ${event.capacity} booked`;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const editPath = `/admin/events/${event.id}/edit`;
  const summary = [
    event.country,
    event.duration_days ? formatDays(event.duration_days) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[14px] border border-admin-border bg-white shadow-[0px_4px_12px_0px_rgba(26,26,26,0.05)]">
      <Link to={editPath} aria-label={`Edit ${event.name}`}>
        <CoverImage src={event.main_image_url} alt={event.name} />
      </Link>
      <div className="flex flex-col gap-[11px] px-4 pt-[15px] pb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-[16px] font-medium text-admin-text">
            <Link to={editPath} className="hover:underline">
              {event.name}
            </Link>
          </h3>
          <PublishChip status={event.status} />
        </div>
        <p className="text-[12px] text-admin-subtle">{summary}</p>
        <p className="text-[12px] text-admin-subtle">
          {formatShortDate(dateOnly(event.start_date))} – {formatShortDate(dateOnly(event.end_date))}
        </p>
        <p className="text-[12px] text-admin-subtle">{seatsLabel(event)}</p>
        <div className="flex items-end justify-between gap-2 pt-[2px]">
          <p className="flex items-baseline gap-[5px]">
            {event.price_ghs !== null && <span className="text-[12px] text-admin-subtle">from</span>}
            <span className="text-[16px] font-medium text-admin-text">{formatPrice(event.price_ghs)}</span>
          </p>
          <IconButton label={`Delete ${event.name}`} tone="danger" onClick={() => onDelete(event)}>
            <Trash size={15} strokeWidth={1.85} absoluteStrokeWidth />
          </IconButton>
        </div>
      </div>
    </article>
  );
}
