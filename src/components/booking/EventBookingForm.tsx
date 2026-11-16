import { useState, type FormEvent } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { ALL_COUNTRIES } from "@/data/countries";
import { EstimatedTotal } from "@/components/booking/EstimatedTotal";
import { ExtrasPicker } from "@/components/booking/ExtrasPicker";
import {
  buildEventBookingPayload,
  chosenExtras,
  estimateTotal,
  eventPeopleLimit,
} from "@/lib/booking";
import { toast } from "@/lib/toast";
import { bookingsApi, getErrorMessage, getErrorStatus } from "@/services/api";
import type { BookingCreateResponse, Event as EventListing } from "@/types/api";

interface EventBookingFormProps {
  event: EventListing;
  onBooked: (confirmation: BookingCreateResponse) => void;
  onSeatsChanged: () => void;
}

const inputClasses =
  "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFA75D] placeholder:text-[#ADADAD] focus:border-transparent outline-none transition-colors";

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function validateEventBooking(
  values: { name: string; email: string; numberOfPersons: string },
  limit: number | null,
): string | null {
  if (!values.name.trim()) return "Name is required";
  if (!EMAIL_PATTERN.test(values.email.trim())) return "Enter a valid email address";
  const people = parseInt(values.numberOfPersons, 10);
  if (Number.isNaN(people) || people < 1) return "At least 1 person is required";
  if (limit !== null && people > limit) {
    return `Only ${limit} ${limit === 1 ? "seat is" : "seats are"} left`;
  }
  return null;
}

export function EventBookingForm({ event, onBooked, onSeatsChanged }: EventBookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [numberOfPersons, setNumberOfPersons] = useState("1");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [extraIds, setExtraIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = eventPeopleLimit(event);
  const offered = event.extras.filter((extra) => extra.is_active !== false);
  const total = estimateTotal([event], parseInt(numberOfPersons, 10), chosenExtras(offered, extraIds));

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const problem = validateEventBooking({ name, email, numberOfPersons }, limit);
    if (problem) {
      setError(problem);
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const confirmation = await bookingsApi.create(
        buildEventBookingPayload(
          { name, email, numberOfPersons: parseInt(numberOfPersons, 10), notes, extraIds, age, country },
          event,
        ),
      );
      onBooked(confirmation);
      toast.success(`Booking ${confirmation.booking.reference} received`);
    } catch (reason) {
      const message = getErrorMessage(reason);
      setError(message);
      toast.error(message);
      if (getErrorStatus(reason) === 409) onSeatsChanged();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#4A2C00]">Book this event</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="event-name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="event-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="event-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="event-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="event-country" className="block text-sm font-medium text-gray-700 mb-2">
            Country of origin
          </label>
          <NativeSelect
            id="event-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClasses}
          >
            <option value="">Select country</option>
            {ALL_COUNTRIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <label htmlFor="event-age" className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            id="event-age"
            type="number"
            min={1}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="event-people" className="block text-sm font-medium text-gray-700 mb-2">
          No. Persons
        </label>
        <input
          id="event-people"
          type="number"
          min={1}
          max={limit ?? undefined}
          value={numberOfPersons}
          onChange={(e) => setNumberOfPersons(e.target.value)}
          className={inputClasses}
        />
        {limit !== null && (
          <p className="text-xs text-gray-600 mt-1">
            {limit} {limit === 1 ? "seat" : "seats"} left
          </p>
        )}
      </div>

      <ExtrasPicker extras={offered} selectedIds={extraIds} onChange={setExtraIds} />

      <div>
        <label htmlFor="event-notes" className="block text-sm font-medium text-gray-700 mb-2">
          Additional services
        </label>
        <textarea
          id="event-notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your message"
          className={`${inputClasses} resize-none`}
        />
      </div>

      <EstimatedTotal total={total} />

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#FFA75D] hover:bg-[#FFA75D] text-white px-8 py-3 rounded-xl font-semibold text-base cursor-pointer"
        >
          <Calendar className="h-5 w-5 mr-2" />
          {isSubmitting ? "Submitting..." : "Book now"}
        </Button>
      </div>
    </form>
  );
}
