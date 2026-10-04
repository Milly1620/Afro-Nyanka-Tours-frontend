import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import homowoFestival from "@/assets/admin/homowo-festival.png";
import kenteChevron from "@/assets/admin/kente-chevron.svg";
import { highlightIcons } from "@/components/admin/forms/HighlightsEditor";
import { countdownTo, formatDateRange, padTwo } from "@/lib/adminFormat";
import type { ListingDraft } from "@/types/admin";

const chevronRows = [0, 1, 2, 3, 4];

export function FeaturedTripPreview({ draft }: { draft: ListingDraft }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = countdownTo(draft.firstDeparture, now);
  const days = Number(draft.durationDays) || 1;
  const units = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  return (
    <div className="relative flex flex-col items-center gap-[18px] overflow-hidden bg-landing-sand px-6 py-[30px] md:flex-row md:px-[60px]">
      <div aria-hidden className="absolute top-0 left-0 hidden h-full w-[75px] md:block">
        {chevronRows.map((row) => (
          <ChevronTile key={`l-${row}`} top={-33.4 + row * 80.31} left={0} rotation={90} />
        ))}
        {chevronRows.map((row) => (
          <ChevronTile key={`r-${row}`} top={6.92 + row * 80.31} left={18.07} rotation={-90} />
        ))}
      </div>

      <div className="relative flex flex-col justify-end gap-6">
        <div className="flex flex-col gap-[18px]">
          <p className="flex items-center gap-[6px] font-inter text-[13.5px] font-semibold text-landing-brown">
            <span className="h-[6px] w-[30px] bg-landing-orange" />
            UPCOMING <span className="text-landing-orange">TOURS</span>
          </p>
          <h2 className="font-admin text-[28px] leading-[1.2] font-bold text-landing-brown md:text-[36px]">
            {draft.name || "Untitled tour"}
          </h2>
          <div className="flex flex-wrap items-center gap-[18px]">
            <span className="flex items-center gap-[6px] text-[18px] font-semibold text-landing-brown">
              <MapPin size={18} strokeWidth={1.5} absoluteStrokeWidth className="text-landing-orange" />
              {draft.destination}
            </span>
            <span className="flex items-center gap-[6px] text-[13.5px] text-landing-grey">
              <CalendarDays size={18} strokeWidth={1.5} absoluteStrokeWidth className="text-landing-orange" />
              {formatDateRange(draft.firstDeparture, days)}
            </span>
          </div>
          <p className="max-w-[456.75px] font-inter text-[13.5px] leading-[1.2] text-landing-grey">
            {draft.description}
          </p>
        </div>
        {draft.highlights.length > 0 && (
          <ul className="flex flex-wrap gap-6">
            {draft.highlights.slice(0, 3).map((highlight) => {
              const Icon = highlightIcons[highlight.icon].icon;
              return (
                <li key={highlight.id} className="flex items-center gap-3">
                  <Icon size={30} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-landing-orange" />
                  <span className="max-w-[92px] text-[12px] leading-none text-landing-grey-dark">
                    {highlight.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex gap-3">
          <span className="flex items-center gap-[7.5px] rounded-[33.7px] border-[0.75px] border-landing-brown px-[18px] py-[14.25px] text-[11.24px] leading-[11.24px] font-medium text-landing-brown">
            View Next Tour
            <ArrowRight size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </span>
          <span className="flex w-[113.76px] items-center justify-center rounded-[33.7px] bg-landing-orange text-[11.24px] leading-[11.24px] font-medium text-landing-brown">
            Book now
          </span>
        </div>
      </div>

      <div className="relative h-[316.5px] w-full max-w-[485.25px] shrink-0 overflow-hidden rounded-[12px]">
        <img
          src={draft.coverImage ?? homowoFestival}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute top-[9px] right-[9px] flex flex-col items-center gap-[7.5px] rounded-[12px] bg-landing-sand/80 px-[18px] py-[7.5px] font-inter leading-[1.2]">
          <span className="text-[10.5px] font-semibold text-landing-brown">Count Down</span>
          <div className="flex gap-[30px]">
            {units.map((unit) => (
              <span key={unit.label} className="flex flex-col items-center">
                <span className="text-[27px] font-semibold text-landing-grey-ink">{padTwo(unit.value)}</span>
                <span className="text-[10.5px] text-landing-grey">{unit.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronTile({ top, left, rotation }: { top: number; left: number; rotation: number }) {
  return (
    <div
      className="absolute flex h-[80.25px] w-[56.93px] items-center justify-center"
      style={{ top, left }}
    >
      <img
        src={kenteChevron}
        alt=""
        width={80.25}
        height={56.93}
        className="max-w-none shrink-0"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </div>
  );
}
