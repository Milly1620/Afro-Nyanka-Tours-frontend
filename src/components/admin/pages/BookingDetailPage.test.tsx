import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosError } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BookingDetailPage } from "@/components/admin/pages/BookingDetailPage";
import { Toaster } from "@/components/ui/Toaster";
import { clearToasts } from "@/lib/toast";
import { adminBookingsApi } from "@/services/adminApi";
import type { AdminBookingDetail, BookingStatus } from "@/types/api";

vi.mock("@/components/admin/layout/AdminLayout", () => ({
  useAdminLayout: () => ({ openNavigation: () => undefined }),
}));

vi.mock("@/services/adminApi", () => ({
  adminBookingsApi: { get: vi.fn(), updateStatus: vi.fn() },
}));

function detail(status: BookingStatus): AdminBookingDetail {
  return {
    booking: {
      id: 7,
      reference: "BC-7",
      status,
      amount_ghs: 2400,
      customer_name: "Ama Mensah",
      customer_email: "ama@example.com",
      customer_age: 30,
      customer_country: "Ghana",
      number_of_people: 2,
      start_date: "2026-12-10T00:00:00",
      end_date: "2026-12-12T00:00:00",
      additional_services: null,
      created_at: "2026-11-01T10:00:00Z",
    },
    summary: {
      reference: "BC-7",
      status,
      amount_ghs: 2400,
      extras: [],
      event: null,
      tours_and_locations: [],
    },
  };
}

function conflict(message: string) {
  return new AxiosError("conflict", "ERR_BAD_REQUEST", undefined, undefined, {
    status: 409,
    data: { detail: message },
    statusText: "Conflict",
    headers: {},
    config: {} as never,
  });
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={["/admin/bookings/7"]}>
      <Routes>
        <Route path="/admin/bookings/:bookingId" element={<BookingDetailPage />} />
      </Routes>
      <Toaster />
    </MemoryRouter>,
  );
}

describe("BookingDetailPage", () => {
  beforeEach(() => {
    vi.mocked(adminBookingsApi.get).mockResolvedValue(detail("pending"));
    vi.mocked(adminBookingsApi.updateStatus).mockResolvedValue();
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearToasts();
  });

  it("confirms a booking and shows a success toast", async () => {
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: "Confirm booking" }));
    await waitFor(() => expect(adminBookingsApi.updateStatus).toHaveBeenCalledWith(7, "confirmed"));
    expect(await screen.findByRole("status")).toHaveTextContent("Booking BC-7 confirmed");
  });

  it("asks for confirmation in a dialog before cancelling", async () => {
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: "Cancel booking" }));
    const dialog = await screen.findByRole("alertdialog", { name: "Cancel booking" });
    expect(dialog).toHaveTextContent("BC-7");
    expect(dialog).toHaveTextContent(/cannot be undone/i);
    expect(adminBookingsApi.updateStatus).not.toHaveBeenCalled();
  });

  it("keeps the booking when the dialog is dismissed", async () => {
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: "Cancel booking" }));
    await userEvent.click(await screen.findByRole("button", { name: "Keep booking" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(adminBookingsApi.updateStatus).not.toHaveBeenCalled();
  });

  it("cancels the booking after confirming and shows a success toast", async () => {
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: "Cancel booking" }));
    const dialog = await screen.findByRole("alertdialog");
    const confirm = Array.from(dialog.querySelectorAll("button")).find((button) => button.textContent === "Cancel booking");
    await userEvent.click(confirm as HTMLButtonElement);
    await waitFor(() => expect(adminBookingsApi.updateStatus).toHaveBeenCalledWith(7, "cancelled"));
    expect(await screen.findByRole("status")).toHaveTextContent("Booking BC-7 cancelled");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("shows the backend message in an error toast when the move is rejected", async () => {
    vi.mocked(adminBookingsApi.updateStatus).mockRejectedValue(conflict("Can't change a paid booking to pending"));
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: "Mark as paid" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Can't change a paid booking to pending");
  });
});
