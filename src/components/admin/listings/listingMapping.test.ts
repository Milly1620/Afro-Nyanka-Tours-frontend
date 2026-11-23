import {
  diffExtras,
  draftFromEvent,
  draftFromTour,
  emptyDraft,
  eventInputFromDraft,
  inclusiveDays,
  savedMessage,
  moveItem,
  parseOptionalWhole,
  resolveStatus,
  tourInputFromDraft,
  validateListing,
} from "@/components/admin/listings/listingMapping";
import type { AdminEvent, AdminTour, ListingExtra } from "@/types/api";

const extra = (id: number, price: number): ListingExtra => ({
  extra_id: id,
  name: `Extra ${id}`,
  description: null,
  price_ghs: price,
});

const tour: AdminTour = {
  id: 4,
  name: "Cape Coast Heritage",
  description: "Castles and coast",
  country: "Ghana",
  region: "Central",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: null,
  tour_locations: [
    { id: 2, location_id: 12, order: 2, location: { id: 12, name: "B", description: null, country: "Ghana", region: "", created_at: "" } },
    { id: 1, location_id: 11, order: 1, location: { id: 11, name: "A", description: null, country: "Ghana", region: "", created_at: "" } },
  ],
  main_image_url: "https://cdn.example/main.jpg",
  gallery_images: ["https://cdn.example/g1.jpg"],
  price_ghs: 2650,
  duration_days: 3,
  capacity: 12,
  highlights: ["Guide", "Lunch"],
  extras: [extra(2, 100)],
  is_popular: true,
  status: "scheduled",
  publish_at: "2026-12-01T09:00:00.000Z",
};

const event: AdminEvent = {
  id: 7,
  name: "Homowo Festival",
  description: null,
  country: "Ghana",
  region: null,
  destination: "Accra",
  start_date: "2026-12-10",
  end_date: "2026-12-12",
  duration_days: null,
  price_ghs: 500,
  capacity: null,
  seats_left: null,
  highlights: [],
  main_image_url: null,
  gallery_images: [],
  locations: [],
  extras: [],
  status: "draft",
  publish_at: null,
  seats_booked: 5,
};

describe("parseOptionalWhole", () => {
  it.each([
    ["", { value: null, valid: true }],
    ["  ", { value: null, valid: true }],
    ["42,000", { value: 42000, valid: true }],
    ["12.5", { value: null, valid: false }],
    ["abc", { value: null, valid: false }],
  ])("parses %j", (raw, expected) => {
    expect(parseOptionalWhole(raw)).toEqual(expected);
  });
});

describe("draftFromTour", () => {
  it("orders stops by their order and keeps scheduled publishing", () => {
    const draft = draftFromTour(tour);
    expect(draft.locationIds).toEqual([11, 12]);
    expect(draft.publishMode).toBe("schedule");
    expect(draft.publishOn).not.toBe("");
    expect(draft.price).toBe("2650");
    expect(draft.extras).toEqual([{ extraId: 2, price: "100" }]);
    expect(draft.coverImage).toBe("https://cdn.example/main.jpg");
  });
});

describe("draftFromEvent", () => {
  it("leaves unset capacity empty and trims dates to the day", () => {
    const draft = draftFromEvent({ ...event, start_date: "2026-12-10T00:00:00" });
    expect(draft.startDate).toBe("2026-12-10");
    expect(draft.price).toBe("500");
    expect(draft.capacity).toBe("");
    expect(draft.region).toBe("");
  });
});

