import beninImage from "@/assets/benin.jpeg";
import togoImage from "@/assets/togo.jpeg";
import burkinaImage from "@/assets/burkina.jpeg";
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

const BURKINA_FASO_PLACES = [
  "Independence Monument",
  "Thomas Sankara Mausoleum",
  "Ouagadougou National Museum",
  "Ouagadougou Cathedral",
  "Woko Grand Marché",
];

export const FALLBACK_TOURS: Record<string, Tour[]> = {
  Benin: [
    buildTour(-1, "Cotonou City Tour", "Benin", beninImage, BENIN_PLACES),
  ],
  Togo: [
    buildTour(-2, "Lomé City Tour", "Togo", togoImage, TOGO_PLACES),
  ],
  "Burkina Faso": [
    buildTour(
      -3,
      "Ouagadougou City Tour",
      "Burkina Faso",
      burkinaImage,
      BURKINA_FASO_PLACES
    ),
  ],
};

export const getFallbackTours = (country: string): Tour[] =>
  FALLBACK_TOURS[country] ?? [];
