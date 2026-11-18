import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { emptyDraft, tourInputFromDraft } from "@/components/admin/listings/listingMapping";
import { saveListing } from "@/components/admin/listings/saveListing";
import { useListingEditor } from "@/components/admin/listings/useListingEditor";
import { clearToasts, toast } from "@/lib/toast";

vi.mock("@/components/admin/listings/saveListing", () => ({ saveListing: vi.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

const validDraft = { ...emptyDraft(), name: "Volta Cruise", country: "Ghana", price: "1200" };

function renderEditor(draft = validDraft, id: number | null = null) {
  const api = {
    create: vi.fn(),
    update: vi.fn(),
    attachExtra: vi.fn(),
    detachExtra: vi.fn(),
    uploadMainImage: vi.fn(),
    uploadGalleryImages: vi.fn(),
    removeGalleryImage: vi.fn(),
  };
  return renderHook(
    () =>
      useListingEditor({
        kind: "tour",
        api,
        id,
        draft,
        existingExtras: [],
        catalog: [],
        buildInput: tourInputFromDraft,
        listPath: "/admin/tours",
        editPath: (savedId) => `/admin/tours/${savedId}/edit`,
        onFollowUpFailure: vi.fn(),
      }),
    { wrapper },
  );
}

describe("useListingEditor toasts", () => {
  afterEach(() => {
    vi.clearAllMocks();
    clearToasts();
  });

  it("toasts the validation problem when saving an invalid listing", async () => {
    const spy = vi.spyOn(toast, "error");
    const { result } = renderEditor({ ...validDraft, name: "" });
    await act(async () => {
      await result.current.save("publish");
    });
    expect(spy).toHaveBeenCalledWith("Enter a name.");
    expect(saveListing).not.toHaveBeenCalled();
  });

  it("toasts success after saving a draft", async () => {
    vi.mocked(saveListing).mockResolvedValue({ id: 5, created: true, followUpErrors: [] });
    const spy = vi.spyOn(toast, "success");
    const { result } = renderEditor();
    await act(async () => {
      await result.current.save("draft");
    });
    expect(spy).toHaveBeenCalledWith("Tour saved as a draft.");
  });

  it("toasts the partial-save warning when a follow-up step fails", async () => {
    vi.mocked(saveListing).mockResolvedValue({ id: 5, created: true, followUpErrors: ["Uploading the cover image failed: boom"] });
    const spy = vi.spyOn(toast, "error");
    const { result } = renderEditor();
    await act(async () => {
      await result.current.save("publish");
    });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Uploading the cover image failed: boom"));
  });

  it("toasts the API error when saving fails", async () => {
    vi.mocked(saveListing).mockRejectedValue(new Error("down"));
    const spy = vi.spyOn(toast, "error");
    const { result } = renderEditor();
    await act(async () => {
      await result.current.save("publish");
    });
    expect(spy).toHaveBeenCalledWith("We couldn't save this listing.");
  });
});
