import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { EventsPage } from "@/components/admin/pages/EventsPage";
import { Toaster } from "@/components/ui/Toaster";
import { clearToasts } from "@/lib/toast";
import { adminEventsApi } from "@/services/adminApi";
import store from "@/store";
import type { AdminEvent } from "@/types/api";

vi.mock("@/components/admin/layout/AdminLayout", () => ({
  useAdminLayout: () => ({ openNavigation: () => undefined }),
}));

vi.mock("@/services/adminApi", () => ({
  adminEventsApi: { list: vi.fn(), remove: vi.fn() },
}));

const event: AdminEvent = {
  id: 9,
  name: "Homowo Festival",
  description: null,
  country: "Ghana",
  region: null,
  destination: "Accra",
  start_date: "2026-12-15",
  end_date: "2026-12-17",
  duration_days: 3,
  price_ghs: 950,
  capacity: 20,
  seats_left: 20,
  highlights: [],
  main_image_url: null,
  gallery_images: [],
  locations: [],
  extras: [],
  status: "published",
  publish_at: null,
  seats_booked: 0,
};

function renderPage() {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <EventsPage />
        <Toaster />
      </MemoryRouter>
    </Provider>,
  );
}

describe("EventsPage deleting", () => {
  beforeEach(() => {
    vi.mocked(adminEventsApi.list).mockResolvedValue({
      items: [event],
      counts: { all: 1, published: 1, draft: 0, scheduled: 0 },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearToasts();
  });

  it("asks for confirmation in a dialog before deleting", async () => {
    renderPage();
    await screen.findByText("Homowo Festival");
    fireEvent.click(screen.getByRole("button", { name: "Delete Homowo Festival" }));
    expect(await screen.findByRole("alertdialog", { name: "Delete event" })).toHaveTextContent("Homowo Festival");
    expect(adminEventsApi.remove).not.toHaveBeenCalled();
  });

  it("keeps the event when the dialog is cancelled", async () => {
    renderPage();
    await screen.findByText("Homowo Festival");
    fireEvent.click(screen.getByRole("button", { name: "Delete Homowo Festival" }));
    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(adminEventsApi.remove).not.toHaveBeenCalled();
  });

  it("deletes the event and shows a success toast when confirmed", async () => {
    vi.mocked(adminEventsApi.remove).mockResolvedValue(undefined);
    renderPage();
    await screen.findByText("Homowo Festival");
    fireEvent.click(screen.getByRole("button", { name: "Delete Homowo Festival" }));
    fireEvent.click(await screen.findByRole("button", { name: "Delete event" }));
    await waitFor(() => expect(adminEventsApi.remove).toHaveBeenCalledWith(9));
    expect(await screen.findByRole("status")).toHaveTextContent('"Homowo Festival" deleted.');
  });

  it("shows an error toast when deleting fails", async () => {
    vi.mocked(adminEventsApi.remove).mockRejectedValue(new Error("down"));
    renderPage();
    await screen.findByText("Homowo Festival");
    fireEvent.click(screen.getByRole("button", { name: "Delete Homowo Festival" }));
    fireEvent.click(await screen.findByRole("button", { name: "Delete event" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't delete this event.");
  });
});
