import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import api, { getErrorMessage, getErrorStatus, setUnauthorizedHandler } from "@/services/api";
import { clearAdminSession, getAdminToken, saveAdminSession } from "@/lib/adminSession";

function failure(
  status: number,
  data: unknown,
  requestConfig?: InternalAxiosRequestConfig,
): AxiosError {
  const config = requestConfig ?? ({ url: "/api/admin/tours", headers: new AxiosHeaders() } as InternalAxiosRequestConfig);
  return new AxiosError("failed", "ERR_BAD_REQUEST", config, null, {
    status,
    statusText: "",
    data,
    headers: {},
    config,
  });
}

describe("getErrorMessage", () => {
  it("returns a string detail as is", () => {
    expect(getErrorMessage(failure(409, { detail: "Only 2 seats left" }))).toBe("Only 2 seats left");
  });

  it("joins validation issues with their field", () => {
    const error = failure(422, { detail: [{ loc: ["body", "email"], msg: "invalid email" }, { loc: ["body", "name"], msg: "required" }] });
    expect(getErrorMessage(error)).toBe("email: invalid email; name: required");
  });

  it("reports a network error when there is no response", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");
    expect(getErrorMessage(error)).toMatch(/network error/i);
  });

  it("falls back for non-axios errors", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });
});

describe("getErrorStatus", () => {
  it("reads the response status", () => {
    expect(getErrorStatus(failure(429, {}))).toBe(429);
  });

  it("returns null for other errors", () => {
    expect(getErrorStatus(new Error("boom"))).toBeNull();
  });
});

describe("request and response interceptors", () => {
  afterEach(() => {
    clearAdminSession();
    setUnauthorizedHandler(null);
  });

  it("sends the stored token as a bearer header", async () => {
    saveAdminSession("token-123", 3600);
    let sent: string | undefined;
    await api.get("/api/tours/", {
      adapter: async (config) => {
        sent = config.headers.get("Authorization") as string | undefined;
        return { data: [], status: 200, statusText: "OK", headers: {}, config };
      },
    });
    expect(sent).toBe("Bearer token-123");
  });

  it("clears the session and notifies on a 401 from an authenticated call", async () => {
    saveAdminSession("token-123", 3600);
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    await expect(
      api.get("/api/admin/tours", {
        adapter: async (config) => Promise.reject(failure(401, { detail: "expired" }, config)),
      }),
    ).rejects.toBeDefined();
    expect(getAdminToken()).toBeNull();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not treat a failed login as an expired session", async () => {
    saveAdminSession("token-123", 3600);
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    await expect(
      api.post("/api/admin/auth/login", {}, {
        adapter: async (config) => Promise.reject(failure(401, { detail: "bad" }, config)),
      }),
    ).rejects.toBeDefined();
    expect(handler).not.toHaveBeenCalled();
  });
});
