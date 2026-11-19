import {
  buildEventBookingPayload,
  buildTourBookingPayload,
  chosenExtras,
  estimateTotal,
  eventPeopleLimit,
  formatAmount,
  formatEventDateRange,
  formatSeats,
  groupSizeLimit,
  isSoldOut,
  offeredExtras,
  selectedTours,
  type BookingFormValues,
} from "@/lib/booking";
import type { Event as EventListing, Tour } from "@/types/api";

function tour(overrides: Partial<Tour> & { id: number; name: string }): Tour {
  return {
    description: "",
    country: "Ghana",
    region: "",
    is_active: true,
    created_at: "2026-01-01T00:00:00",
    updated_at: null,
    tour_locations: [],
    main_image_url: null,
    price_ghs: 1000,
    duration_days: 2,
    capacity: null,
    highlights: [],
    extras: [],
    ...overrides,
  };
}

function stops(...ids: number[]): Tour["tour_locations"] {
  return ids.map((id, index) => ({
    id,
    location_id: id,
    order: index + 1,
    location: { id, name: `Stop ${id}`, description: null, country: "Ghana", region: "", created_at: "" },
  }));
}

const pickup = { extra_id: 2, name: "Airport pickup", description: null, price_ghs: 150 };
const guide = { extra_id: 3, name: "Private guide", description: null, price_ghs: 300 };

const values: BookingFormValues = {
  selectedCountry: "Ghana",
  selectedDestinations: ["Cape Coast"],
  startDate: new Date("2026-12-10T00:00:00Z"),
  endDate: new Date("2026-12-12T00:00:00Z"),
  name: " Ama Mensah ",
  email: "ama@example.com ",
  age: "30",
  country: "Ghana",
  additionalServices: "Vegetarian meals",
  numberOfPersons: "2",
  extraIds: [],
};

describe("estimateTotal", () => {
  it("multiplies each tour price by the group size", () => {
    expect(estimateTotal([{ price_ghs: 1000 }, { price_ghs: 500 }], 2, [])).toBe(3000);
  });

  it("adds each extra once regardless of group size", () => {
    expect(estimateTotal([{ price_ghs: 1000 }], 4, [{ price_ghs: 150 }, { price_ghs: 300 }])).toBe(4450);
  });

  it("charges only extras when the group size is invalid", () => {
    expect(estimateTotal([{ price_ghs: 1000 }], Number.NaN, [{ price_ghs: 150 }])).toBe(150);
  });
});

describe("groupSizeLimit", () => {
  it("uses the smallest capacity among the tours", () => {
    expect(groupSizeLimit([12, null, 8])).toBe(8);
  });

  it("is unlimited when no tour has a capacity", () => {
    expect(groupSizeLimit([null, undefined])).toBeNull();
  });
});

describe("offeredExtras", () => {
  it("lists a shared extra once against the first tour offering it", () => {
    const first = tour({ id: 1, name: "A", extras: [pickup] });
    const second = tour({ id: 2, name: "B", extras: [pickup, guide] });
    expect(offeredExtras([first, second]).map((extra) => [extra.extra_id, extra.tour_id])).toEqual([
      [2, 1],
      [3, 2],
    ]);
  });

  it("skips inactive extras", () => {
    const listing = tour({ id: 1, name: "A", extras: [{ ...pickup, is_active: false }, guide] });
    expect(offeredExtras([listing]).map((extra) => extra.extra_id)).toEqual([3]);
  });

  it("keeps only the chosen extras", () => {
    const listing = tour({ id: 1, name: "A", extras: [pickup, guide] });
    expect(chosenExtras(offeredExtras([listing]), [3]).map((extra) => extra.extra_id)).toEqual([3]);
  });
});

describe("selectedTours", () => {
  it("follows the order the destinations were chosen in", () => {
    const tours = [tour({ id: 1, name: "A" }), tour({ id: 2, name: "B" })];
    expect(selectedTours(tours, ["B", "A", "Missing"]).map((item) => item.id)).toEqual([2, 1]);
  });
});

