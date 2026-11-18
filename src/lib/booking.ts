import { formatGhs } from "@/lib/adminFormat";
import type {
  BookingExtraSelection,
  BookingPayload,
  Event as EventListing,
  ListingExtra,
  Tour,
} from "@/types/api";

export interface BookingFormValues {
  selectedCountry: string;
  selectedDestinations: string[];
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  email: string;
  age: string;
  country: string;
  additionalServices: string;
  numberOfPersons: string;
  extraIds: number[];
}

export interface OfferedExtra extends ListingExtra {
  tour_id: number;
}

export interface EventBookingValues {
  name: string;
  email: string;
  numberOfPersons: number;
  notes: string;
  extraIds: number[];
  age?: string;
  country?: string;
}

export const QUOTE_MESSAGE = "We'll send you a quote";

export function selectedTours(tours: Tour[], names: string[]): Tour[] {
  return names
    .map((name) => tours.find((tour) => tour.name === name))
    .filter((tour): tour is Tour => Boolean(tour));
}

export function offeredExtras(tours: Tour[]): OfferedExtra[] {
  const seen = new Set<number>();
  const offered: OfferedExtra[] = [];
  tours.forEach((tour) => {
    (tour.extras ?? []).forEach((extra) => {
      if (extra.is_active === false || seen.has(extra.extra_id)) return;
      seen.add(extra.extra_id);
      offered.push({ ...extra, tour_id: tour.id });
    });
  });
  return offered;
}

export function chosenExtras<T extends { extra_id: number }>(offered: T[], ids: number[]): T[] {
  return offered.filter((extra) => ids.includes(extra.extra_id));
}

export function groupSizeLimit(capacities: (number | null | undefined)[]): number | null {
  const limits = capacities.filter((capacity): capacity is number => typeof capacity === "number");
  return limits.length ? Math.min(...limits) : null;
}

export function estimateTotal(
  listings: { price_ghs: number | null }[],
  people: number,
  extras: { price_ghs: number }[],
): number | null {
  if (listings.some((listing) => listing.price_ghs === null)) return null;
  const headcount = Number.isFinite(people) && people > 0 ? people : 0;
  const perPerson = listings.reduce((sum, listing) => sum + (listing.price_ghs ?? 0) * headcount, 0);
  const addOns = extras.reduce((sum, extra) => sum + extra.price_ghs, 0);
  return perPerson + addOns;
}

export function formatAmount(amount: number | null): string {
  return amount === null ? QUOTE_MESSAGE : formatGhs(amount);
}

function optionalNumber(value: string): number | undefined {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function buildTourBookingPayload(values: BookingFormValues, tours: Tour[]): BookingPayload {
  const chosen = selectedTours(tours, values.selectedDestinations);
  const extras: BookingExtraSelection[] = chosenExtras(offeredExtras(chosen), values.extraIds).map((extra) =>
    chosen.length > 1 ? { extra_id: extra.extra_id, tour_id: extra.tour_id } : { extra_id: extra.extra_id },
  );
  const payload: BookingPayload = {
    customer_name: values.name.trim(),
    customer_email: values.email.trim(),
    number_of_people: parseInt(values.numberOfPersons, 10),
    tour_selections: chosen.map((tour, index) => ({
      tour_id: tour.id,
      locations: tour.tour_locations.map((stop) => stop.location_id),
      order: index + 1,
    })),
    extras,
  };
  const age = optionalNumber(values.age);
  if (age !== undefined) payload.customer_age = age;
  if (values.country) payload.customer_country = values.country;
  if (values.startDate) payload.start_date = values.startDate.toISOString();
  if (values.endDate) payload.end_date = values.endDate.toISOString();
  if (values.additionalServices.trim()) payload.additional_services = values.additionalServices.trim();
  return payload;
}

export function buildEventBookingPayload(values: EventBookingValues, event: EventListing): BookingPayload {
  const offered = (event.extras ?? []).filter((extra) => extra.is_active !== false);
  const payload: BookingPayload = {
    customer_name: values.name.trim(),
    customer_email: values.email.trim(),
    number_of_people: values.numberOfPersons,
    event_id: event.id,
    extras: chosenExtras(offered, values.extraIds).map((extra) => ({ extra_id: extra.extra_id })),
  };
  const age = optionalNumber(values.age ?? "");
  if (age !== undefined) payload.customer_age = age;
  if (values.country) payload.customer_country = values.country;
  if (values.notes.trim()) payload.additional_services = values.notes.trim();
  return payload;
}

export function isSoldOut(event: Pick<EventListing, "seats_left">): boolean {
  return event.seats_left === 0;
}

export function eventPeopleLimit(event: Pick<EventListing, "seats_left">): number | null {
  return event.seats_left;
}

export function parseCalendarDate(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00`);
}

export function formatEventDateRange(startDate: string, endDate: string): string {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);
  const full = (date: Date) =>
    date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  if (startDate.slice(0, 10) === endDate.slice(0, 10)) return full(start);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) return `${start.getDate()} – ${full(end)}`;
  const sameYear = start.getFullYear() === end.getFullYear();
  const startLabel = sameYear
    ? start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : full(start);
  return `${startLabel} – ${full(end)}`;
}

export function formatSeats(event: Pick<EventListing, "seats_left">): string | null {
  if (event.seats_left === null) return null;
  if (event.seats_left === 0) return "Sold out";
  return `${event.seats_left} ${event.seats_left === 1 ? "seat" : "seats"} left`;
}
