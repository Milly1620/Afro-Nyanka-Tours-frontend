import { matchesCountries, mergeLocations } from "@/components/admin/listings/useLocationsForCountries";
import type { Location } from "@/types/api";

const location = (id: number, name: string, country: string, region = ""): Location => ({
  id,
  name,
  description: null,
  country,
  region,
  created_at: "",
});

describe("mergeLocations", () => {
  it("removes duplicates and sorts by country, region and name", () => {
    const merged = mergeLocations(
      [location(2, "Kakum", "Ghana", "Central"), location(1, "Accra Fort", "Ghana", "Accra")],
      [location(2, "Kakum", "Ghana", "Central"), location(3, "Ouidah", "Benin", "Atlantique")],
    );
    expect(merged.map((item) => item.id)).toEqual([3, 1, 2]);
  });
});

describe("matchesCountries", () => {
  it("ignores case and spacing", () => {
    expect(matchesCountries(location(1, "A", "Ghana"), [" ghana "])).toBe(true);
    expect(matchesCountries(location(1, "A", "Togo"), ["Ghana"])).toBe(false);
  });
});
