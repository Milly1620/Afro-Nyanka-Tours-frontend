import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PasswordResetPanel, resetRequestError } from "@/components/admin/settings/PasswordResetPanel";
import { setAdminEmail } from "@/adminSlice";
import { adminAuthApi } from "@/services/adminApi";
import store from "@/store";

function renderPanel(email: string | null) {
  if (email) store.dispatch(setAdminEmail(email));
  render(
    <Provider store={store}>
      <PasswordResetPanel />
    </Provider>,
  );
}

describe("PasswordResetPanel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests a reset link for the signed-in admin", async () => {
    const forgot = vi.spyOn(adminAuthApi, "forgotPassword").mockResolvedValue();
    renderPanel("owner@example.com");
    await userEvent.click(screen.getByRole("button", { name: /email me a reset link/i }));
    await waitFor(() => expect(forgot).toHaveBeenCalledWith("owner@example.com"));
    expect(await screen.findByRole("status")).toHaveTextContent(/check your inbox/i);
  });

  it("shows an error when the request fails", async () => {
    vi.spyOn(adminAuthApi, "forgotPassword").mockRejectedValue(new Error("boom"));
    renderPanel("owner@example.com");
    await userEvent.click(screen.getByRole("button", { name: /email me a reset link/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send the link/i);
  });
});

describe("resetRequestError", () => {
  it("falls back to a generic message", () => {
    expect(resetRequestError(new Error("boom"))).toMatch(/couldn't send the link/i);
  });
});
