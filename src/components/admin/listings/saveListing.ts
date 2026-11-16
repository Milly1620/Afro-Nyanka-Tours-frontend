import { getErrorMessage } from "@/services/api";
import { diffExtras, type DraftExtra } from "@/components/admin/listings/listingMapping";
import type { ListingExtra } from "@/types/api";

export interface ListingApi<TInput, TEntity extends { id: number }> {
  create: (input: TInput) => Promise<TEntity>;
  update: (id: number, input: Partial<TInput>) => Promise<TEntity>;
  attachExtra: (id: number, extraId: number, priceGhs?: number) => Promise<void>;
  detachExtra: (id: number, extraId: number) => Promise<void>;
  uploadMainImage: (id: number, file: File) => Promise<void>;
  uploadGalleryImages: (id: number, files: File[]) => Promise<void>;
  removeGalleryImage: (id: number, imageUrl: string) => Promise<void>;
}

export interface SaveListingOptions<TInput, TEntity extends { id: number }> {
  api: ListingApi<TInput, TEntity>;
  id: number | null;
  input: TInput;
  existingExtras: ListingExtra[];
  desiredExtras: DraftExtra[];
  catalogPrices: Record<number, number>;
  mainImage: File | null;
  galleryFiles: File[];
  removedGalleryImages: string[];
}

export interface SaveListingResult {
  id: number;
  created: boolean;
  followUpErrors: string[];
}

export async function saveListing<TInput, TEntity extends { id: number }>(
  options: SaveListingOptions<TInput, TEntity>,
): Promise<SaveListingResult> {
  const { api, input } = options;
  const created = options.id === null;
  const saved = created ? await api.create(input) : await api.update(options.id as number, input);
  const id = saved.id;
  const followUpErrors: string[] = [];

  const attempt = async (label: string, task: () => Promise<void>) => {
    try {
      await task();
    } catch (error) {
      followUpErrors.push(`${label}: ${getErrorMessage(error)}`);
    }
  };

  const diff = diffExtras(options.existingExtras, options.desiredExtras, options.catalogPrices);
  for (const extraId of diff.detach) {
    await attempt("Removing an extra failed", () => api.detachExtra(id, extraId));
  }
  for (const attachment of diff.attach) {
    await attempt("Saving an extra failed", () => api.attachExtra(id, attachment.extraId, attachment.price));
  }
  for (const imageUrl of options.removedGalleryImages) {
    await attempt("Removing a gallery image failed", () => api.removeGalleryImage(id, imageUrl));
  }
  if (options.mainImage) {
    const file = options.mainImage;
    await attempt("Uploading the cover image failed", () => api.uploadMainImage(id, file));
  }
  if (options.galleryFiles.length > 0) {
    const files = options.galleryFiles;
    await attempt("Uploading gallery images failed", () => api.uploadGalleryImages(id, files));
  }

  return { id, created, followUpErrors };
}