describe("buildTourBookingPayload", () => {
  const cape = tour({ id: 4, name: "Cape Coast", tour_locations: stops(12, 13), extras: [pickup] });
  const accra = tour({ id: 5, name: "Accra", tour_locations: stops(20), extras: [guide] });

  it("sends the tour selection with all of its stops and no amount", () => {
    const payload = buildTourBookingPayload(values, [cape, accra]);
    expect(payload).toMatchObject({
      customer_name: "Ama Mensah",
      customer_email: "ama@example.com",
      customer_age: 30,
      customer_country: "Ghana",
      number_of_people: 2,
      additional_services: "Vegetarian meals",
      tour_selections: [{ tour_id: 4, locations: [12, 13], order: 1 }],
      extras: [],
    });
    expect(Object.keys(payload)).not.toContain("amount_ghs");
  });

  it("omits tour_id on extras when a single tour is booked", () => {
    const payload = buildTourBookingPayload({ ...values, extraIds: [2] }, [cape, accra]);
    expect(payload.extras).toEqual([{ extra_id: 2 }]);
  });

  it("adds tour_id to extras when several tours are booked", () => {
    const payload = buildTourBookingPayload(
      { ...values, selectedDestinations: ["Cape Coast", "Accra"], extraIds: [2, 3] },
      [cape, accra],
    );
    expect(payload.extras).toEqual([
      { extra_id: 2, tour_id: 4 },
      { extra_id: 3, tour_id: 5 },
    ]);
    expect(payload.tour_selections?.map((selection) => selection.order)).toEqual([1, 2]);
  });

  it("drops extras that the selected tours do not offer", () => {
    const payload = buildTourBookingPayload({ ...values, extraIds: [3] }, [cape, accra]);
    expect(payload.extras).toEqual([]);
  });

  it("leaves out empty optional fields", () => {
    const payload = buildTourBookingPayload(
      { ...values, age: "", country: "", additionalServices: " ", startDate: null, endDate: null },
      [cape],
    );
    expect(Object.keys(payload)).not.toEqual(
      expect.arrayContaining(["customer_age", "customer_country", "additional_services", "start_date", "end_date"]),
    );
  });
});

describe("event bookings", () => {
  const event: EventListing = {
    id: 7,
    name: "Homowo",
    description: null,
    country: "Ghana",
    region: null,
    destination: "Accra",
    start_date: "2026-12-10",
    end_date: "2026-12-12",
    duration_days: 3,
    price_ghs: 500,
    capacity: 10,
    seats_left: 3,
    highlights: [],
    main_image_url: null,
    gallery_images: [],
    locations: [],
    extras: [pickup, { ...guide, is_active: false }],
  };

  it("sends the event id with no dates or tour selections", () => {
    const payload = buildEventBookingPayload(
      { name: "Ama", email: "ama@example.com", numberOfPersons: 2, notes: "", extraIds: [2, 3] },
      event,
    );
    expect(payload).toEqual({
      customer_name: "Ama",
      customer_email: "ama@example.com",
      number_of_people: 2,
      event_id: 7,
      extras: [{ extra_id: 2 }],
    });
  });

  it("includes age and country when given", () => {
    const payload = buildEventBookingPayload(
      { name: "Ama", email: "ama@example.com", numberOfPersons: 1, notes: "", extraIds: [], age: "34", country: "Ghana" },
      event,
    );
    expect(payload).toMatchObject({ customer_age: 34, customer_country: "Ghana" });
  });

  it("omits age and country when blank", () => {
    const payload = buildEventBookingPayload(
      { name: "Ama", email: "ama@example.com", numberOfPersons: 1, notes: "", extraIds: [], age: "", country: "" },
      event,
    );
    expect(payload).not.toHaveProperty("customer_age");
    expect(payload).not.toHaveProperty("customer_country");
  });

  it("flags zero seats as sold out", () => {
    expect(isSoldOut({ seats_left: 0 })).toBe(true);
    expect(isSoldOut({ seats_left: null })).toBe(false);
  });

  it("caps people at the seats left", () => {
    expect(eventPeopleLimit(event)).toBe(3);
  });

  it("describes seat availability", () => {
    expect(formatSeats({ seats_left: 0 })).toBe("Sold out");
    expect(formatSeats({ seats_left: 1 })).toBe("1 seat left");
    expect(formatSeats({ seats_left: 5 })).toBe("5 seats left");
    expect(formatSeats({ seats_left: null })).toBeNull();
  });
});

describe("formatting", () => {
  it("formats a priced amount in cedis", () => {
    expect(formatAmount(2650)).toBe("GHS 2,650");
  });

  it("collapses a date range inside one month", () => {
    expect(formatEventDateRange("2026-12-10", "2026-12-12")).toBe("10 – 12 Dec 2026");
  });

  it("keeps both months for a range across months", () => {
    expect(formatEventDateRange("2026-11-30", "2026-12-02")).toBe("30 Nov – 2 Dec 2026");
  });

  it("shows a single date for a one-day event", () => {
    expect(formatEventDateRange("2026-12-10", "2026-12-10")).toBe("10 Dec 2026");
  });
});
