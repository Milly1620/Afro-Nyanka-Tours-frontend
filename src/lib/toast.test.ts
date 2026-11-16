import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { clearToasts, dismissToast, toast, useToasts } from "@/lib/toast";

describe("toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearToasts();
  });

  afterEach(() => {
    clearToasts();
    vi.useRealTimers();
  });

  it("adds a toast with its kind and message", () => {
    const { result } = renderHook(() => useToasts());
    act(() => {
      toast.success("Saved");
    });
    expect(result.current).toMatchObject([{ kind: "success", message: "Saved" }]);
  });

  it("removes a success toast after four seconds", () => {
    const { result } = renderHook(() => useToasts());
    act(() => {
      toast.success("Saved");
    });
    act(() => {
      vi.advanceTimersByTime(4001);
    });
    expect(result.current).toEqual([]);
  });

  it("keeps an error toast longer than a success toast", () => {
    const { result } = renderHook(() => useToasts());
    act(() => {
      toast.error("Failed");
    });
    act(() => {
      vi.advanceTimersByTime(4001);
    });
    expect(result.current).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toEqual([]);
  });

  it("dismisses a toast by id", () => {
    const { result } = renderHook(() => useToasts());
    let id = 0;
    act(() => {
      id = toast.info("Heads up");
    });
    act(() => dismissToast(id));
    expect(result.current).toEqual([]);
  });

  it("shows at most four toasts, dropping the oldest", () => {
    const { result } = renderHook(() => useToasts());
    act(() => {
      ["a", "b", "c", "d", "e"].forEach((message) => toast.info(message));
    });
    expect(result.current.map((item) => item.message)).toEqual(["b", "c", "d", "e"]);
  });
});
