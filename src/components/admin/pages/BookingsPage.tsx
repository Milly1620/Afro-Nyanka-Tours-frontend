import { useMemo, useState } from "react";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { Avatar } from "@/components/admin/ui/Avatar";
import { FilterPills, type FilterOption } from "@/components/admin/ui/FilterPills";
import { StatusChip } from "@/components/admin/ui/StatusChip";
import { bookings } from "@/data/adminMockData";
import { formatGhs } from "@/lib/adminFormat";
import type { BookingStatus } from "@/types/admin";

type BookingFilter = "all" | BookingStatus;

const filterOptions: FilterOption<BookingFilter>[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const columns = "grid grid-cols-[120px_minmax(180px,1fr)_minmax(180px,1fr)_120px_130px_130px] gap-4";

export function BookingsPage() {
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [search, setSearch] = useState("");

  const visibleBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (filter !== "all" && booking.status !== filter) return false;
      if (!query) return true;
      return [booking.reference, booking.customer, booking.tour].some((field) =>
        field.toLowerCase().includes(query),
      );
    });
  }, [filter, search]);

  return (
    <AdminPage
      title="Bookings"
      subtitle="All reservations across tours"
      search={search}
      onSearchChange={setSearch}
      contentClassName="gap-[18px]"
    >
      <FilterPills label="Filter bookings by status" options={filterOptions} value={filter} onChange={setFilter} />

      <div className="overflow-x-auto rounded-[16px] border border-admin-border bg-white">
        <div role="table" aria-label="Bookings" className="min-w-[960px]">
          <div role="row" className={`${columns} bg-admin-field px-5 py-[13px]`}>
            {["REFERENCE", "CUSTOMER", "TOUR", "DEPARTURE", "AMOUNT", "STATUS"].map((heading) => (
              <span
                key={heading}
                role="columnheader"
                className="text-[11.5px] font-semibold tracking-[0.345px] text-admin-placeholder"
              >
                {heading}
              </span>
            ))}
          </div>
          {visibleBookings.map((booking) => (
            <div
              key={booking.reference}
              role="row"
              className={`${columns} items-center border-b border-admin-divider px-5 py-[15px] last:border-b-0`}
            >
              <span role="cell" className="text-[13px] font-medium text-admin-reference">
                {booking.reference}
              </span>
              <span role="cell" className="flex min-w-0 items-center gap-[9px]">
                <Avatar name={booking.customer} tone={booking.avatarTone} size={30} />
                <span className="truncate text-[13.5px] font-semibold text-admin-text">{booking.customer}</span>
              </span>
              <span role="cell" className="truncate text-[13.5px] text-admin-text-2">
                {booking.tour}
              </span>
              <span role="cell" className="text-[13.5px] text-admin-subtle">
                {booking.departure}
              </span>
              <span role="cell" className="text-[13.5px] font-semibold text-admin-text">
                {formatGhs(booking.amount)}
              </span>
              <span role="cell">
                <StatusChip status={booking.status} />
              </span>
            </div>
          ))}
          {visibleBookings.length === 0 && (
            <p className="px-5 py-10 text-center text-[13.5px] text-admin-subtle">
              No bookings match this filter.
            </p>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
