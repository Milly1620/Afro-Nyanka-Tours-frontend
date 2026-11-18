import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { Avatar } from "@/components/admin/ui/Avatar";
import { FilterPills, type FilterOption } from "@/components/admin/ui/FilterPills";
import { StatusChip } from "@/components/admin/ui/StatusChip";
import {
  BOOKINGS_PAGE_SIZE,
  bookingFilterLabels,
  countFor,
  pageBounds,
  searchBookings,
  type BookingFilter,
} from "@/components/admin/bookings/bookingFilters";
import { useResource } from "@/hooks/useResource";
import { avatarToneFor, formatGhs, formatShortDate } from "@/lib/adminFormat";
import { adminBookingsApi } from "@/services/adminApi";

const columns =
  "grid grid-cols-[100px_minmax(200px,1.2fr)_minmax(160px,1fr)_110px_70px_130px_120px_120px] gap-4";

export function BookingsPage() {
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);

  const bookings = useResource(
    () =>
      adminBookingsApi.list({
        status: filter === "all" ? undefined : filter,
        skip,
        limit: BOOKINGS_PAGE_SIZE,
      }),
    [filter, skip],
  );

  useEffect(() => {
    setSkip(0);
  }, [filter]);

  const rows = useMemo(() => searchBookings(bookings.data?.items ?? [], search), [bookings.data, search]);

  const filterOptions: FilterOption<BookingFilter>[] = bookingFilterLabels.map((option) => ({
    ...option,
    count: countFor(bookings.data?.counts, option.value),
  }));

  const bounds = pageBounds(skip, bookings.data?.items.length ?? 0, countFor(bookings.data?.counts, filter));

  return (
    <AdminPage
      title="Bookings"
      subtitle="All reservations across tours and events"
      search={search}
      onSearchChange={setSearch}
      contentClassName="gap-[18px]"
    >
      <FilterPills label="Filter bookings by status" options={filterOptions} value={filter} onChange={setFilter} />

      <AsyncState loading={bookings.loading} error={bookings.error} onRetry={bookings.reload}>
        <div className="overflow-x-auto rounded-[16px] border border-admin-border bg-white">
          <div role="table" aria-label="Bookings" className="min-w-[1100px]">
            <div role="row" className={`${columns} bg-admin-field px-5 py-[13px]`}>
              {["REFERENCE", "CUSTOMER", "TOUR / EVENT", "DEPARTURE", "GUESTS", "AMOUNT", "STATUS", "RECEIVED"].map(
                (heading) => (
                  <span
                    key={heading}
                    role="columnheader"
                    className="text-[11.5px] font-semibold tracking-[0.345px] text-admin-placeholder"
                  >
                    {heading}
                  </span>
                ),
              )}
            </div>
            {rows.map((booking) => (
              <Link
                key={booking.id}
                to={`/admin/bookings/${booking.id}`}
                role="row"
                className={`${columns} items-center border-b border-admin-divider px-5 py-[15px] last:border-b-0 hover:bg-admin-field`}
              >
                <span role="cell" className="text-[13px] font-medium text-admin-reference">
                  {booking.reference}
                </span>
                <span role="cell" className="flex min-w-0 items-center gap-[9px]">
                  <Avatar name={booking.customer_name} tone={avatarToneFor(booking.customer_name)} size={30} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[13.5px] font-semibold text-admin-text">
                      {booking.customer_name}
                    </span>
                    <span className="truncate text-[12px] text-admin-subtle">{booking.customer_email}</span>
                  </span>
                </span>
                <span role="cell" className="truncate text-[13.5px] text-admin-text-2">
                  {booking.tour_or_event_name ?? "—"}
                </span>
                <span role="cell" className="text-[13.5px] text-admin-subtle">
                  {booking.start_date ? formatShortDate(booking.start_date) : "—"}
                </span>
                <span role="cell" className="text-[13.5px] text-admin-text-2">
                  {booking.number_of_people}
                </span>
                <span role="cell" className="text-[13.5px] font-semibold text-admin-text">
                  {booking.amount_ghs === null ? "Quote pending" : formatGhs(booking.amount_ghs)}
                </span>
                <span role="cell">
                  <StatusChip status={booking.status} />
                </span>
                <span role="cell" className="text-[13px] text-admin-subtle">
                  {formatShortDate(booking.created_at)}
                </span>
              </Link>
            ))}
            {rows.length === 0 && (
              <p className="px-5 py-10 text-center text-[13.5px] text-admin-subtle">
                {search ? "No bookings on this page match your search." : "No bookings yet."}
              </p>
            )}
          </div>
        </div>

        {(bounds.hasPrevious || bounds.hasNext) && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12.5px] text-admin-subtle">
              {bounds.from}–{bounds.to} of {bounds.total}
            </p>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                size="sm"
                disabled={!bounds.hasPrevious}
                onClick={() => setSkip(Math.max(skip - BOOKINGS_PAGE_SIZE, 0))}
              >
                Previous
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                disabled={!bounds.hasNext}
                onClick={() => setSkip(skip + BOOKINGS_PAGE_SIZE)}
              >
                Next
              </AdminButton>
            </div>
          </div>
        )}
      </AsyncState>
    </AdminPage>
  );
}
