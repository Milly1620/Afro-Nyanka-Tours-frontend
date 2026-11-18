import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventBookingForm, validateEventBooking } from "@/components/booking/EventBookingForm";
import { toast } from "@/lib/toast";
import { bookingsApi } from "@/services/api";
import type { BookingCreateResponse, Event as EventListing } from "@/types/api";

vi.mock("@/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/services/api")>("@/services/api");
  return { ...actual, bookingsApi: { create: vi.fn() } };
});

const event: EventListing = {
  id: 7,
  name: "Homowo",
  description: null,
  country: "Ghana",
  region: null,
  destination: "Accra",
  start_date: "2026-12-10",
  end_date: "2026-12-12",
  duration_days: 3,
  price_ghs: 500,
  capacity: 10,
  seats_left: 3,
  highlights: [],
  main_image_url: null,
  gallery_images: [],
  locations: [],
  extras: [{ extra_id: 2, name: "Airport pickup", description: null, price_ghs: 150 }],
};

const confirmation = {
  booking: { reference: "BC-42" },
  message: "Booked",
  summary: { reference: "BC-42" },
} as unknown as BookingCreateResponse;

function apiError(status: number, detail: string) {
  return { isAxiosError: true, response: { status, data: { detail } } };
}

async function fillForm(people = "2") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), "Ama Mensah");
  await user.type(screen.getByLabelText("Email"), "ama@example.com");
  await user.clear(screen.getByLabelText("No. Persons"));
  await user.type(screen.getByLabelText("No. Persons"), people);
  return user;
}

beforeEach(() => {
  vi.mocked(bookingsApi.create).mockReset();
});

describe("validateEventBooking", () => {
  const valid = { name: "Ama", email: "ama@example.com", numberOfPersons: "2" };

  it("accepts a complete booking within the seats left", () => {
    expect(validateEventBooking(valid, 3)).toBeNull();
  });

  it("requires a name", () => {
    expect(validateEventBooking({ ...valid, name: " " }, null)).toBe("Name is required");
  });

  it("rejects a malformed email", () => {
    expect(validateEventBooking({ ...valid, email: "ama" }, null)).toBe("Enter a valid email address");
  });

  it("rejects more people than seats left", () => {
    expect(validateEventBooking({ ...valid, numberOfPersons: "4" }, 3)).toBe("Only 3 seats are left");
  });

  it("allows any group size when seats are unlimited", () => {
    expect(validateEventBooking({ ...valid, numberOfPersons: "40" }, null)).toBeNull();
  });
});

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

describe("EventBookingForm", () => {
  beforeEach(() => {
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
  });

  it("books the event with its id and the chosen extras and no amount", async () => {
    vi.mocked(bookingsApi.create).mockResolvedValue(confirmation);
    const onBooked = vi.fn();
    render(<EventBookingForm event={event} onBooked={onBooked} onSeatsChanged={vi.fn()} />);
    const user = await fillForm("2");
    await user.click(screen.getByLabelText(/Airport pickup/));
    await user.click(screen.getByRole("button", { name: "Book now" }));
    await waitFor(() => expect(onBooked).toHaveBeenCalledWith(confirmation));
    expect(toast.success).toHaveBeenCalledWith(`Booking ${confirmation.booking.reference} received`);
    expect(bookingsApi.create).toHaveBeenCalledWith({
      customer_name: "Ama Mensah",
      customer_email: "ama@example.com",
      number_of_people: 2,
      event_id: 7,
      extras: [{ extra_id: 2 }],
    });
  });

  it("shows the estimated total including extras once", async () => {
    render(<EventBookingForm event={event} onBooked={vi.fn()} onSeatsChanged={vi.fn()} />);
    const user = await fillForm("2");
    await user.click(screen.getByLabelText(/Airport pickup/));
    expect(screen.getByText("GHS 1,150")).toBeInTheDocument();
  });

  it("shows the seats message and asks for a refresh on a 409", async () => {
    vi.mocked(bookingsApi.create).mockRejectedValue(apiError(409, "Only 1 seats left"));
    const onSeatsChanged = vi.fn();
    render(<EventBookingForm event={event} onBooked={vi.fn()} onSeatsChanged={onSeatsChanged} />);
    const user = await fillForm("2");
    await user.click(screen.getByRole("button", { name: "Book now" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Only 1 seats left");
    expect(toast.error).toHaveBeenCalledWith("Only 1 seats left");
    expect(onSeatsChanged).toHaveBeenCalledTimes(1);
  });

  it("does not submit a group larger than the seats left", async () => {
    render(<EventBookingForm event={event} onBooked={vi.fn()} onSeatsChanged={vi.fn()} />);
    const user = await fillForm("5");
    await user.click(screen.getByRole("button", { name: "Book now" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Only 3 seats are left");
    expect(bookingsApi.create).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
