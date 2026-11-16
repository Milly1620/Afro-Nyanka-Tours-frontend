import type { AdminBookingRow, BookingStatus, StatusCounts } from "@/types/api";

export type BookingFilter = "all" | BookingStatus;

export const BOOKINGS_PAGE_SIZE = 50;

export const bookingFilterLabels: { value: BookingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
];

export function countFor(counts: StatusCounts | undefined, filter: BookingFilter): number | undefined {
  return counts?.[filter];
}

export function searchBookings(rows: AdminBookingRow[], search: string): AdminBookingRow[] {
  const query = search.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) =>
    [row.reference, row.customer_name, row.customer_email, row.tour_or_event_name ?? ""].some((field) =>
      field.toLowerCase().includes(query),
    ),
  );
}

export function pageBounds(skip: number, loaded: number, total: number | undefined) {
  return {
    from: loaded === 0 ? 0 : skip + 1,
    to: skip + loaded,
    total: total ?? skip + loaded,
    hasPrevious: skip > 0,
    hasNext: total === undefined ? loaded === BOOKINGS_PAGE_SIZE : skip + loaded < total,
  };
}
