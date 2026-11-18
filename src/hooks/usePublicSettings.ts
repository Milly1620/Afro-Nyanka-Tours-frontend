import { useEffect, useState } from "react";
import { settingsApi } from "@/services/api";
import type { PublicSettings } from "@/types/api";

let pending: Promise<PublicSettings | null> | null = null;

function loadPublicSettings(): Promise<PublicSettings | null> {
  if (!pending) {
    pending = settingsApi.getPublic().catch((error: unknown) => {
      console.error("Error fetching public settings:", error);
      pending = null;
      return null;
    });
  }
  return pending;
}

export function resetPublicSettingsCache(): void {
  pending = null;
}

export function usePublicSettings(): PublicSettings | null {
  const [settings, setSettings] = useState<PublicSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPublicSettings().then((result) => {
      if (!cancelled) setSettings(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
