import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Activity, Clock, DollarSign, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchSection() {
  const [searchData, setSearchData] = useState({
    destination: "Destination",
    activity: "Activity",
    duration: "0 Days - 6 Days",
    price: "2000 GHS - 8000 GHS",
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const destinations = [
    "Accra",
    "Kumasi",
    "Cape Coast",
    "Tamale",
    "Takoradi",
    "Ho",
    "Koforidua",
  ];

  const activities = [
    "Wildlife Safari",
    "Cultural Tours",
    "Beach Activities",
    "Adventure Sports",
    "Historical Sites",
    "Nature Walks",
    "Photography Tours",
  ];

  const durations = [
    "1 Day",
    "2-3 Days",
    "4-6 Days",
    "0 Days - 6 Days",
    "1 Week",
    "2 Weeks",
    "1 Month+",
  ];

  const priceRanges = [
    "500 GHS - 1500 GHS",
    "1500 GHS - 3000 GHS",
    "2000 GHS - 8000 GHS",
    "3000 GHS - 5000 GHS",
    "5000 GHS - 8000 GHS",
    "8000 GHS - 12000 GHS",
    "12000 GHS+",
  ];

  const handleDropdownSelect = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const handleBookNow = () => {
    console.log("Search data:", searchData);
    navigate("/booking");
  };

  const DropdownField = ({
    field,
    value,
    icon: Icon,
    options,
  }: {
    field: string;
    value: string;
    icon: any;
    options: string[];
  }) => (
    <div className="relative flex-1">
      <button
        onClick={() => setOpenDropdown(openDropdown === field ? null : field)}
        className="w-full h-12 lg:h-16 px-4 lg:px-6 bg-transparent flex items-center justify-between hover:bg-gray-50 transition-all duration-200 focus:outline-none"
      >
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D]" />
          <span className="text-xs lg:text-sm font-medium text-gray-600 truncate">
            {value}
          </span>
        </div>
        <ChevronDown
          className={`h-3 w-3 lg:h-4 lg:w-4 text-gray-400 transition-transform duration-200 ${
            openDropdown === field ? "rotate-180" : ""
          }`}
        />
      </button>

      {openDropdown === field && (
        <div className="absolute top-12 lg:top-16 left-0 right-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[1001] max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleDropdownSelect(field, option)}
              className="w-full px-4 lg:px-6 py-3 text-left text-xs lg:text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FFA75D] transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="relative mt-5 md:10 lg:mt-[204.73px] z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main bordered container - removed overflow-hidden */}
        <div className="bg-white border-2 border-[#FFA75D] rounded-2xl lg:rounded-3xl relative">
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Search Fields Container */}
            <div className="flex flex-col md:flex-row items-center flex-1">
              {/* Destination */}
              <DropdownField
                field="destination"
                value={searchData.destination}
                icon={MapPin}
                options={destinations}
              />

              {/* Separator */}
              <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

              {/* Activity */}
              <DropdownField
                field="activity"
                value={searchData.activity}
                icon={Activity}
                options={activities}
              />

              {/* Separator */}
              <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

              {/* Duration */}
              <DropdownField
                field="duration"
                value={searchData.duration}
                icon={Clock}
                options={durations}
              />

              {/* Separator */}
              <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

              {/* Price */}
              <DropdownField
                field="price"
                value={searchData.price}
                icon={DollarSign}
                options={priceRanges}
              />
            </div>

            {/* Separator */}
            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Book Now Button */}
            <div className="flex items-center justify-center p-4 lg:px-4">
              <Button
                onClick={handleBookNow}
                className="w-full lg:w-auto h-10 lg:h-10 px-6 lg:px-8 bg-[#FFA75D] hover:bg-[#FF9A4D] text-white rounded-full font-semibold text-sm lg:text-base transition-all duration-200 shadow-none border-0"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-[1000]"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </section>
  );
}
