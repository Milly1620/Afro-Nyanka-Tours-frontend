import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { useResource } from "@/hooks/useResource";
import { formatPrice } from "@/lib/adminFormat";
import { formatEventDateRange, formatSeats, isSoldOut } from "@/lib/booking";
import { eventsApi } from "@/services/api";
import type { Event as EventListing } from "@/types/api";

const EVENT_COUNTRIES = ["Ghana", "Togo", "Benin", "Côte d'Ivoire", "Burkina Faso"];

function EventCard({ event }: { event: EventListing }) {
  const soldOut = isSoldOut(event);
  const seats = formatSeats(event);

  return (
    <Link
      to={`/events/${event.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
    >
      <div className="relative overflow-hidden">
        {event.main_image_url ? (
          <img
            src={event.main_image_url}
            alt={event.name}
            className="w-full h-48 lg:h-[240px] group-hover:scale-105 transition-transform duration-300 object-cover"
          />
        ) : (
          <div className="w-full h-48 lg:h-[240px] bg-[#F5F5F5]" role="img" aria-label={event.name} />
        )}
        {seats && (
          <span
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs poppins-semibold ${
              soldOut ? "bg-[#482B11] text-white" : "bg-white text-[#482B11]"
            }`}
          >
            {seats}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-1 flex-col gap-2">
        <h3 className="text-base lg:text-[16.61px] poppins-semibold text-[#0D0D0C] group-hover:text-[#FFA75D] transition-colors">
          {event.name}
        </h3>
        <div className="flex items-center text-[#6E7070]">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-[14.76px] poppins-regular">
            {[event.destination, event.countries?.length ? event.countries.join(", ") : event.country].filter(Boolean).join(", ")}
          </span>
        </div>
        <div className="flex items-center text-[#6E7070]">
          <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-[14.76px] poppins-regular">
            {formatEventDateRange(event.start_date, event.end_date)}
          </span>
        </div>
        <p className="mt-auto pt-2 text-[16.61px] poppins-semibold text-[#0D0D0C]">
          {formatPrice(event.price_ghs)}
          <span className="text-[14.76px] poppins-regular text-[#6E7070]"> /person</span>
        </p>
      </div>
    </Link>
  );
}

export function EventsPage() {
  const [country, setCountry] = useState<string | null>(null);
  const { data: events, loading, error, reload } = useResource(
    () => eventsApi.list(country ? [country] : []),
    [country],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="py-10 lg:py-16 bg-[#E6E6E6] min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-[#482B11] mb-4">
            Upcoming events
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 poppins-regular max-w-2xl mx-auto">
            Fixed-date trips you can book a seat on
          </p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2 lg:mb-10" role="group" aria-label="Filter events by country">
          {[null, ...EVENT_COUNTRIES].map((option) => (
            <button
              key={option ?? "all"}
              type="button"
              aria-pressed={country === option}
              onClick={() => setCountry(option)}
              className={`cursor-pointer rounded-xl px-4 py-2 text-sm poppins-medium transition-colors ${
                country === option ? "bg-[#482B11] text-white" : "bg-white text-[#482B11] hover:text-[#FFA75D]"
              }`}
            >
              {option ?? "All"}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-gray-500">Loading events...</p>}

        {error && (
          <div role="alert" className="text-center text-gray-600">
            <p className="mb-3">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="rounded-xl bg-white px-4 py-2 text-[#482B11] poppins-medium cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && events?.length === 0 && (
          <p className="text-center text-gray-500">{country ? `No upcoming events in ${country}` : "No upcoming events"}</p>
        )}

        {!error && events && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-7.5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
