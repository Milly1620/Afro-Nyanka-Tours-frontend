import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContactSection } from "@/components/sections/ContactSection";
import { toast } from "@/lib/toast";
import { contactApi } from "@/services/api";

vi.mock("@/hooks/usePublicSettings", () => ({
  usePublicSettings: () => null,
}));

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock("@/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/services/api")>("@/services/api");
  return { ...actual, contactApi: { sendMessage: vi.fn() } };
});

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText("Enter your name"), "Ama Mensah");
  await user.type(screen.getByPlaceholderText("Enter your email"), "ama@example.com");
  await user.type(screen.getByPlaceholderText("Enter your phone number"), "0240000000");
  await user.type(screen.getByPlaceholderText("Enter subject"), "Question");
  await user.type(screen.getByPlaceholderText("Write your message"), "Hello there");
  await user.click(screen.getByRole("button", { name: /send/i }));
}

describe("ContactSection", () => {
  beforeEach(() => {
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(contactApi.sendMessage).mockReset();
  });

  it("shows a success toast after the message is sent", async () => {
    vi.mocked(contactApi.sendMessage).mockResolvedValue({});
    render(<ContactSection />);
    await fillAndSubmit();
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows an error toast when sending fails", async () => {
    vi.mocked(contactApi.sendMessage).mockRejectedValue(new Error("boom"));
    render(<ContactSection />);
    await fillAndSubmit();
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(toast.success).not.toHaveBeenCalled();
  });
});
