export interface TourDestination {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface Attraction {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  slug: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface SearchForm {
  destination: string;
  activity: string;
  dates: string;
  travelTime: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  isButton?: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
