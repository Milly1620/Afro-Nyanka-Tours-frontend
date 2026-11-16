import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookingConfirmationDetails } from "@/components/booking/BookingConfirmationDetails";
import type { BookingCreateResponse } from "@/types/api";

const confirmation: BookingCreateResponse = {
  booking: {
    id: 43,
    reference: "BC-43",
    status: "pending",
    amount_ghs: null,
    customer_name: "Ama Mensah",
    customer_email: "ama@example.com",
    customer_age: 30,
    customer_country: "Ghana",
    number_of_people: 2,
    start_date: null,
    end_date: null,
    additional_services: null,
    created_at: "2026-11-15T00:00:00Z",
  },
  message: "Booking received",
  summary: {
    reference: "BC-43",
    status: "pending",
    amount_ghs: null,
    extras: [],
    event: null,
    tours_and_locations: [
      {
        tour_id: 2,
        tour_name: "Cape Coast Tours",
        country: "Ghana",
        region: "Cape Coast",
        selected_locations: [{ location_id: 12, location_name: "Cape Coast Castle", order: 1 }],
      },
    ],
  },
};

describe("BookingConfirmationDetails", () => {
  it("shows the reference and the tour name from the server summary", () => {
    render(<BookingConfirmationDetails confirmation={confirmation} />);
    expect(screen.getByText("BC-43")).toBeInTheDocument();
    expect(screen.getByText("Cape Coast Tours")).toBeInTheDocument();
  });

  it("says a quote will follow when the amount is null", () => {
    render(<BookingConfirmationDetails confirmation={confirmation} />);
    expect(screen.getByText(/quote/i)).toBeInTheDocument();
  });
});
