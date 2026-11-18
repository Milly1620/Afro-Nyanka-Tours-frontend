import { afterEach, describe, expect, it } from "vitest";
import { holdDraft, peekHeldDraft, releaseHeldDraft } from "@/lib/draftHold";

const files = { mainImage: null, galleryFiles: [], removedGalleryImages: ["a"] };

describe("draftHold", () => {
  afterEach(() => releaseHeldDraft("event"));

  it("returns nothing when no draft is held", () => {
    expect(peekHeldDraft("event")).toBeNull();
  });

  it("keeps the held files until released", () => {
    holdDraft("event", files);
    expect(peekHeldDraft("event")).toBe(files);
    expect(peekHeldDraft("event")).toBe(files);
    releaseHeldDraft("event");
    expect(peekHeldDraft("event")).toBeNull();
  });

  it("holds tours and events separately", () => {
    holdDraft("event", files);
    expect(peekHeldDraft("tour")).toBeNull();
  });
});
