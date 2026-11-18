import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AxiosError } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminLoginPage, loginErrorMessage } from "@/components/admin/pages/AdminLoginPage";
import { Toaster } from "@/components/ui/Toaster";
import { clearToasts } from "@/lib/toast";
import { adminAuthApi } from "@/services/adminApi";
import store from "@/store";

function unauthorized(status: number) {
  return new AxiosError("bad", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    data: { detail: "x" },
    statusText: "",
    headers: {},
    config: {} as never,
  });
}

function renderPage() {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/admin/login"]}>
        <AdminLoginPage />
        <Toaster />
      </MemoryRouter>
    </Provider>,
  );
}

async function submit() {
  await userEvent.type(screen.getByLabelText("Email address"), "owner@example.com");
  await userEvent.type(screen.getByLabelText("Password"), "a-long-enough-pass");
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
}

describe("AdminLoginPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearToasts();
    localStorage.clear();
  });

  it("shows an error toast for wrong credentials", async () => {
    vi.spyOn(adminAuthApi, "login").mockRejectedValue(unauthorized(401));
    renderPage();
    await submit();
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.some((alert) => /incorrect email or password/i.test(alert.textContent ?? ""))).toBe(true);
    expect(alerts).toHaveLength(2);
  });

  it("shows a success toast after signing in", async () => {
    vi.spyOn(adminAuthApi, "login").mockResolvedValue({ access_token: "t", token_type: "bearer", expires_in: 3600 });
    renderPage();
    await submit();
    expect(await screen.findByRole("status")).toHaveTextContent("Signed in");
  });
});

describe("loginErrorMessage", () => {
  it("explains rate limiting", () => {
    expect(loginErrorMessage(unauthorized(429))).toMatch(/too many attempts/i);
  });
});
