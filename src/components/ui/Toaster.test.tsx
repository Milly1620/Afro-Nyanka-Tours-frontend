import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster } from "@/components/ui/Toaster";
import { clearToasts, toast } from "@/lib/toast";

describe("Toaster", () => {
  afterEach(() => {
    act(() => clearToasts());
  });

  it("announces a success toast as a status", () => {
    render(<Toaster />);
    act(() => {
      toast.success("Tour deleted");
    });
    expect(screen.getByRole("status")).toHaveTextContent("Tour deleted");
  });

  it("announces an error toast as an alert", () => {
    render(<Toaster />);
    act(() => {
      toast.error("Could not delete");
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Could not delete");
  });

  it("lets the user dismiss a toast", async () => {
    render(<Toaster />);
    act(() => {
      toast.info("Heads up");
    });
    await userEvent.click(screen.getByRole("button", { name: /dismiss notification/i }));
    expect(screen.queryByText("Heads up")).not.toBeInTheDocument();
  });
});
