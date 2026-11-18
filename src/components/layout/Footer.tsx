import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import footerLogo from "../../assets/footer_logo.svg";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { useResource } from "@/hooks/useResource";
import { toursApi } from "@/services/api";

const POPULAR_LIMIT = 4;

export function Footer() {
  const settings = usePublicSettings();
  const companyName = settings?.company_name || "Afro Nyanka Tours";
  const { data: tours } = useResource(() => toursApi.list(), []);
  const popularTours = [...(tours ?? [])]
    .sort((a, b) => Number(Boolean(b.is_popular)) - Number(Boolean(a.is_popular)))
    .slice(0, POPULAR_LIMIT);

  return (
    <footer className="py-5 md:py-10 lg:py-24 border-t border-[#E6E6E6] text-[#6E7070] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-baseline">
          {/* Company Info - Left Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <img src={settings?.logo_url || footerLogo} alt={companyName} className="max-h-[95px] w-auto" />
            </div>
            <p className="mb-6 leading-relaxed text-sm lg:text-base poppins-regular">
              Discover the authentic beauty of Africa with our expert guided
              tours and personalized experiences.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/share/17526YsqjL/?mibextid=wwXIfr"
                target="_blank"
                className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#FFA75D] hover:bg-orange-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 lg:h-5 lg:w-5" />
              </a>
              <a
                href="https://www.instagram.com/afronyankatours?igsh=MWZsbmxoemR0YzNjcg=="
                target="_blank"
                className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#FFA75D] hover:bg-orange-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 lg:h-5 lg:w-5" />
              </a>
            </div>
          </div>
          {popularTours.length > 0 && (
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-[#482B11] mb-4 lg:mb-6 poppins-medium">
                Popular Destinations
              </h3>
              <ul className="space-y-3 lg:space-y-4">
                {popularTours.map((tour) => (
                  <li key={tour.id}>
                    <a
                      href="#attractions"
                      className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                    >
                      {tour.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Services */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-[#482B11] mb-4 lg:mb-6 poppins-medium">
              Services
            </h3>
            <ul className="space-y-3 lg:space-y-4">
              <li>
                <a
                  href="#services"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Charter Flights and Coaches
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Airport Transfer and Accommodation Booking
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Event Planning for Travelers
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Drone and Photography Coverage
                </a>
              </li>
            </ul>
          </div>
          {(settings?.location || settings?.phone || settings?.contact_email) && (
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-[#482B11] mb-4 lg:mb-6 poppins-medium">
                Contact Info
              </h3>
              <div className="space-y-3 lg:space-y-4">
                {settings.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D] mt-0.5 flex-shrink-0" />
                    <span className="text-sm lg:text-base text-gray-600 poppins-regular">
                      {settings.location}
                    </span>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D] flex-shrink-0" />
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                      className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                )}
                {settings.contact_email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D] flex-shrink-0" />
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-sm lg:text-base poppins-regular break-all hover:text-[#FFA75D] transition-colors"
                    >
                      {settings.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-[#E6E6E6] mt-12 lg:mt-16 pt-8 lg:pt-10 text-center">
          <p className="text-sm lg:text-base text-gray-500 poppins-regular">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