describe("tourInputFromDraft", () => {
  it("builds the payload with stops in order and drops blank highlights", () => {
    const draft = { ...draftFromTour(tour), highlights: [" Guide ", "", "Lunch"] };
    expect(tourInputFromDraft(draft, "draft")).toMatchObject({
      name: "Cape Coast Heritage",
      price_ghs: 2650,
      duration_days: 3,
      capacity: 12,
      highlights: ["Guide", "Lunch"],
      status: "draft",
      publish_at: null,
      is_popular: true,
      location_ids: [11, 12],
    });
  });

  it("sends publish_at only when scheduled", () => {
    const draft = draftFromTour(tour);
    expect(tourInputFromDraft(draft, "scheduled").publish_at).toBe("2026-12-01T09:00:00.000Z");
    expect(tourInputFromDraft(draft, "published").publish_at).toBeNull();
  });

  it("sends null for an empty capacity and duration", () => {
    const input = tourInputFromDraft({ ...emptyDraft(), name: "X", country: "Ghana", price: "100" }, "draft");
    expect(input.price_ghs).toBe(100);
    expect(input.capacity).toBeNull();
    expect(input.duration_days).toBeNull();
  });
});

describe("eventInputFromDraft", () => {
  it("derives duration from the date range", () => {
    const input = eventInputFromDraft(draftFromEvent(event), "draft");
    expect(input.duration_days).toBe(3);
    expect(input.start_date).toBe("2026-12-10");
    expect(input.destination).toBe("Accra");
  });

  it("ignores a stale typed duration and follows the dates", () => {
    const input = eventInputFromDraft({ ...draftFromEvent(event), durationDays: "5" }, "draft");
    expect(input.duration_days).toBe(3);
  });

  it("sends every country as a list", () => {
    const draft = { ...draftFromEvent(event), countries: ["Ghana", " Togo ", ""] };
    expect(eventInputFromDraft(draft, "draft").countries).toEqual(["Ghana", "Togo"]);
  });

  it("starts the countries from the event list", () => {
    expect(draftFromEvent({ ...event, countries: ["Ghana", "Benin"] }).countries).toEqual(["Ghana", "Benin"]);
  });

  it("requires at least one country on an event", () => {
    const draft = { ...draftFromEvent(event), countries: [] as string[], startDate: "2026-12-10", endDate: "2026-12-12" };
    expect(validateListing(draft, "event", "draft")).toBe("Choose at least one country.");
  });

  it("round-trips the event stops as location ids", () => {
    const withStops = {
      ...event,
      locations: [
        { id: 12, name: "Cape Coast Castle", description: null, country: "Ghana", region: "Cape Coast", created_at: "2026-01-01T00:00:00Z" },
        { id: 13, name: "Elmina Castle", description: null, country: "Ghana", region: "Cape Coast", created_at: "2026-01-01T00:00:00Z" },
      ],
    };
    const draft = draftFromEvent(withStops);
    expect(draft.locationIds).toEqual([12, 13]);
    expect(eventInputFromDraft(draft, "draft").location_ids).toEqual([12, 13]);
  });
});

describe("inclusiveDays", () => {
  it("counts both ends", () => {
    expect(inclusiveDays("2026-12-10", "2026-12-10")).toBe(1);
    expect(inclusiveDays("2026-12-10", "2026-12-12")).toBe(3);
  });

  it("rejects reversed or empty ranges", () => {
    expect(inclusiveDays("2026-12-12", "2026-12-10")).toBeNull();
    expect(inclusiveDays("", "2026-12-10")).toBeNull();
  });
});

describe("resolveStatus", () => {
  it("maps intent and mode to a status", () => {
    const base = emptyDraft();
    expect(resolveStatus(base, "draft")).toBe("draft");
    expect(resolveStatus(base, "publish")).toBe("published");
    expect(resolveStatus({ ...base, publishMode: "schedule" }, "publish")).toBe("scheduled");
  });
});

