import { Clock, Users } from "lucide-react";
import { formatPrice } from "@/lib/adminFormat";
import type { Tour } from "@/types/api";

export function SelectedTours({ tours }: { tours: Tour[] }) {
  if (tours.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {tours.map((tour) => (
        <li key={tour.id} className="rounded-lg border border-gray-200 p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-[#4A2C00]">{tour.name}</p>
            <p className="shrink-0 text-sm font-semibold text-[#482B11]">
              {formatPrice(tour.price_ghs)}
              {tour.price_ghs !== null && <span className="font-normal text-gray-600"> /person</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {tour.duration_days !== null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {tour.duration_days} {tour.duration_days === 1 ? "day" : "days"}
              </span>
            )}
            {tour.capacity !== null && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                Up to {tour.capacity} people
              </span>
            )}
          </div>
          {tour.highlights.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {tour.highlights.map((highlight) => (
                <li key={highlight} className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-[#4A2C00]">
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
