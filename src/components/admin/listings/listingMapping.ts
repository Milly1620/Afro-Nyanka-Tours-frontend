import { fromDateTimeLocal, toDateTimeLocal } from "@/lib/adminFormat";
import type {
  AdminEvent,
  AdminTour,
  EventInput,
  ListingExtra,
  PublishStatus,
  TourInput,
} from "@/types/api";

export type ListingKind = "tour" | "event";

export type PublishMode = "now" | "schedule";

export type PublishIntent = "draft" | "publish";

export const MAX_HIGHLIGHTS = 6;

export interface DraftExtra {
  extraId: number;
  price: string;
}

export interface ListingDraft {
  name: string;
  country: string;
  countries: string[];
  region: string;
  destination: string;
  description: string;
  price: string;
  sharingPrice: string;
  couplePrice: string;
  durationDays: string;
  capacity: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  isPopular: boolean;
  locationIds: number[];
  extras: DraftExtra[];
  coverImage: string | null;
  galleryImages: string[];
  publishMode: PublishMode;
  publishOn: string;
}

export interface ParsedWhole {
  value: number | null;
  valid: boolean;
}

export interface ExtraAttachment {
  extraId: number;
  price?: number;
}

export interface ExtrasDiff {
  attach: ExtraAttachment[];
  detach: number[];
}

export function emptyDraft(): ListingDraft {
  return {
    name: "",
    country: "",
    countries: [],
    region: "",
    destination: "",
    description: "",
    price: "",
    sharingPrice: "",
    couplePrice: "",
    durationDays: "",
    capacity: "",
    startDate: "",
    endDate: "",
    highlights: [],
    isPopular: false,
    locationIds: [],
    extras: [],
    coverImage: null,
    galleryImages: [],
    publishMode: "now",
    publishOn: "",
  };
}

export function parseOptionalWhole(raw: string): ParsedWhole {
  const cleaned = raw.replace(/,/g, "").trim();
  if (!cleaned) return { value: null, valid: true };
  if (!/^\d+$/.test(cleaned)) return { value: null, valid: false };
  return { value: Number(cleaned), valid: true };
}

