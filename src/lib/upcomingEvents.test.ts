import { describe, expect, it } from "vitest";
import { formatBannerDates, hasStarted, upcomingEvents } from "@/lib/upcomingEvents";
import type { Event } from "@/types/api";

function eventOn(id: number, start: string): Event {
  return {
    id,
    name: `Event ${id}`,
    description: null,
    country: "Ghana",
    region: null,
    destination: null,
    start_date: start,
    end_date: start,
    duration_days: null,
    price_ghs: 500,
    capacity: null,
    seats_left: null,
    highlights: [],
    main_image_url: null,
    gallery_images: [],
    locations: [],
    extras: [],
  };
}

const now = new Date("2026-11-16T12:00:00Z");

describe("upcomingEvents", () => {
  it("drops events that have already ended", () => {
    const result = upcomingEvents([eventOn(1, "2026-11-01"), eventOn(2, "2026-12-01")], now);
    expect(result.map((event) => event.id)).toEqual([2]);
  });

  it("keeps an event that started today and is still running", () => {
    const running = { ...eventOn(3, "2026-11-16"), end_date: "2026-11-20" };
    expect(upcomingEvents([running], now).map((event) => event.id)).toEqual([3]);
  });

  it("keeps a one-day event on the day it happens", () => {
    expect(upcomingEvents([eventOn(4, "2026-11-16")], now)).toHaveLength(1);
  });

  it("orders by start date, soonest first", () => {
    const result = upcomingEvents([eventOn(1, "2027-01-01"), eventOn(2, "2026-12-01")], now);
    expect(result.map((event) => event.id)).toEqual([2, 1]);
  });

  it("caps the list at the limit", () => {
    const events = [1, 2, 3, 4].map((id) => eventOn(id, `2026-12-0${id}`));
    expect(upcomingEvents(events, now, 2)).toHaveLength(2);
  });

  it("returns nothing when no events are upcoming", () => {
    expect(upcomingEvents([eventOn(1, "2026-01-01")], now)).toEqual([]);
  });
});

describe("formatBannerDates", () => {
  it("writes a range within one month", () => {
    expect(formatBannerDates("2026-09-26", "2026-09-28")).toBe("September 26 - 28, 2026");
  });

  it("writes a range across months", () => {
    expect(formatBannerDates("2026-09-30", "2026-10-02")).toBe("September 30 - October 2, 2026");
  });

  it("writes a single day", () => {
    expect(formatBannerDates("2026-09-26", "2026-09-26")).toBe("September 26, 2026");
  });
});

describe("hasStarted", () => {
  it("is false before the start and true after", () => {
    expect(hasStarted(eventOn(1, "2026-12-01"), now)).toBe(false);
    expect(hasStarted(eventOn(1, "2026-11-16"), now)).toBe(true);
  });
});
