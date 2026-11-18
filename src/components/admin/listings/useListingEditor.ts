import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listingNoun,
  resolveStatus,
  savedMessage,
  validateListing,
  type ListingDraft,
  type ListingKind,
  type PublishIntent,
} from "@/components/admin/listings/listingMapping";
import { saveListing, type ListingApi } from "@/components/admin/listings/saveListing";
import type { HeldFiles } from "@/lib/draftHold";
import { toast } from "@/lib/toast";
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
  heldFiles?: HeldFiles | null;
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
  mainImage: File | null;
  save: (intent: PublishIntent) => Promise<void>;
}

export function useListingEditor<TInput, TEntity extends { id: number }>(
  options: UseListingEditorOptions<TInput, TEntity>,
): ListingEditor {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(options.heldFiles?.mainImage ?? null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>(options.heldFiles?.galleryFiles ?? []);
  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>(options.heldFiles?.removedGalleryImages ?? []);

  const save = async (intent: PublishIntent) => {
    const status = resolveStatus(options.draft, intent);
    const problem = validateListing(options.draft, options.kind, status, options.minimumCapacity);
    if (problem) {
      setError(problem);
      toast.error(problem);
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
        toast.success(savedMessage(options.kind, status, result.created));
        navigate(options.listPath);
        return;
      }
      setMainImage(null);
      setGalleryFiles([]);
      setRemovedGalleryImages([]);
      const warning = `${listingNoun(options.kind)} saved, but some changes did not apply. ${result.followUpErrors.join(" ")}`;
      toast.error(warning);
      if (result.created) {
        navigate(options.editPath(result.id), { replace: true });
        return;
      }
      setError(warning);
      options.onFollowUpFailure();
    } catch (reason) {
      const message = getErrorMessage(reason, "We couldn't save this listing.");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    galleryFiles,
    removedGalleryImages,
    mainImage,
    selectMainImage: setMainImage,
    addGalleryFiles: (files) => setGalleryFiles((current) => [...current, ...files]),
    removePendingGallery: (index) => setGalleryFiles((current) => current.filter((_, position) => position !== index)),
    removeExistingGallery: (url) => setRemovedGalleryImages((current) => [...current, url]),
    save,
  };
}
