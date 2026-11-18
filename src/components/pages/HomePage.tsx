import { HeroSection } from "../sections/HeroSection";
import { SearchSection } from "../sections/SearchSection";
import { AdventureSection } from "../sections/AdventureSection";
import { AttractionsSection } from "../sections/AttractionsSection";
import { ServicesSection } from "../sections/ServicesSection";
import { AboutSection } from "../sections/AboutSection";
import { ContactSection } from "../sections/ContactSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <AdventureSection />
      <AttractionsSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
