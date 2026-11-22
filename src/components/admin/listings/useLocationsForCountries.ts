import { useMemo } from "react";
import { useResource, type Resource } from "@/hooks/useResource";
import { adminLocationsApi } from "@/services/adminApi";
import type { Location } from "@/types/api";

export function sortLocations(locations: Location[]): Location[] {
  return [...locations].sort(
    (a, b) =>
      a.country.localeCompare(b.country) ||
      (a.region ?? "").localeCompare(b.region ?? "") ||
      a.name.localeCompare(b.name),
  );
}

export function mergeLocations(...lists: Location[][]): Location[] {
  const byId = new Map<number, Location>();
  lists.flat().forEach((location) => byId.set(location.id, location));
  return sortLocations([...byId.values()]);
}

export function matchesCountries(location: Location, countries: string[]): boolean {
  const country = location.country.trim().toLowerCase();
  return countries.some((wanted) => wanted.trim().toLowerCase() === country);
}

interface CountryLocations {
  key: string;
  list: Location[];
}

export interface LocationsForCountries {
  locations: Location[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  settled: boolean;
}

export function useLocationsForCountries(countries: string[], created: Location[]): LocationsForCountries {
  const key = countries.map((country) => country.trim().toLowerCase()).filter(Boolean).join("|");
  const resource: Resource<CountryLocations> = useResource(async () => {
    const wanted = countries.map((country) => country.trim()).filter(Boolean);
    const lists = await Promise.all(wanted.map((country) => adminLocationsApi.listByCountry(country)));
    return { key, list: mergeLocations(...lists) };
  }, [key]);

  const locations = useMemo(
    () => mergeLocations(resource.data?.list ?? [], created.filter((location) => matchesCountries(location, countries))),
    [resource.data, created, key],
  );

  const settled = !resource.loading && !resource.error && resource.data?.key === key;

  return { locations, loading: resource.loading, error: resource.error, reload: resource.reload, settled };
}
