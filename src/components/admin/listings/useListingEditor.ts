import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  resolveStatus,
  validateListing,
  type ListingDraft,
  type ListingKind,
  type PublishIntent,
} from "@/components/admin/listings/listingMapping";
import { saveListing, type ListingApi } from "@/components/admin/listings/saveListing";
import { getErrorMessage } from "@/services/api";
import type { AdminExtra, ListingExtra, PublishStatus } from "@/types/api";

interface UseListingEditorOptions<TInput, TEntity extends { id: number }> {
  kind: ListingKind;
  api: ListingApi<TInput, TEntity>;
  id: number | null;
  draft: ListingDraft;
  existingExtras: ListingExtra[];
  catalog: AdminExtra[];
  minimumCapacity?: number;
  buildInput: (draft: ListingDraft, status: PublishStatus) => TInput;
  listPath: string;
  editPath: (id: number) => string;
  onFollowUpFailure: () => void;
}

export interface ListingEditor {
  submitting: boolean;
  error: string | null;
  galleryFiles: File[];
  removedGalleryImages: string[];
  selectMainImage: (file: File) => void;
  addGalleryFiles: (files: File[]) => void;
  removePendingGallery: (index: number) => void;
  removeExistingGallery: (url: string) => void;
  save: (intent: PublishIntent) => Promise<void>;
}

export function useListingEditor<TInput, TEntity extends { id: number }>(
  options: UseListingEditorOptions<TInput, TEntity>,
): ListingEditor {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);

  const save = async (intent: PublishIntent) => {
    const status = resolveStatus(options.draft, intent);
    const problem = validateListing(options.draft, options.kind, status, options.minimumCapacity);
    if (problem) {
      setError(problem);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const catalogPrices = Object.fromEntries(options.catalog.map((extra) => [extra.id, extra.default_price_ghs]));
      const result = await saveListing({
        api: options.api,
        id: options.id,
        input: options.buildInput(options.draft, status),
        existingExtras: options.existingExtras,
        desiredExtras: options.draft.extras,
        catalogPrices,
        mainImage,
        galleryFiles,
        removedGalleryImages,
      });
      if (result.followUpErrors.length === 0) {
        navigate(options.listPath);
        return;
      }
      setMainImage(null);
      setGalleryFiles([]);
      setRemovedGalleryImages([]);
      if (result.created) {
        navigate(options.editPath(result.id), { replace: true, state: { warnings: result.followUpErrors } });
        return;
      }
      setError(`Saved, but some changes did not apply. ${result.followUpErrors.join(" ")}`);
      options.onFollowUpFailure();
    } catch (reason) {
      setError(getErrorMessage(reason, "We couldn't save this listing."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    galleryFiles,
    removedGalleryImages,
    selectMainImage: setMainImage,
    addGalleryFiles: (files) => setGalleryFiles((current) => [...current, ...files]),
    removePendingGallery: (index) => setGalleryFiles((current) => current.filter((_, position) => position !== index)),
    removeExistingGallery: (url) => setRemovedGalleryImages((current) => [...current, url]),
    save,
  };
}
