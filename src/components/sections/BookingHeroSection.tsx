import heromain from "../../assets/heromain.svg";
import frame1 from "../../assets/adinkrawhite.svg";
import frame2 from "../../assets/agyindawuruwhite.svg";
import frame3 from "../../assets/nyamewhite.svg";
import frame4 from "../../assets/spiralwhite.svg";
import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BookingHeroSection() {

      const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        country: "",
        destination: "Select destination",
        date: "",
        additionalServices: "",
      });

      const [openDropdown, setOpenDropdown] = useState<string | null>(null);

      const destinations = [
        "Accra City Tours",
        "Cape Coast Heritage",
        "Kumasi Cultural Experience",
        "Tamale Northern Adventures",
        "Volta Region Nature",
        "Western Region Beaches",
      ];

      const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      };

      const handleDropdownSelect = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setOpenDropdown(null);
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Booking form data:", formData);
        // Handle form submission
      };

      
  return (
    <section className="h-[400px] lg:h-[450px] flex flex-col justify-center overflow-hidden">
      {/* Main Background */}
      <div
        className="absolute z-[-1] inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${heromain})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute z-[-1] inset-0 bg-black/50" />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-white">
        <div className="md:flex items-center justify-between mb-6 lg:w-[1204px]">
          <img src={frame1} alt="frame1" className="hidden md:block" />
          <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-center">
            Book Your African Adventure
          </h2>
          <img src={frame2} alt="frame2" className="hidden md:block" />
        </div>
        <div className="flex items-center gap-[35.75px]">
          <img src={frame3} alt="frame3" className="hidden md:block" />
          <p className="lg:w-[776px] text-sm md:text-base lg:text-lg leading-relaxed poppins-regular text-center">
            Reserve your spot for an unforgettable journey through the heart of
            Africa
          </p>
          <img src={frame4} alt="frame4" className="hidden md:block" />
        </div>
      </div>

        <div className="absolute top-[352px] left-0 right-0 z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full h-12 border-gray-300 focus:border-[#FFA75D] focus:ring-[#FFA75D] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-12 border-gray-300 focus:border-[#FFA75D] focus:ring-[#FFA75D] rounded-lg"
                  />
                </div>
              </div>

              {/* Age and Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full h-12 border-gray-300 focus:border-[#FFA75D] focus:ring-[#FFA75D] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country of origin
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter subject"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="w-full h-12 border-gray-300 focus:border-[#FFA75D] focus:ring-[#FFA75D] rounded-lg"
                  />
                </div>
              </div>

              {/* Destination and Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "destination" ? null : "destination"
                      )
                    }
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-[#FFA75D] focus:ring-2 focus:ring-orange-100"
                  >
                    <span
                      className={`text-sm ${
                        formData.destination === "Select destination"
                          ? "text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {formData.destination}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        openDropdown === "destination" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === "destination" && (
                    <div className="absolute top-20 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {destinations.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            handleDropdownSelect("destination", option)
                          }
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FFA75D] transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred date
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      placeholder="dd/mm/yyyy"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="w-full h-12 border-gray-300 focus:border-[#FFA75D] focus:ring-[#FFA75D] rounded-lg pr-12"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional services
                </label>
                <textarea
                  rows={6}
                  placeholder="Write your message"
                  value={formData.additionalServices}
                  onChange={(e) =>
                    handleInputChange("additionalServices", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#FFA75D] focus:ring-[#FFA75D] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#FFA75D] hover:bg-[#FFA75D] text-white px-8 py-3 rounded-xl font-semibold text-base transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book now
                </Button>
              </div>
            </form>
          </div>
        </div>

      {/* Close dropdown overlay */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </section>
  );
}
