import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, MapPin } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import { useResource } from "@/hooks/useResource";
import { countdownTo, padTwo } from "@/lib/adminFormat";
import { formatBannerDates, hasStarted, upcomingEvents } from "@/lib/upcomingEvents";
import { eventsApi } from "@/services/api";
import type { Event } from "@/types/api";
import chevron1 from "@/assets/upcoming/chevron-1.svg";
import chevron2 from "@/assets/upcoming/chevron-2.svg";
import chevron3 from "@/assets/upcoming/chevron-3.svg";
import chevron4 from "@/assets/upcoming/chevron-4.svg";
import chevron5 from "@/assets/upcoming/chevron-5.svg";
import chevron6 from "@/assets/upcoming/chevron-6.svg";
import chevron7 from "@/assets/upcoming/chevron-7.svg";
import chevron8 from "@/assets/upcoming/chevron-8.svg";
import chevron9 from "@/assets/upcoming/chevron-9.svg";
import chevron10 from "@/assets/upcoming/chevron-10.svg";

const leftColumn = [chevron1, chevron2, chevron3, chevron4, chevron5];
const rightColumn = [chevron6, chevron7, chevron8, chevron9, chevron10];

function ChevronColumn({ tiles, rotation, className }: { tiles: string[]; rotation: string; className: string }) {
  return (
    <div className={`absolute top-0 flex flex-col ${className}`} aria-hidden="true">
      {tiles.map((tile) => (
        <div key={tile} className="flex h-[107px] w-[76px] items-center justify-center">
          <img src={tile} alt="" className={`max-w-none w-[107px] h-[76px] ${rotation}`} />
        </div>
      ))}
    </div>
  );
}

function Countdown({ event }: { event: Event }) {
  const now = useNow();
  if (hasStarted(event, now)) {
    return (
      <div className="rounded-2xl bg-[#F4EFE9]/80 px-6 py-3 text-center font-[Inter,sans-serif] text-[18px] font-semibold text-[#482B11]">
        Happening now
      </div>
    );
  }
  const target = event.start_date;
  const { days, hours, minutes, seconds } = countdownTo(target, now);
  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];
  return (
    <div
      className="flex flex-col items-center gap-2.5 rounded-2xl bg-[#F4EFE9]/80 px-4 py-2.5 text-center font-[Inter,sans-serif] sm:px-6"
      role="timer"
      aria-label="Time until the event starts"
    >
      <p className="w-full text-[14px] font-semibold leading-[1.2] text-[#482B11]">Count Down</p>
      <div className="flex items-center gap-4 sm:gap-10">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center leading-[1.2]">
            <span className="text-[26px] font-semibold text-[#494C4C] sm:text-[36px]">{padTwo(unit.value)}</span>
            <span className="text-[12px] text-[#6E7070] sm:text-[14px]">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlyerPopup({ src, alt }: { src: string; alt: string }) {
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-50 hidden items-center justify-center bg-black/60 p-8 lg:flex">
      <img src={src} alt={alt} className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl" />
    </div>,
    document.body,
  );
}

