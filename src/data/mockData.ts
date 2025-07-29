import { TourDestination, Attraction, Service } from "@/types";

export const mockDestinations: TourDestination[] = [
  {
    id: "1",
    name: "Ghana",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    slug: "ghana",
  },
  {
    id: "2",
    name: "Germany",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop",
    slug: "germany",
  },
  {
    id: "3",
    name: "Guinea",
    image:
      "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop",
    slug: "guinea",
  },
  {
    id: "4",
    name: "Rwanda",
    image:
      "https://images.unsplash.com/photo-1585487584312-01cde00e5c1a?w=400&h=300&fit=crop",
    slug: "rwanda",
  },
  {
    id: "5",
    name: "Algeria",
    image:
      "https://images.unsplash.com/photo-1539593395743-7da5ee10ff07?w=400&h=300&fit=crop",
    slug: "algeria",
  },
];

export const mockAttractions: Attraction[] = [
  {
    id: "1",
    title: "Cape Coast Castle",
    location: "Ghana",
    price: 600,
    currency: "$",
    rating: 4.8,
    reviewCount: 245,
    image:
      "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop",
    category: "Ghana",
    slug: "cape-coast-castle",
  },
  {
    id: "2",
    title: "Elmina Castle Heritage",
    location: "Ghana",
    price: 450,
    currency: "$",
    rating: 4.6,
    reviewCount: 189,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    category: "Ghana",
    slug: "elmina-castle",
  },
  {
    id: "3",
    title: "Yamoussoukro Mosque",
    location: "Cote d'Ivoire",
    price: 250,
    currency: "$",
    rating: 4.5,
    reviewCount: 167,
    image:
      "https://images.unsplash.com/photo-1585487584312-01cde00e5c1a?w=400&h=300&fit=crop",
    category: "Cote d'Ivoire",
    slug: "yamoussoukro-mosque",
  },
  {
    id: "4",
    title: "Djenné Manuscript",
    location: "Burkina Faso",
    price: 55,
    currency: "$",
    rating: 4.3,
    reviewCount: 98,
    image:
      "https://images.unsplash.com/photo-1539593395743-7da5ee10ff07?w=400&h=300&fit=crop",
    category: "Burkina Faso",
    slug: "djenne-manuscript",
  },
];

export const mockServices: Service[] = [
  {
    id: "1",
    title: "Custom Itinerary Planning",
    description:
      "We handcraft every experience based on your preferences, timeline, and interests to ensure your African adventure is uniquely yours.",
    image:
      "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=800&h=600&fit=crop",
    features: [
      "Personalized trip planning",
      "Expert destination advice",
      "Flexible scheduling",
      "Cultural immersion focus",
    ],
    ctaText: "Learn More",
    ctaLink: "/services/custom-planning",
  },
  {
    id: "2",
    title: "Premium Vehicle Rental",
    description:
      "Travel in comfort and safety with our premium fleet of well-maintained vehicles, complete with experienced local drivers.",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    features: [
      "Premium fleet vehicles",
      "Professional drivers",
      "24/7 roadside assistance",
      "Comprehensive insurance",
    ],
    ctaText: "View Fleet",
    ctaLink: "/services/vehicle-rental",
  },
  {
    id: "3",
    title: "Expert Tour Guiding",
    description:
      "Our passionate local guides bring destinations to life with their deep cultural knowledge, historical insights, and authentic connections.",
    image:
      "https://images.unsplash.com/photo-1585487584312-01cde00e5c1a?w=800&h=600&fit=crop",
    features: [
      "Certified local guides",
      "Cultural expertise",
      "Historical knowledge",
      "Language support",
    ],
    ctaText: "Learn More",
    ctaLink: "/services/tour-guiding",
  },
];
