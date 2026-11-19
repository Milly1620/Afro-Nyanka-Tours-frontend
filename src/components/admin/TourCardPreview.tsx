import { ArrowRight, Clock, ImageIcon, Locate } from "lucide-react";
import type { ListingDraft } from "@/components/admin/listings/listingMapping";

export function TourCardPreview({ draft, coverImage }: { draft: ListingDraft; coverImage: string | null }) {
  const location = [draft.region, draft.country].filter(Boolean).join(", ") || "Destination";
  const days = Number(draft.durationDays) || 1;

  return (
    <div className="flex w-[287.86px] max-w-full flex-col overflow-hidden rounded-[14.76px] border-x-[0.92px] border-b-[0.92px] border-landing-card-border bg-white font-inter">
      <div className="relative h-[251.17px] w-full overflow-hidden rounded-t-[14.76px]">
        {coverImage ? (
          <img src={coverImage} alt="" className="size-full object-cover" />
        ) : (
          <div className="admin-cover-stripes flex size-full items-center justify-center">
            <ImageIcon size={32} strokeWidth={1.5} absoluteStrokeWidth className="text-admin-cover-icon" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 to-[88%]" />
      </div>
      <div className="flex min-w-0 flex-col gap-2 px-[22px] pt-[17px]">
        <p className="truncate font-admin text-[16.6px] leading-[23.5px] font-medium text-landing-ink">
          {draft.name || "Untitled tour"}
        </p>
        <p className="flex min-w-0 items-center gap-2 text-[14.76px] leading-[1.2] text-landing-grey">
          <Locate size={14.76} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0" />
          <span className="truncate">{location}</span>
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 px-[22px] pt-4 pb-5">
        <span className="flex items-center gap-2 text-[14.76px] whitespace-nowrap text-landing-grey">
          <Clock size={14.76} strokeWidth={1.5} absoluteStrokeWidth />
          {days} {days === 1 ? "Day" : "Days"}
        </span>
        <span className="flex items-center gap-[6px] rounded-[44px] border-[0.92px] border-landing-pill-border px-4 py-2 text-[14.76px] font-medium whitespace-nowrap text-landing-brown">
          Book Now
          <ArrowRight size={24} strokeWidth={1.5} absoluteStrokeWidth className="text-landing-orange" />
        </span>
      </div>
    </div>
  );
}