function EventSlide({ event, onNext, hasNext }: { event: Event; onNext: () => void; hasNext: boolean }) {
  const navigate = useNavigate();
  const [previewing, setPreviewing] = useState(false);
  const place = event.destination ?? "";
  const prices = [
    { label: "person", amount: event.price_ghs },
    { label: "sharing", amount: event.sharing_price_ghs },
    { label: "couple", amount: event.couple_price_ghs },
  ].filter((price): price is { label: string; amount: number } => typeof price.amount === "number" && price.amount > 0);

  return (
    <div className="relative flex flex-col items-stretch gap-6 overflow-hidden bg-[#F4EFE9] px-4 py-10 sm:px-8 lg:flex-row lg:items-center lg:gap-6 lg:pr-20 lg:pl-[130px]">
      <div className="absolute left-0 top-0 hidden h-full w-[100px] overflow-hidden lg:block" aria-hidden="true">
        <ChevronColumn tiles={leftColumn} rotation="-rotate-90" className="left-[24px] -top-[44px]" />
        <ChevronColumn tiles={rightColumn} rotation="rotate-90" className="left-0 -top-[44px]" />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-end gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-10 bg-[#FFA75D]" />
            <p className="font-[Inter,sans-serif] text-[18px] font-semibold leading-[1.2] text-[#482B11]">
              UPCOMING <span className="text-[#FFA75D]">TOURS</span>
            </p>
          </div>
          <h2 className="poppins-bold text-[32px] leading-[1.2] text-[#482B11] md:text-[48px]">{event.name}</h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {place && (
              <div className="flex items-center gap-2">
                <MapPin className="size-6 text-[#FFA75D]" />
                <span className="poppins-semibold text-[20px] text-[#482B11] md:text-[24px]">{place}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarDays className="size-6 text-[#FFA75D]" />
              <span className="poppins-regular text-[16px] text-[#6E7070] md:text-[18px]">
                {formatBannerDates(event.start_date, event.end_date)}
              </span>
            </div>
          </div>
          {prices.length > 0 && (
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {prices.map(({ label, amount }) => (
                <p key={label} className="poppins-semibold text-[22px] text-[#482B11]">
                  GHS {amount.toLocaleString("en-US")}
                  <span className="poppins-regular text-[14px] text-[#6E7070]"> /{label}</span>
                </p>
              ))}
            </div>
          )}
          {event.description && (
            <p className="line-clamp-3 max-w-[609px] font-[Inter,sans-serif] text-[16px] leading-[1.2] text-[#6E7070] md:text-[18px]">
              {event.description}
            </p>
          )}
        </div>

        {event.highlights.length > 0 && (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
            {event.highlights.map((highlight) => (
              <li key={highlight} className="flex min-h-10 items-center gap-3">
                <Check className="size-8 shrink-0 text-[#FFA75D]" strokeWidth={1.5} />
                <span className="poppins-regular text-[16px] leading-tight text-[#535555]">{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-4">
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-[#482B11] px-6 py-[19px] poppins-medium text-[15px] text-[#482B11]"
            >
              View Next Tour
              <ArrowRight className="size-6" />
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="cursor-pointer rounded-full bg-[#FFA75D] px-10 py-[19px] poppins-medium text-[15px] text-[#482B11]"
          >
            Book now
          </button>
        </div>
      </div>

      <div
        className="relative z-10 h-[300px] w-full overflow-hidden rounded-2xl bg-[#E6E6E6] sm:h-[422px] lg:w-[647px] lg:shrink-0"
        onMouseEnter={() => setPreviewing(true)}
        onMouseLeave={() => setPreviewing(false)}
      >
        {event.main_image_url && (
          <>
            <img
              src={event.main_image_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full scale-110 object-cover blur-xl"
            />
            <img src={event.main_image_url} alt={event.name} className="absolute inset-0 size-full object-contain" />
          </>
        )}
        <div
          className={`absolute right-3 top-3 transition-opacity duration-300 ${previewing ? "opacity-0" : "opacity-100"}`}
        >
          <Countdown event={event} />
        </div>
      </div>
      {previewing && event.main_image_url && <FlyerPopup src={event.main_image_url} alt={event.name} />}
    </div>
  );
}

const SWIPE_THRESHOLD_PX = 50;
const AUTOPLAY_MS = 6000;

export function UpcomingEventBanner() {
  const { data } = useResource(() => eventsApi.list(), []);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const now = useNow(60000);
  const events = upcomingEvents(data ?? [], now);
  const count = events.length;
  const current = count === 0 ? 0 : Math.min(active, count - 1);

  const go = useCallback((index: number) => setActive(((index % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((value) => (value + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count, paused, current]);

  if (count === 0) return null;

  const finishSwipe = (endX: number) => {
    if (swipeStart.current === null) return;
    const distance = endX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return;
    go(distance < 0 ? current + 1 : current - 1);
  };

  return (
    <section
      aria-label="Upcoming events"
      aria-roledescription="carousel"
      className="bg-white pt-10 pb-8 lg:pt-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={(event) => setPaused(event.target.matches(":focus-visible"))}
      onBlur={() => setPaused(false)}
    >
      <div
        className="overflow-hidden touch-pan-y"
        onPointerDown={(event) => {
          swipeStart.current = event.clientX;
        }}
        onPointerUp={(event) => finishSwipe(event.clientX)}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              aria-hidden={index !== current}
              inert={index !== current}
              className="w-full shrink-0"
            >
              <EventSlide event={event} hasNext={count > 1} onNext={() => go(current + 1)} />
            </div>
          ))}
        </div>
      </div>
      {count > 1 && (
        <div className="mt-10 flex items-center justify-center gap-[21px]">
          {events.map((event, index) => (
            <button
              key={event.id}
              type="button"
              aria-label={`Go to event ${index + 1}`}
              aria-current={index === current}
              onClick={() => go(index)}
              className={`size-[11px] cursor-pointer rounded-full border ${
                index === current ? "border-[#CB881C] bg-[#CB881C]" : "border-[#482B11]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
