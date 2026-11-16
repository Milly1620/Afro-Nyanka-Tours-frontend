import { saveListing, type ListingApi } from "@/components/admin/listings/saveListing";

interface Input {
  name: string;
}

interface Entity {
  id: number;
}

function fakeApi(overrides: Partial<ListingApi<Input, Entity>> = {}): ListingApi<Input, Entity> {
  return {
    create: vi.fn().mockResolvedValue({ id: 9 }),
    update: vi.fn().mockResolvedValue({ id: 4 }),
    attachExtra: vi.fn().mockResolvedValue(undefined),
    detachExtra: vi.fn().mockResolvedValue(undefined),
    uploadMainImage: vi.fn().mockResolvedValue(undefined),
    uploadGalleryImages: vi.fn().mockResolvedValue(undefined),
    removeGalleryImage: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

const baseOptions = {
  input: { name: "Tour" },
  existingExtras: [],
  desiredExtras: [],
  catalogPrices: {},
  mainImage: null,
  galleryFiles: [],
  removedGalleryImages: [],
};

describe("saveListing", () => {
  it("creates a new listing and reports its id", async () => {
    const api = fakeApi();
    const result = await saveListing({ ...baseOptions, api, id: null });
    expect(api.create).toHaveBeenCalledWith({ name: "Tour" });
    expect(api.update).not.toHaveBeenCalled();
    expect(result).toEqual({ id: 9, created: true, followUpErrors: [] });
  });

  it("updates an existing listing", async () => {
    const api = fakeApi();
    const result = await saveListing({ ...baseOptions, api, id: 4 });
    expect(api.update).toHaveBeenCalledWith(4, { name: "Tour" });
    expect(result.created).toBe(false);
  });

  it("uploads images only after the listing exists", async () => {
    const order: string[] = [];
    const api = fakeApi({
      create: vi.fn().mockImplementation(async () => {
        order.push("create");
        return { id: 9 };
      }),
      uploadMainImage: vi.fn().mockImplementation(async () => {
        order.push("main");
      }),
      uploadGalleryImages: vi.fn().mockImplementation(async () => {
        order.push("gallery");
      }),
    });
    const file = new File(["x"], "a.png");
    await saveListing({ ...baseOptions, api, id: null, mainImage: file, galleryFiles: [file] });
    expect(order).toEqual(["create", "main", "gallery"]);
    expect(api.uploadMainImage).toHaveBeenCalledWith(9, file);
  });

  it("attaches, re-prices, detaches extras and removes gallery images", async () => {
    const api = fakeApi();
    await saveListing({
      ...baseOptions,
      api,
      id: 4,
      existingExtras: [
        { extra_id: 1, name: "A", description: null, price_ghs: 50 },
        { extra_id: 2, name: "B", description: null, price_ghs: 100 },
      ],
      desiredExtras: [
        { extraId: 2, price: "120" },
        { extraId: 3, price: "" },
      ],
      catalogPrices: { 3: 80 },
      removedGalleryImages: ["https://cdn.example/g1.jpg"],
    });
    expect(api.detachExtra).toHaveBeenCalledWith(4, 1);
    expect(api.attachExtra).toHaveBeenCalledWith(4, 2, 120);
    expect(api.attachExtra).toHaveBeenCalledWith(4, 3, undefined);
    expect(api.removeGalleryImage).toHaveBeenCalledWith(4, "https://cdn.example/g1.jpg");
  });

  it("collects follow-up failures instead of throwing", async () => {
    const api = fakeApi({ uploadMainImage: vi.fn().mockRejectedValue(new Error("boom")) });
    const result = await saveListing({
      ...baseOptions,
      api,
      id: null,
      mainImage: new File(["x"], "a.png"),
    });
    expect(result.id).toBe(9);
    expect(result.followUpErrors).toHaveLength(1);
    expect(result.followUpErrors[0]).toContain("Uploading the cover image failed");
  });

  it("propagates a failed create", async () => {
    const api = fakeApi({ create: vi.fn().mockRejectedValue(new Error("422")) });
    await expect(saveListing({ ...baseOptions, api, id: null })).rejects.toThrow("422");
  });
});
