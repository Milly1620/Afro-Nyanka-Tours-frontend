import { formatGhs } from "@/lib/adminFormat";
import { formatAmount, formatEventDateRange } from "@/lib/booking";
import type { BookingCreateResponse } from "@/types/api";

export function BookingConfirmationDetails({ confirmation }: { confirmation: BookingCreateResponse }) {
  const { booking, summary } = confirmation;
  const tourNames = summary.tours_and_locations.map((tour) => tour.tour_name);

  return (
    <dl className="w-full space-y-2 rounded-xl bg-orange-50 p-4 text-left text-sm text-[#4A2C00]">
      <div className="flex justify-between gap-3">
        <dt>Reference</dt>
        <dd className="font-semibold">{summary.reference}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt>Status</dt>
        <dd className="font-semibold capitalize">{summary.status}</dd>
      </div>
      {summary.event && (
        <div className="flex justify-between gap-3">
          <dt>Event</dt>
          <dd className="text-right font-semibold">
            {summary.event.name}
            <span className="block text-xs font-normal">
              {formatEventDateRange(summary.event.start_date, summary.event.end_date)}
            </span>
          </dd>
        </div>
      )}
      {tourNames.length > 0 && (
        <div className="flex justify-between gap-3">
          <dt>{tourNames.length === 1 ? "Tour" : "Tours"}</dt>
          <dd className="text-right font-semibold">{tourNames.join(", ")}</dd>
        </div>
      )}
      <div className="flex justify-between gap-3">
        <dt>People</dt>
        <dd className="font-semibold">{booking.number_of_people}</dd>
      </div>
      {summary.extras.map((extra) => (
        <div key={extra.name} className="flex justify-between gap-3">
          <dt>{extra.name}</dt>
          <dd className="font-semibold">{formatGhs(extra.price_ghs)}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-3 border-t border-orange-200 pt-2">
        <dt>Total</dt>
        <dd className="font-semibold">{formatAmount(summary.amount_ghs)}</dd>
      </div>
    </dl>
  );
}
