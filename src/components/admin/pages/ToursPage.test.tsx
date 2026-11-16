import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AxiosError } from "axios";
import { ToursPage } from "@/components/admin/pages/ToursPage";
import { Toaster } from "@/components/ui/Toaster";
import { clearToasts } from "@/lib/toast";
import store from "@/store";
import { adminToursApi } from "@/services/adminApi";
import type { AdminTour } from "@/types/api";

vi.mock("@/components/admin/layout/AdminLayout", () => ({
  useAdminLayout: () => ({ openNavigation: () => undefined }),
}));

vi.mock("@/services/adminApi", () => ({
  adminToursApi: { list: vi.fn(), remove: vi.fn(), update: vi.fn() },
}));

const tour = (overrides: Partial<AdminTour>): AdminTour => ({
  id: 1,
  name: "Cape Coast Heritage",
  description: "",
  country: "Ghana",
  region: "Central",
  is_active: true,
  created_at: "",
  updated_at: null,
  tour_locations: [],
  main_image_url: null,
  price_ghs: 2650,
  duration_days: 3,
  capacity: null,
  highlights: [],
  extras: [],
  status: "published",
  publish_at: null,
  ...overrides,
});

const listing = {
  items: [tour({}), tour({ id: 2, name: "Kumasi Trail", price_ghs: null, status: "draft", region: "Ashanti" })],
  counts: { all: 2, published: 1, draft: 1, scheduled: 0 },
};

function renderPage() {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ToursPage />
        <Toaster />
      </MemoryRouter>
    </Provider>,
  );
}

function conflict(detail: string) {
  return new AxiosError("conflict", "ERR_BAD_REQUEST", undefined, undefined, {
    status: 409,
    data: { detail },
    statusText: "Conflict",
    headers: {},
    config: {} as never,
  });
}

describe("ToursPage", () => {
  beforeEach(() => {
    vi.mocked(adminToursApi.list).mockResolvedValue(listing);
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearToasts();
  });

  it("shows tours from the API with price on request for unpriced tours", async () => {
    renderPage();
    expect(await screen.findByText("Cape Coast Heritage")).toBeInTheDocument();
    expect(screen.getByText("GHS 2,650")).toBeInTheDocument();
    expect(screen.getByText("Price on request")).toBeInTheDocument();
  });

  it("shows counts from the server on the status tabs", async () => {
    renderPage();
    await screen.findByText("Cape Coast Heritage");
    expect(screen.getByRole("tab", { name: /Drafts/ })).toHaveTextContent("1");
  });

  it("requests the chosen status from the server", async () => {
    renderPage();
    await screen.findByText("Cape Coast Heritage");
    fireEvent.click(screen.getByRole("tab", { name: /Published/ }));
    await waitFor(() =>
      expect(adminToursApi.list).toHaveBeenLastCalledWith({ status: "published", skip: 0, limit: 50 }),
    );
  });

  it("asks for confirmation in a dialog before deleting", async () => {
    renderPage();
    await screen.findByText("Cape Coast Heritage");
    fireEvent.click(screen.getByRole("button", { name: "Delete Cape Coast Heritage" }));
    expect(await screen.findByRole("alertdialog", { name: "Delete tour" })).toHaveTextContent("Cape Coast Heritage");
    expect(adminToursApi.remove).not.toHaveBeenCalled();
  });

  it("keeps the tour when the dialog is cancelled", async () => {
    renderPage();
    await screen.findByText("Cape Coast Heritage");
    fireEvent.click(screen.getByRole("button", { name: "Delete Cape Coast Heritage" }));
    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(adminToursApi.remove).not.toHaveBeenCalled();
  });

  it("deletes the tour and shows a success toast when confirmed", async () => {
    vi.mocked(adminToursApi.remove).mockResolvedValue(undefined);
    renderPage();
    await screen.findByText("Cape Coast Heritage");
    fireEvent.click(screen.getByRole("button", { name: "Delete Cape Coast Heritage" }));
    fireEvent.click(await screen.findByRole("button", { name: "Delete tour" }));
    await waitFor(() => expect(adminToursApi.remove).toHaveBeenCalledWith(1));
    expect(await screen.findByRole("status")).toHaveTextContent('"Cape Coast Heritage" deleted.');
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("shows an error toast when deleting fails", async () => {
    vi.mocked(adminToursApi.remove).mockRejectedValue(new Error("down"));
    renderPage();
    await screen.findByText("Cape Coast Heritage");
    fireEvent.click(screen.getByRole("button", { name: "Delete Cape Coast Heritage" }));
    fireEvent.click(await screen.findByRole("button", { name: "Delete tour" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't delete this tour.");
  });

  it("offers to set a tour with bookings to draft when deleting is refused", async () => {
    vi.mocked(adminToursApi.remove).mockRejectedValue(conflict("Tour has bookings"));
    vi.mocked(adminToursApi.update).mockResolvedValue(tour({ status: "draft" }));
    renderPage();
    await screen.findByText("Cape Coast Heritage");
    fireEvent.click(screen.getByRole("button", { name: "Delete Cape Coast Heritage" }));
    fireEvent.click(await screen.findByRole("button", { name: "Delete tour" }));
    expect((await screen.findAllByText("Tour has bookings")).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Set to draft" }));
    await waitFor(() =>
      expect(adminToursApi.update).toHaveBeenCalledWith(1, { status: "draft", publish_at: null }),
    );
    expect(await screen.findByText('"Cape Coast Heritage" set to draft.')).toBeInTheDocument();
  });

  it("shows an error with a retry when the list fails", async () => {
    vi.mocked(adminToursApi.list).mockRejectedValueOnce(new Error("down"));
    renderPage();
    expect(await screen.findByRole("button", { name: "Try again" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Cape Coast Heritage")).toBeInTheDocument();
  });
});
