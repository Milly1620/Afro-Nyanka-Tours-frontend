import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Phone, Calendar, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSvg from "../../assets/footer_logo.svg";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/", active: location.pathname === "/" },
    { name: "Services", href: "#services", active: false },
    { name: "Tours", href: "#attractions", active: false },
    { name: "About us", href: "#about", active: false },
    { name: "Contact us", href: "#contact", active: false },
    { name: "Book a tour", active: false },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      // Handle anchor links (scroll to section)
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Handle route navigation
      navigate(href);
    }
    setIsMenuOpen(false);
  };

  const handleBookTour = () => {
    navigate("/booking");
    setIsMenuOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 pt-[31px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center space-x-3">
              <img
                src={logoSvg}
                alt="African Tourist Logo"
                className="filter"
              />
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex gap-x-4">
            <div className="bg-white rounded-[799.2px] px-6 py-2 flex items-center">
              <div className="flex items-center space-x-4">
                {navItems.slice(0, 4).map((item) => (
                  <Button
                    key={item.name}
                    onClick={() => handleNavigation(item?.href || "")}
                    className={`px-4 py-2 rounded-full cursor-pointer text-[18px] ${
                      item.active
                        ? "bg-[#FFA75D] poppins-semibold text-[#482B11] hover:bg-[#FFA75D]"
                        : "bg-[#F5F5F573] poppins-regular text-[#6E7070] hover:bg-[#efeded73]"
                    }
                    `}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[799.2px] px-6 py-2 flex items-center">
              <div className="flex items-center space-x-4">
                {navItems.slice(4, 6).map((item) => (
                  <Button
                    key={item.name}
                    onClick={() =>
                      item.name === "Book a tour"
                        ? handleBookTour()
                        : handleNavigation(item?.href || "")
                    }
                    className={`flex items-center cursor-pointer px-4 py-2 rounded-full text-[18px] ${
                      item.active
                        ? "bg-[#FFA75D] poppins-semibold text-[#482B11] hover:bg-[#FFA75D]"
                        : "bg-[#F5F5F573] poppins-regular text-[#6E7070] hover:bg-[#efeded73]"
                    }`}
                  >
                    {item.name === "Book a tour" ? (
                      <Phone className="h-4 w-4 mr-2.5" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2.5" />
                    )}
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </nav>
          <div className=" hidden lg:flex"></div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-lg bg-white/20 backdrop-blur-md"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() =>
                    item.name === "Book a tour"
                      ? handleBookTour()
                      : handleNavigation(item?.href || "")
                  }
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 poppins-medium ${
                    item.active
                      ? "bg-[#FFA75D] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-orange-200 text-[#FFA75D] hover:bg-orange-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact us
                </Button>
                <Button
                  onClick={handleBookTour}
                  className="w-full bg-[#FFA75D] hover:bg-[#FFA75D] text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a tour
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
