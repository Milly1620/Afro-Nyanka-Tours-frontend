import { HeroSection } from "../sections/HeroSection";
import { SearchSection } from "../sections/SearchSection";
import { AdventureSection } from "../sections/AdventureSection";
import { AttractionsSection } from "../sections/AttractionsSection";
import { UpcomingEventBanner } from "../sections/UpcomingEventBanner";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { ServicesSection } from "../sections/ServicesSection";
import { AboutSection } from "../sections/AboutSection";
import { ContactSection } from "../sections/ContactSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <UpcomingEventBanner />
      <AdventureSection />
      <AttractionsSection />
      <ServicesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
