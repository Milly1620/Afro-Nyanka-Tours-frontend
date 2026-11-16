export interface HeldFiles {
  mainImage: File | null;
  galleryFiles: File[];
  removedGalleryImages: string[];
}

export type HeldKind = "tour" | "event";

const held = new Map<HeldKind, HeldFiles>();

export function holdDraft(kind: HeldKind, files: HeldFiles) {
  held.set(kind, files);
}

export function peekHeldDraft(kind: HeldKind): HeldFiles | null {
  return held.get(kind) ?? null;
}

export function releaseHeldDraft(kind: HeldKind) {
  held.delete(kind);
}
