import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import footerLogo from "../../assets/footer_logo.svg";

export function Footer() {
  return (
    <footer className="py-5 md:py-10 lg:py-24 border-t border-[#E6E6E6] text-[#6E7070] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-baseline">
          {/* Company Info - Left Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <img
                src={footerLogo}
                alt="Afro Nyanka Tours"
              />
            </div>
            <p className="mb-6 leading-relaxed text-sm lg:text-base poppins-regular">
              Discover the authentic beauty of West Africa with our expert
              guided tours and personalized experiences.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#FFA75D] hover:bg-orange-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 lg:h-5 lg:w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#FFA75D] hover:bg-orange-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 lg:h-5 lg:w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#FFA75D] hover:bg-orange-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 lg:h-5 lg:w-5" />
              </a>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-[#482B11] mb-4 lg:mb-6 poppins-medium">
              Popular Destinations
            </h3>
            <ul className="space-y-3 lg:space-y-4">
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Ghana City Tours
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Cape Coast Heritage
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Ashanti Culture
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Cote d'Ivoire Adventures
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-[#482B11] mb-4 lg:mb-6 poppins-medium">
              Services
            </h3>
            <ul className="space-y-3 lg:space-y-4">
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Tour Guiding
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Itinerary Planning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Vehicle Rental
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  Chartered Flights
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-[#482B11] mb-4 lg:mb-6 poppins-medium">
              Contact Info
            </h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D] mt-0.5 flex-shrink-0" />
                <span className="text-sm lg:text-base text-gray-600 poppins-regular">
                  Accra, Ghana
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D] flex-shrink-0" />
                <a
                  href="tel:+233241234567"
                  className="text-sm lg:text-base poppins-regular hover:text-[#FFA75D] transition-colors"
                >
                  +233 24 123 4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D] flex-shrink-0" />
                <a
                  href="mailto:info@afronyanka.com"
                  className="text-sm lg:text-base poppins-regular break-all hover:text-[#FFA75D] transition-colors"
                >
                  info@afronyanka.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#E6E6E6] mt-12 lg:mt-16 pt-8 lg:pt-10 text-center">
          <p className="text-sm lg:text-base text-gray-500 poppins-regular">
            © 2024 Afro Nyanka Tours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
