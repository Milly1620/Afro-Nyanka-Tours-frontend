import { pageBounds, searchBookings } from "@/components/admin/bookings/bookingFilters";
import type { AdminBookingRow } from "@/types/api";

function row(overrides: Partial<AdminBookingRow>): AdminBookingRow {
  return {
    id: 1,
    reference: "BC-1",
    customer_name: "Ama Mensah",
    customer_email: "ama@example.com",
    tour_or_event_name: "Cape Coast Heritage",
    start_date: null,
    number_of_people: 2,
    amount_ghs: 1000,
    status: "pending",
    created_at: "2026-11-01T00:00:00",
    ...overrides,
  };
}

describe("searchBookings", () => {
  const rows = [row({}), row({ id: 2, reference: "BC-2", customer_name: "Kofi Boateng", customer_email: "kofi@example.com", tour_or_event_name: null })];

  it("returns every row for a blank search", () => {
    expect(searchBookings(rows, "  ")).toHaveLength(2);
  });

  it("matches the reference case-insensitively", () => {
    expect(searchBookings(rows, "bc-2").map((item) => item.id)).toEqual([2]);
  });

  it("matches the customer email", () => {
    expect(searchBookings(rows, "AMA@").map((item) => item.id)).toEqual([1]);
  });

  it("matches the tour or event name and tolerates a missing one", () => {
    expect(searchBookings(rows, "heritage").map((item) => item.id)).toEqual([1]);
  });
});

describe("pageBounds", () => {
  it("reports the first page of a longer list", () => {
    expect(pageBounds(0, 50, 120)).toEqual({ from: 1, to: 50, total: 120, hasPrevious: false, hasNext: true });
  });

  it("reports the last page", () => {
    expect(pageBounds(100, 20, 120)).toEqual({ from: 101, to: 120, total: 120, hasPrevious: true, hasNext: false });
  });

  it("reports an empty list", () => {
    expect(pageBounds(0, 0, 0)).toMatchObject({ from: 0, to: 0, hasNext: false });
  });

  it("falls back to page size when the total is unknown", () => {
    expect(pageBounds(0, 50, undefined).hasNext).toBe(true);
  });
});