describe("validateListing", () => {
  const valid = { ...draftFromTour(tour), publishMode: "now" as const };

  it("accepts a complete tour", () => {
    expect(validateListing(valid, "tour", "published")).toBeNull();
  });

  it("requires a name and country", () => {
    expect(validateListing({ ...valid, name: " " }, "tour", "draft")).toBe("Enter a name.");
    expect(validateListing({ ...valid, country: "" }, "tour", "draft")).toBe("Enter a country.");
  });

  it("requires a price for events but not tours", () => {
    const noPrice = { ...valid, price: "", countries: ["Ghana"], startDate: "2026-01-01", endDate: "2026-01-02" };
    expect(validateListing(noPrice, "tour", "published")).toBeNull();
    expect(validateListing(noPrice, "event", "published")).toBe("Enter a price.");
    expect(validateListing(noPrice, "event", "draft")).toBe("Enter a price.");
  });

  it("rejects decimal prices", () => {
    expect(validateListing({ ...valid, price: "12.5" }, "tour", "draft")).toBe(
      "Price must be a whole number of cedis.",
    );
  });

  it("requires a publish time when scheduling", () => {
    expect(validateListing({ ...valid, publishOn: "" }, "tour", "scheduled")).toBe("Choose when to publish.");
  });

  it("requires ordered event dates", () => {
    const base = draftFromEvent({ ...event, price_ghs: 100 });
    expect(validateListing({ ...base, startDate: "" }, "event", "draft")).toBe("Choose a start and end date.");
    expect(validateListing({ ...base, endDate: "2026-12-01" }, "event", "draft")).toBe(
      "The end date cannot be before the start date.",
    );
    expect(validateListing(base, "event", "published")).toBeNull();
  });

  it("rejects a capacity below the seats already booked", () => {
    const base = draftFromEvent({ ...event, price_ghs: 100 });
    expect(validateListing({ ...base, capacity: "3" }, "event", "draft", 5)).toBe(
      "Capacity cannot be below the 5 seats already booked.",
    );
    expect(validateListing({ ...base, capacity: "5" }, "event", "draft", 5)).toBeNull();
  });
});

describe("diffExtras", () => {
  const catalogPrices = { 1: 50, 2: 100, 3: 80 };

  it("attaches new extras at the catalog price when no override differs", () => {
    const diff = diffExtras([], [{ extraId: 1, price: "50" }, { extraId: 3, price: "" }], catalogPrices);
    expect(diff.attach).toEqual([{ extraId: 1 }, { extraId: 3 }]);
    expect(diff.detach).toEqual([]);
  });

  it("attaches new extras with a custom price", () => {
    const diff = diffExtras([], [{ extraId: 1, price: "75" }], catalogPrices);
    expect(diff.attach).toEqual([{ extraId: 1, price: 75 }]);
  });

  it("re-prices only attached extras whose price changed", () => {
    const diff = diffExtras(
      [extra(1, 50), extra(2, 100)],
      [{ extraId: 1, price: "50" }, { extraId: 2, price: "120" }],
      catalogPrices,
    );
    expect(diff.attach).toEqual([{ extraId: 2, price: 120 }]);
  });

  it("detaches extras that were removed", () => {
    const diff = diffExtras([extra(1, 50), extra(2, 100)], [{ extraId: 2, price: "100" }], catalogPrices);
    expect(diff.detach).toEqual([1]);
    expect(diff.attach).toEqual([]);
  });
});

describe("moveItem", () => {
  it("moves an item and ignores out-of-range moves", () => {
    expect(moveItem([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
    expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
    expect(moveItem([1, 2, 3], 2, 3)).toEqual([1, 2, 3]);
  });
});

describe("savedMessage", () => {
  it("says a draft was saved", () => {
    expect(savedMessage("tour", "draft", true)).toBe("Tour saved as a draft.");
  });

  it("says a new published listing was published", () => {
    expect(savedMessage("event", "published", true)).toBe("Event published.");
  });

  it("says an edited published listing was updated", () => {
    expect(savedMessage("tour", "published", false)).toBe("Tour updated.");
  });

  it("says a scheduled listing was scheduled", () => {
    expect(savedMessage("event", "scheduled", false)).toBe("Event scheduled.");
  });
});
