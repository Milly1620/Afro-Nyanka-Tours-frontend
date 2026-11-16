import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AxiosError } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ExtrasPage } from "@/components/admin/pages/ExtrasPage";
import { Toaster } from "@/components/ui/Toaster";
import { clearToasts } from "@/lib/toast";
import { adminExtrasApi } from "@/services/adminApi";
import type { AdminExtra } from "@/types/api";

vi.mock("@/components/admin/layout/AdminLayout", () => ({
  useAdminLayout: () => ({ openNavigation: () => undefined }),
}));

vi.mock("@/services/adminApi", () => ({
  adminExtrasApi: { list: vi.fn(), create: vi.fn(), update: vi.fn() },
}));

const pickup: AdminExtra = { id: 2, name: "Airport pickup", description: null, default_price_ghs: 300, is_active: true };

function failure(message: string) {
  return new AxiosError("bad", "ERR_BAD_REQUEST", undefined, undefined, {
    status: 400,
    data: { detail: message },
    statusText: "Bad Request",
    headers: {},
    config: {} as never,
  });
}

function renderPage() {
  render(
    <MemoryRouter>
      <ExtrasPage />
      <Toaster />
    </MemoryRouter>,
  );
}

describe("ExtrasPage", () => {
  beforeEach(() => {
    vi.mocked(adminExtrasApi.list).mockResolvedValue({ items: [pickup], counts: { all: 1 } });
    vi.mocked(adminExtrasApi.create).mockResolvedValue({ ...pickup, id: 3, name: "Drone photos" });
    vi.mocked(adminExtrasApi.update).mockResolvedValue(pickup);
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearToasts();
  });

  it("shows a success toast after creating an extra", async () => {
    renderPage();
    await screen.findByText("Airport pickup");
    await userEvent.type(screen.getByLabelText("Name"), "Drone photos");
    await userEvent.type(screen.getByLabelText("Default price (GHS)"), "450");
    await userEvent.click(screen.getByRole("button", { name: "Create extra" }));
    await waitFor(() => expect(adminExtrasApi.create).toHaveBeenCalled());
    expect(await screen.findByRole("status")).toHaveTextContent("Drone photos created");
  });

  it("shows an error toast when creating an extra fails", async () => {
    vi.mocked(adminExtrasApi.create).mockRejectedValue(failure("Name already exists"));
    renderPage();
    await screen.findByText("Airport pickup");
    await userEvent.type(screen.getByLabelText("Name"), "Airport pickup");
    await userEvent.type(screen.getByLabelText("Default price (GHS)"), "300");
    await userEvent.click(screen.getByRole("button", { name: "Create extra" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Name already exists");
  });

  it("shows a toast when an extra is hidden from customers", async () => {
    renderPage();
    await userEvent.click(await screen.findByRole("switch", { name: "Airport pickup active" }));
    await waitFor(() => expect(adminExtrasApi.update).toHaveBeenCalledWith(2, { is_active: false }));
    expect(await screen.findByRole("status")).toHaveTextContent("Airport pickup is now hidden from customers");
  });

  it("shows an error toast when toggling fails", async () => {
    vi.mocked(adminExtrasApi.update).mockRejectedValue(failure("Not allowed"));
    renderPage();
    await userEvent.click(await screen.findByRole("switch", { name: "Airport pickup active" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Not allowed");
  });
});
