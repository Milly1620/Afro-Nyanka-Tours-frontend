import { parseCalendarDate } from "@/lib/booking";
import type { Event } from "@/types/api";

export const MAX_BANNER_EVENTS = 5;

const DAY_MS = 86_400_000;

export function hasStarted(event: Event, now: Date): boolean {
  return new Date(event.start_date).getTime() <= now.getTime();
}

function hasEnded(event: Event, now: Date): boolean {
  return new Date(event.end_date).getTime() + DAY_MS <= now.getTime();
}

export function upcomingEvents(events: Event[], now: Date, limit: number = MAX_BANNER_EVENTS): Event[] {
  return events
    .filter((event) => !hasEnded(event, now))
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, limit);
}

export function formatBannerDates(startDate: string, endDate: string): string {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);
  const month = (date: Date) => date.toLocaleDateString("en-US", { month: "long" });
  const year = end.getFullYear();
  if (startDate.slice(0, 10) === endDate.slice(0, 10)) return `${month(start)} ${start.getDate()}, ${year}`;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${month(start)} ${start.getDate()} - ${end.getDate()}, ${year}`;
  }
  return `${month(start)} ${start.getDate()} - ${month(end)} ${end.getDate()}, ${year}`;
}
