import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AxiosError } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsPage } from "@/components/admin/pages/SettingsPage";
import { Toaster } from "@/components/ui/Toaster";
import { clearToasts } from "@/lib/toast";
import { adminSettingsApi } from "@/services/adminApi";
import store from "@/store";
import type { AdminSettings } from "@/types/api";

vi.mock("@/components/admin/layout/AdminLayout", () => ({
  useAdminLayout: () => ({ openNavigation: () => undefined }),
}));

vi.mock("@/services/adminApi", () => ({
  adminSettingsApi: { get: vi.fn(), update: vi.fn(), uploadLogo: vi.fn() },
  adminAuthApi: { forgotPassword: vi.fn() },
}));

const settings: AdminSettings = {
  company_name: "Afro Nyanka Tours",
  contact_email: "info@example.com",
  phone: "",
  location: "",
  logo_url: null,
  notify_new_inquiry: true,
  notify_booking_confirmation: true,
  notify_weekly_summary: false,
};

function renderPage() {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <SettingsPage />
        <Toaster />
      </MemoryRouter>
    </Provider>,
  );
}

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.mocked(adminSettingsApi.get).mockResolvedValue(settings);
    vi.mocked(adminSettingsApi.update).mockResolvedValue(settings);
    vi.mocked(adminSettingsApi.uploadLogo).mockResolvedValue();
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearToasts();
  });

  it("shows a success toast after saving", async () => {
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(adminSettingsApi.update).toHaveBeenCalled());
    expect(await screen.findByRole("status")).toHaveTextContent("Settings saved");
    expect(screen.queryByText("Changes saved")).not.toBeInTheDocument();
  });

  it("shows an error toast when saving fails", async () => {
    vi.mocked(adminSettingsApi.update).mockRejectedValue(
      new AxiosError("bad", "ERR_BAD_REQUEST", undefined, undefined, {
        status: 422,
        data: { detail: "Invalid phone number" },
        statusText: "Unprocessable",
        headers: {},
        config: {} as never,
      }),
    );
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: "Save changes" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid phone number");
  });

  it("shows a success toast after uploading a logo", async () => {
    renderPage();
    await screen.findByRole("button", { name: "Save changes" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(["x"], "logo.png", { type: "image/png" }));
    await waitFor(() => expect(adminSettingsApi.uploadLogo).toHaveBeenCalled());
    expect(await screen.findByRole("status")).toHaveTextContent("Logo updated");
  });
});
