import beninImage from "@/assets/benin.jpeg";
import togoImage from "@/assets/togo.jpeg";
import type { Tour, TourLocation } from "@/types/api";

const CREATED_AT = "2026-09-25T00:00:00Z";

const buildLocations = (
  tourId: number,
  country: string,
  names: string[]
): TourLocation[] =>
  names.map((name, index) => {
    const id = tourId * 100 + index + 1;
    return {
      id,
      location_id: id,
      order: index + 1,
      location: {
        id,
        name,
        description: null,
        country,
        region: "",
        created_at: CREATED_AT,
      },
    };
  });

const buildTour = (
  id: number,
  name: string,
  country: string,
  image: string,
  locations: string[]
): Tour => ({
  id,
  name,
  description: "",
  country,
  region: "",
  is_active: true,
  created_at: CREATED_AT,
  updated_at: null,
  main_image_url: image,
  tour_locations: buildLocations(id, country, locations),
});

const BENIN_PLACES = [
  "Amazon Statue",
  "Ganvie Stilt Village",
  "Ouidah Python Temple",
  "Ouidah Door of No Return",
  "The Sacred Forest of Kpassè",
];

const TOGO_PLACES = [
  "Palais de Lomé",
  "Lomé Grand Marché",
  "Independence Monument",
  "Akodessewa Fetish Market",
  "Sacred Heart Cathedral",
];

export const FALLBACK_TOURS: Record<string, Tour[]> = {
  Benin: [
    buildTour(-1, "Cotonou City Tour", "Benin", beninImage, BENIN_PLACES),
    ...BENIN_PLACES.map((place, index) =>
      buildTour(-(index + 11), place, "Benin", beninImage, [place])
    ),
  ],
  Togo: [
    buildTour(-2, "Lomé City Tour", "Togo", togoImage, TOGO_PLACES),
    ...TOGO_PLACES.map((place, index) =>
      buildTour(-(index + 21), place, "Togo", togoImage, [place])
    ),
  ],
};

export const getFallbackTours = (country: string): Tour[] =>
  FALLBACK_TOURS[country] ?? [];
