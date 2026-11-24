import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Check, MapPin } from "lucide-react";
import { EventBookingForm } from "@/components/booking/EventBookingForm";
import { Congratulations } from "@/components/sections/Congratulations";
import { useResource } from "@/hooks/useResource";
import { formatPrice } from "@/lib/adminFormat";
import { formatEventDateRange, formatSeats, isSoldOut } from "@/lib/booking";
import { eventsApi } from "@/services/api";
import type { BookingCreateResponse } from "@/types/api";

export function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const id = Number(eventId);
  const [confirmation, setConfirmation] = useState<BookingCreateResponse | null>(null);
  const { data: event, loading, error, reload } = useResource(() => eventsApi.get(id), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (Number.isNaN(id)) {
    return <p className="py-24 text-center text-gray-600">Event not found.</p>;
  }

  if (error && !event) {
    return (
      <div role="alert" className="py-24 text-center text-gray-600">
        <p className="mb-3">{error}</p>
        <Link to="/events" className="text-[#FFA75D] poppins-medium hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  if (!event) {
    return loading ? <p className="py-24 text-center text-gray-500">Loading event...</p> : null;
  }

  const soldOut = isSoldOut(event);
  const seats = formatSeats(event);
  const where = event.destination ?? "";

  return (
    <div className="bg-[#E6E6E6] pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <Link to="/events" className="text-sm text-[#482B11] poppins-medium hover:text-[#FFA75D]">
          ← All events
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 lg:p-8 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl lg:text-4xl poppins-bold text-[#482B11]">{event.name}</h1>
              {seats && (
                <span
                  className={`rounded-full px-3 py-1 text-sm poppins-semibold ${
                    soldOut ? "bg-[#482B11] text-white" : "bg-orange-50 text-[#482B11]"
                  }`}
                >
                  {seats}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#6E7070]">
              {where && (
                <span className="flex items-center gap-2 poppins-regular">
                  <MapPin className="h-4 w-4 text-[#FFA75D]" />
                  {where}
                </span>
              )}
              <span className="flex items-center gap-2 poppins-regular">
                <CalendarDays className="h-4 w-4 text-[#FFA75D]" />
                {formatEventDateRange(event.start_date, event.end_date)}
                {event.duration_days !== null &&
                  ` · ${event.duration_days} ${event.duration_days === 1 ? "day" : "days"}`}
              </span>
            </div>
            <p className="text-xl poppins-semibold text-[#0D0D0C]">
              {formatPrice(event.price_ghs)}
              <span className="text-base poppins-regular text-[#6E7070]"> /person</span>
            </p>
            {event.description && (
              <p className="text-[#4A2C00] leading-relaxed poppins-regular whitespace-pre-line">
                {event.description}
              </p>
            )}
            {event.highlights.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-[#4A2C00] poppins-regular">
                    <Check className="h-4 w-4 text-[#FFA75D] flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
            {event.locations.length > 0 && (
              <div>
                <h2 className="text-sm text-gray-600 mb-2">Stops</h2>
                <ul className="flex flex-wrap gap-2">
                  {event.locations.map((location) => (
                    <li key={location.id} className="rounded-full bg-orange-50 px-3 py-1 text-sm text-[#4A2C00]">
                      {location.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {event.gallery_images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {event.gallery_images.map((image) => (
              <img key={image} src={image} alt="" className="w-full h-40 lg:h-56 object-contain bg-[#E6E6E6] rounded-xl" />
            ))}
          </div>
        )}

        {confirmation ? (
          <Congratulations confirmation={confirmation} onDone={() => navigate("/events")} />
        ) : soldOut ? (
          <p role="status" className="rounded-2xl bg-white p-6 text-center text-lg poppins-semibold text-[#482B11] shadow-sm">
            Sold out
          </p>
        ) : (
          <EventBookingForm event={event} onBooked={setConfirmation} onSeatsChanged={reload} />
        )}
      </div>
    </div>
  );
}
