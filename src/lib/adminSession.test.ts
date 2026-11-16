import { afterEach, describe, expect, it, vi } from "vitest";
import { clearAdminSession, getAdminToken, hasAdminSession, saveAdminSession } from "@/lib/adminSession";

describe("adminSession", () => {
  afterEach(() => {
    clearAdminSession();
    vi.useRealTimers();
  });

  it("returns no token before sign in", () => {
    expect(getAdminToken()).toBeNull();
    expect(hasAdminSession()).toBe(false);
  });

  it("returns the saved token", () => {
    saveAdminSession("abc", 3600);
    expect(getAdminToken()).toBe("abc");
    expect(hasAdminSession()).toBe(true);
  });

  it("drops the token once it has expired", () => {
    vi.useFakeTimers();
    saveAdminSession("abc", 60);
    vi.advanceTimersByTime(61_000);
    expect(getAdminToken()).toBeNull();
  });

  it("clears the token", () => {
    saveAdminSession("abc", 3600);
    clearAdminSession();
    expect(getAdminToken()).toBeNull();
  });

  it("ignores corrupted stored data", () => {
    localStorage.setItem("admin:session", "not json");
    expect(getAdminToken()).toBeNull();
  });
});
