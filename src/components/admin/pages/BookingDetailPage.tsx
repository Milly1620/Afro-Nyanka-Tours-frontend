import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { BackLink } from "@/components/admin/ui/BackLink";
import { Divider, Panel, PanelHeading } from "@/components/admin/ui/Panel";
import { StatusChip } from "@/components/admin/ui/StatusChip";
import { allowedStatusMoves, bookingStatusActionLabels } from "@/components/admin/bookings/bookingStatus";
import { useResource } from "@/hooks/useResource";
import { formatDateTime, formatGhs, formatShortDate } from "@/lib/adminFormat";
import { adminBookingsApi } from "@/services/adminApi";
import { getErrorMessage } from "@/services/api";
import type { AdminBookingDetail, BookingStatus } from "@/types/api";

export function BookingDetailPage() {
  const { bookingId } = useParams();
  const id = Number(bookingId);
  const detail = useResource(() => adminBookingsApi.get(id), [id]);

  return (
    <AdminPage
      title={detail.data ? detail.data.summary.reference : "Booking"}
      subtitle="Customer details, itinerary and status"
      contentClassName="gap-[18px]"
    >
      <BackLink to="/admin/bookings" label="Bookings" />
      <AsyncState loading={detail.loading} error={detail.error} onRetry={detail.reload}>
        {detail.data && <BookingDetail detail={detail.data} onChanged={detail.reload} />}
      </AsyncState>
    </AdminPage>
  );
}

function BookingDetail({ detail, onChanged }: { detail: AdminBookingDetail; onChanged: () => void }) {
  const { booking, summary } = detail;
  const [pendingStatus, setPendingStatus] = useState<BookingStatus | null>(null);
  const [error, setError] = useState("");

  const moves = allowedStatusMoves(booking.status);

  const changeStatus = async (status: BookingStatus) => {
    if (status === "cancelled" && !window.confirm(`Cancel booking ${summary.reference}? This cannot be undone.`)) {
      return;
    }
    setPendingStatus(status);
    setError("");
    try {
      await adminBookingsApi.updateStatus(booking.id, status);
      onChanged();
    } catch (reason) {
      setError(getErrorMessage(reason, "We couldn't update the booking status."));
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <Panel className="flex flex-col gap-4 p-[22px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PanelHeading title="Customer" subtitle={`Received ${formatDateTime(booking.created_at)}`} />
            <StatusChip status={booking.status} />
          </div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Detail label="Name">{booking.customer_name}</Detail>
            <Detail label="Email">
              <a href={`mailto:${booking.customer_email}`} className="break-all text-admin-accent hover:underline">
                {booking.customer_email}
              </a>
            </Detail>
            <Detail label="Age">{booking.customer_age ?? "—"}</Detail>
            <Detail label="Country of origin">{booking.customer_country || "—"}</Detail>
            <Detail label="Guests">{booking.number_of_people}</Detail>
            <Detail label="Dates">
              {booking.start_date && booking.end_date
                ? `${formatShortDate(booking.start_date)} – ${formatShortDate(booking.end_date)}`
                : "—"}
            </Detail>
          </dl>
          {booking.additional_services && (
            <>
              <Divider />
              <Detail label="Additional services">{booking.additional_services}</Detail>
            </>
          )}
        </Panel>

        <Panel className="flex flex-col gap-4 p-[22px]">
          <PanelHeading title={summary.event ? "Event" : "Tours and stops"} />
          {summary.event && (
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-semibold text-admin-text">{summary.event.name}</span>
              <span className="text-[13px] text-admin-subtle">
                {formatShortDate(summary.event.start_date)} – {formatShortDate(summary.event.end_date)}
                {summary.event.destination ? ` · ${summary.event.destination}` : ""}
              </span>
            </div>
          )}
          {summary.tours_and_locations.map((tour, index) => (
            <div key={`${tour.tour_id}-${index}`} className="flex flex-col gap-2">
              <span className="text-[15px] font-semibold text-admin-text">{tour.tour_name}</span>
              {tour.selected_locations.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {tour.selected_locations.map((location) => (
                    <li key={location.location_id} className="flex items-center gap-2 text-[13.5px] text-admin-text-2">
                      <span className="size-[6px] shrink-0 rounded-full bg-admin-orange" />
                      {location.location_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[13px] text-admin-subtle">No stops selected</span>
              )}
            </div>
          ))}
          {!summary.event && summary.tours_and_locations.length === 0 && (
            <p className="text-[13px] text-admin-subtle">No tour or event attached.</p>
          )}
        </Panel>
      </div>

      <div className="flex w-full flex-col gap-5 xl:w-[380px] xl:shrink-0">
        <Panel className="flex flex-col gap-4 p-[22px]">
          <PanelHeading title="Price" />
          {summary.extras.length > 0 && (
            <ul className="flex flex-col gap-2">
              {summary.extras.map((extra, index) => (
                <li key={`${extra.name}-${index}`} className="flex items-center justify-between text-[13.5px] text-admin-text-2">
                  <span>{extra.name}</span>
                  <span className="font-medium">{formatGhs(extra.price_ghs)}</span>
                </li>
              ))}
            </ul>
          )}
          <Divider />
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-medium text-admin-subtle">Total</span>
            <span className="text-[22px] font-semibold text-admin-text">
              {summary.amount_ghs === null ? "Quote pending" : formatGhs(summary.amount_ghs)}
            </span>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-3 p-[22px]">
          <PanelHeading
            title="Status"
            subtitle={moves.length === 0 ? "This booking is closed." : "A booking only moves forward."}
          />
          {moves.map((status) => (
            <AdminButton
              key={status}
              variant={status === "cancelled" ? "secondary" : "primary"}
              size="lg"
              className="w-full"
              disabled={pendingStatus !== null}
              onClick={() => changeStatus(status)}
            >
              {pendingStatus === status ? "Updating..." : bookingStatusActionLabels[status]}
            </AdminButton>
          ))}
          {error && (
            <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
              {error}
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-[12px] font-medium text-admin-subtle">{label}</dt>
      <dd className="text-[14px] font-medium text-admin-text">{children}</dd>
    </div>
  );
}
