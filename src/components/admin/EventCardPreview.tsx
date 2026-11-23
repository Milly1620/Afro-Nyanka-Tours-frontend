import { CalendarDays, ImageIcon, MapPin } from "lucide-react";
import { formatDateRange } from "@/lib/adminFormat";
import { inclusiveDays, parseOptionalWhole, type ListingDraft } from "@/components/admin/listings/listingMapping";

interface EventCardPreviewProps {
  draft: ListingDraft;
  coverImage: string | null;
}

export function EventCardPreview({ draft, coverImage }: EventCardPreviewProps) {
  const location = draft.destination || draft.countries.join(", ");
  const days = inclusiveDays(draft.startDate, draft.endDate) ?? (Number(draft.durationDays) || 1);
  const price = parseOptionalWhole(draft.price).value;
  const sharingPrice = parseOptionalWhole(draft.sharingPrice).value;
  const couplePrice = parseOptionalWhole(draft.couplePrice).value;

  return (
    <article
      aria-label="Event card preview"
      className="flex w-full flex-col overflow-hidden rounded-[14px] border border-admin-border bg-white shadow-[0px_4px_12px_0px_rgba(26,26,26,0.05)]"
    >
      <div className="relative h-[180px] w-full overflow-hidden bg-admin-preview-bg">
        {coverImage ? (
          <>
            <img src={coverImage} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover blur-xl" />
            <img src={coverImage} alt="" className="relative size-full object-contain" />
          </>
        ) : (
          <div className="admin-cover-stripes flex size-full items-center justify-center">
            <ImageIcon size={32} strokeWidth={1.5} absoluteStrokeWidth className="text-admin-cover-icon" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2 px-4 pt-[14px] pb-4">
        <h3 className="truncate text-[16px] font-medium text-admin-text">{draft.name || "Untitled event"}</h3>
        {location && (
          <p className="flex min-w-0 items-center gap-[6px] text-[13px] text-admin-text-2">
            <MapPin size={14} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0 text-admin-orange" />
            <span className="truncate">{location}</span>
          </p>
        )}
        {draft.startDate && (
          <p className="flex min-w-0 items-center gap-[6px] text-[13px] text-admin-text-2">
            <CalendarDays size={14} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0 text-admin-orange" />
            <span className="truncate">{formatDateRange(draft.startDate, days)}</span>
          </p>
        )}
        {price !== null && (
          <p className="text-[15px] font-medium text-admin-text">
            GHS {price.toLocaleString("en-US")}
            <span className="text-[12px] font-normal text-admin-subtle"> /person</span>
          </p>
        )}
        {sharingPrice !== null && (
          <p className="text-[15px] font-medium text-admin-text">
            GHS {sharingPrice.toLocaleString("en-US")}
            <span className="text-[12px] font-normal text-admin-subtle"> /sharing</span>
          </p>
        )}
        {couplePrice !== null && (
          <p className="text-[15px] font-medium text-admin-text">
            GHS {couplePrice.toLocaleString("en-US")}
            <span className="text-[12px] font-normal text-admin-subtle"> /couple</span>
          </p>
        )}
      </div>
    </article>
  );
}