export function dateOnly(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export function inclusiveDays(startDate: string, endDate: string): number | null {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return Math.round((end - start) / 86400000) + 1;
}

function extrasFrom(extras: ListingExtra[]): DraftExtra[] {
  return extras.map((extra) => ({ extraId: extra.extra_id, price: extra.price_ghs === null ? "" : String(extra.price_ghs) }));
}

function publishFieldsFrom(status: PublishStatus, publishAt: string | null) {
  return {
    publishMode: status === "scheduled" ? ("schedule" as const) : ("now" as const),
    publishOn: toDateTimeLocal(publishAt),
  };
}

function numberText(value: number | null): string {
  return value === null ? "" : String(value);
}

export function draftFromTour(tour: AdminTour): ListingDraft {
  return {
    ...emptyDraft(),
    name: tour.name,
    country: tour.country,
    region: tour.region ?? "",
    description: tour.description ?? "",
    price: numberText(tour.price_ghs),
    durationDays: numberText(tour.duration_days),
    capacity: numberText(tour.capacity),
    highlights: tour.highlights ?? [],
    isPopular: Boolean(tour.is_popular),
    locationIds: [...(tour.tour_locations ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((stop) => stop.location_id),
    extras: extrasFrom(tour.extras ?? []),
    coverImage: tour.main_image_url,
    galleryImages: tour.gallery_images ?? [],
    ...publishFieldsFrom(tour.status, tour.publish_at),
  };
}

export function draftFromEvent(event: AdminEvent): ListingDraft {
  return {
    ...emptyDraft(),
    name: event.name,
    countries: event.countries?.length ? event.countries : event.country ? [event.country] : [],
    destination: event.destination ?? "",
    description: event.description ?? "",
    price: numberText(event.price_ghs),
    sharingPrice: numberText(event.sharing_price_ghs ?? null),
    couplePrice: numberText(event.couple_price_ghs ?? null),
    durationDays: numberText(event.duration_days),
    capacity: numberText(event.capacity),
    startDate: dateOnly(event.start_date),
    endDate: dateOnly(event.end_date),
    highlights: event.highlights ?? [],
    locationIds: (event.locations ?? []).map((stop) => stop.id),
    extras: extrasFrom(event.extras ?? []),
    coverImage: event.main_image_url,
    galleryImages: event.gallery_images ?? [],
    ...publishFieldsFrom(event.status, event.publish_at),
  };
}

export function resolveStatus(draft: ListingDraft, intent: PublishIntent): PublishStatus {
  if (intent === "draft") return "draft";
  return draft.publishMode === "schedule" ? "scheduled" : "published";
}

export function listingNoun(kind: ListingKind): string {
  return kind === "tour" ? "Tour" : "Event";
}

export function savedMessage(kind: ListingKind, status: PublishStatus, created: boolean): string {
  const noun = listingNoun(kind);
  if (status === "draft") return `${noun} saved as a draft.`;
  if (status === "scheduled") return `${noun} scheduled.`;
  return created ? `${noun} published.` : `${noun} updated.`;
}

export function cleanHighlights(highlights: string[]): string[] {
  return highlights.map((highlight) => highlight.trim()).filter(Boolean);
}

function publishAtFor(draft: ListingDraft, status: PublishStatus): string | null {
  return status === "scheduled" ? fromDateTimeLocal(draft.publishOn) : null;
}

export function tourInputFromDraft(draft: ListingDraft, status: PublishStatus): TourInput {
  return {
    name: draft.name.trim(),
    country: draft.country.trim(),
    region: draft.region.trim(),
    description: draft.description.trim(),
    price_ghs: parseOptionalWhole(draft.price).value ?? 0,
    duration_days: parseOptionalWhole(draft.durationDays).value,
    capacity: parseOptionalWhole(draft.capacity).value,
    highlights: cleanHighlights(draft.highlights),
    status,
    publish_at: publishAtFor(draft, status),
    is_popular: draft.isPopular,
    location_ids: draft.locationIds,
  };
}

export function eventInputFromDraft(draft: ListingDraft, status: PublishStatus): EventInput {
  return {
    name: draft.name.trim(),
    countries: draft.countries.map((country) => country.trim()).filter(Boolean),
    description: draft.description.trim(),
    destination: draft.destination.trim(),
    start_date: draft.startDate,
    end_date: draft.endDate,
    price_ghs: parseOptionalWhole(draft.price).value ?? 0,
    sharing_price_ghs: parseOptionalWhole(draft.sharingPrice).value,
    couple_price_ghs: parseOptionalWhole(draft.couplePrice).value,
    duration_days: inclusiveDays(draft.startDate, draft.endDate),
    capacity: parseOptionalWhole(draft.capacity).value,
    highlights: cleanHighlights(draft.highlights),
    status,
    publish_at: publishAtFor(draft, status),
    location_ids: draft.locationIds,
  };
}

export function validateListing(
  draft: ListingDraft,
  kind: ListingKind,
  status: PublishStatus,
  minimumCapacity = 0,
): string | null {
  if (!draft.name.trim()) return "Enter a name.";
  if (kind === "tour" && !draft.country.trim()) return "Enter a country.";
  if (kind === "event" && draft.countries.length === 0) return "Choose at least one country.";
  const price = parseOptionalWhole(draft.price);
  if (!price.valid) return "Price must be a whole number of cedis.";
  if (kind === "event" && price.value === null) return "Enter a price.";
  if (kind === "event" && !parseOptionalWhole(draft.sharingPrice).valid) return "Sharing price must be a whole number of cedis.";
  if (kind === "event" && !parseOptionalWhole(draft.couplePrice).valid) return "Couple price must be a whole number of cedis.";
  const duration = parseOptionalWhole(draft.durationDays);
  if (kind === "tour" && (!duration.valid || duration.value === 0)) return "Duration must be a whole number of days.";
  const capacity = parseOptionalWhole(draft.capacity);
  if (!capacity.valid || capacity.value === 0) return "Capacity must be a whole number of at least 1.";
  if (capacity.value !== null && capacity.value < minimumCapacity) {
    return `Capacity cannot be below the ${minimumCapacity} seats already booked.`;
  }
  const overrides = draft.extras.find((extra) => !parseOptionalWhole(extra.price).valid);
  if (overrides) return "Extra prices must be whole numbers of cedis.";
  if (kind === "event") {
    if (!draft.startDate || !draft.endDate) return "Choose a start and end date.";
    if (draft.endDate < draft.startDate) return "The end date cannot be before the start date.";
  }
  if (status === "scheduled" && !fromDateTimeLocal(draft.publishOn)) return "Choose when to publish.";
  return null;
}

export function diffExtras(
  existing: ListingExtra[],
  desired: DraftExtra[],
  catalogPrices: Record<number, number>,
): ExtrasDiff {
  const existingById = new Map(existing.map((extra) => [extra.extra_id, extra]));
  const desiredIds = new Set(desired.map((extra) => extra.extraId));
  const attach: ExtraAttachment[] = [];
  desired.forEach((extra) => {
    const price = parseOptionalWhole(extra.price).value;
    const current = existingById.get(extra.extraId);
    if (current) {
      if (price !== null && price !== current.price_ghs) attach.push({ extraId: extra.extraId, price });
      return;
    }
    const usesCatalogPrice = price === null || price === catalogPrices[extra.extraId];
    attach.push(usesCatalogPrice ? { extraId: extra.extraId } : { extraId: extra.extraId, price });
  });
  const detach = existing.filter((extra) => !desiredIds.has(extra.extra_id)).map((extra) => extra.extra_id);
  return { attach, detach };
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
