import { ArrowRight, Clock, ImageIcon, Locate } from "lucide-react";
import { parseOptionalWhole, type ListingDraft } from "@/components/admin/listings/listingMapping";
import { formatGhs } from "@/lib/adminFormat";

export function TourCardPreview({ draft }: { draft: ListingDraft }) {
  const location = [draft.region, draft.country].filter(Boolean).join(", ") || "Destination";
  const days = Number(draft.durationDays) || 1;
  const price = parseOptionalWhole(draft.price).value;

  return (
    <div className="relative h-[445.6px] w-[287.86px] overflow-hidden rounded-[14.76px] border-x-[0.92px] border-b-[0.92px] border-landing-card-border bg-white font-inter">
      <div className="absolute inset-x-0 top-0 h-[251.17px] overflow-hidden rounded-t-[14.76px]">
        {draft.coverImage ? (
          <img src={draft.coverImage} alt="" className="size-full object-cover" />
        ) : (
          <div className="admin-cover-stripes flex size-full items-center justify-center">
            <ImageIcon size={32} strokeWidth={1.5} absoluteStrokeWidth className="text-admin-cover-icon" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 to-[88%]" />
      </div>
      <div className="absolute top-[268px] left-[22.14px] flex w-[241.73px] flex-col gap-2">
        <p className="truncate font-admin text-[16.6px] leading-[23.5px] font-medium text-landing-ink">
          {draft.name || "Untitled tour"}
        </p>
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-2 text-[14.76px] leading-[1.2] text-landing-grey">
            <Locate size={14.76} strokeWidth={1.5} absoluteStrokeWidth />
            {location}
          </p>
        </div>
      </div>
      <div className="absolute top-[385.65px] left-1/2 flex -translate-x-1/2 items-center gap-[33px]">
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
