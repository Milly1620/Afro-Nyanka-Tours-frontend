import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import service images
import countrymapImg from "../../assets/countrymap.svg";
import vehicleImg from "../../assets/vehicle.svg";
import flight from "../../assets/flight.webp";
import event from "../../assets/event.webp";
import airport from "../../assets/airport.webp";
import drone from "../../assets/drone.webp";

const ServiceCard = ({ service, className = "" }: ServiceCardProps) => (
  <div
    className={`relative w-full rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-xl ${className}`}
  >
    <div className="absolute inset-0">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
    </div>

    <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-end text-white">
      <h3 className="text-xl lg:text-2xl xl:text-[36px] poppins-medium mb-2 lg:mb-3">
        {service.title}
      </h3>
      <p className="text-sm lg:text-base text-white leading-relaxed mb-6 lg:mb-10 max-w-lg">
        {service.description}
      </p>

      {service.ctaText && (
        <Button className="self-start group poppins-medium bg-transparent border border-white rounded-full hover:bg-white hover:text-[#482B11] transition-all duration-300">
          {service.ctaText}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      )}
    </div>
  </div>
);

export function ServicesSection() {
  return (
    <section id="services" className="py-5 md:py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-[#482B11] mb-4 lg:mb-6">
            Our services
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 poppins-regular max-w-2xl mx-auto">
            Comprehensive travel solutions tailored to your African adventure
          </p>
        </div>

        {/* Services Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-9">
          {/* Left Column - Two services stacked */}
          <div className="flex flex-col gap-6 lg:gap-9">
            {/* Custom Itinerary Planning - Top */}
            <ServiceCard service={services[0]} className="h-64 lg:h-80" />

            {/* Premium Vehicle Rental - Bottom */}
            <ServiceCard service={services[1]} className="h-64 lg:h-80" />
          </div>

          {/* Right Column - Expert Tour Guiding (Full Height) */}
          <div className="flex flex-col gap-6 lg:gap-9">
            <ServiceCard service={services[2]} className="h-64 lg:h-80" />
            <ServiceCard service={services[3]} className="h-64 lg:h-80" />
          </div>
          {/* Custom Itinerary Planning - Top */}

          {/* Premium Vehicle Rental - Bottom */}
          <ServiceCard service={services[4]} className="h-64 lg:h-80" />

          {/* Premium Vehicle Rental - Bottom */}
          <ServiceCard service={services[5]} className="h-64 lg:h-80" />
        </div>
      </div>
    </section>
  );
}

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

const services: Service[] = [
  {
    id: "1",
    title: "Custom Itinerary Planning",
    description:
      "Personalized travel plans crafted to match your interests, budget, and timeline for the perfect African experience.",
    image: countrymapImg,
    ctaText: "Book Now",
    ctaLink: "/services/custom-planning",
  },
  {
    id: "2",
    title: "Charter Flights and Coaches",
    description:
      "Travel in style and comfort with our private charter flights and luxury coaches. Whether it’s a group trip, corporate retreat, or a family getaway, we make sure your journey is as seamless as your destination.",
    image: flight,
  },
  {
    id: "3",
    title: "Expert Tour Guiding",
    description:
      "Our certified local guides bring destinations to life with deep cultural knowledge, historical insights, and authentic storytelling.",
    image: vehicleImg,
  },
  {
    id: "4",
    title: "Event Planning for Travelers",
    description:
      "Turn your trip into an unforgettable experience. From destination weddings to corporate events and adventure retreats, we handle all the details so you can simply enjoy the moment.",
    image: event,
  },
  {
    id: "5",
    title: "Airport Transfer and Accomodation Booking",
    description:
      "Skip the stress of travel logistics. We’ll pick you up right from the airport and secure the perfect accommodation tailored to your style and budget.",
    image: airport,
  },
  {
    id: "6",
    title: "Drone and Photography Coverage",
    description:
      "Capture every magical moment from breathtaking angles. Our professional drone and photography services ensure your travels are remembered in cinematic style.",
    image: drone,
  },
];
