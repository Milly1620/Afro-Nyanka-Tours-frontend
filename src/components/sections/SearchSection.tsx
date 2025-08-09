import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Activity as ActivityIcon,
  Clock,
  Globe,
  Landmark,
  MapPinned,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SearchState = {
  country: string;
  provinces: string[];
  destinations: string[];
  activity: string;
  duration: string;
};

export function SearchSection() {
  const [searchData, setSearchData] = useState<SearchState>({
    country: "Country",
    provinces: [],
    destinations: [],
    activity: "Activity",
    duration: "0 Days - 6 Days",
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mock API-backed dictionaries (replace with fetched data later)
  const countries = ["Ghana", "Côte d'Ivoire", "Togo", "Burkina Faso"];
  const provincesByCountry: Record<string, string[]> = {
    Ghana: [
      "Greater Accra",
      "Ashanti",
      "Central",
      "Western",
      "Volta",
      "Northern",
    ],
    "Côte d'Ivoire": ["Abidjan", "Yamoussoukro", "Bouaké"],
    Togo: ["Maritime", "Plateaux", "Centrale", "Kara"],
    "Burkina Faso": ["Centre", "Hauts-Bassins", "Boucle du Mouhoun"],
  };
  const destinationsByProvince: Record<string, string[]> = {
    "Greater Accra": ["Accra City", "Jamestown", "Osu Castle"],
    Ashanti: ["Kumasi", "Manhyia Palace"],
    Central: ["Cape Coast Castle", "Elmina"],
    Western: ["Takoradi", "Axim Beach"],
    Volta: ["Wli Falls", "Ho"],
    Northern: ["Mole Park", "Tamale"],
    Abidjan: ["Plateau", "Cocody"],
    Yamoussoukro: ["Basilica", "Crocodile Lake"],
    Bouaké: ["Markets", "Textiles"],
    Maritime: ["Lomé", "Aného"],
    Plateaux: ["Kpalimé", "Mount Agou"],
    Centrale: ["Sokodé"],
    Kara: ["Kara City", "Koutammakou"],
    Centre: ["Ouagadougou"],
    "Hauts-Bassins": ["Bobo-Dioulasso"],
    "Boucle du Mouhoun": ["Dédougou"],
  };

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

  const availableProvinces = useMemo(() => {
    return provincesByCountry[searchData.country] || [];
  }, [searchData.country]);

  const availableDestinations = useMemo(() => {
    // Aggregate destinations for all selected provinces
    const set = new Set<string>();
    searchData.provinces.forEach((p) => {
      (destinationsByProvince[p] || []).forEach((d) => set.add(d));
    });
    return Array.from(set);
  }, [searchData.provinces]);

  // Helpers
  const toggleFromArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const handleDropdownSelect = (field: keyof SearchState, value: string) => {
    if (field === "country") {
      setSearchData((prev) => ({
        ...prev,
        country: value,
        provinces: [],
        destinations: [],
      }));
      setOpenDropdown(null);
      return;
    }
    if (field === "activity" || field === "duration") {
      setSearchData((prev) => ({ ...prev, [field]: value }));
      setOpenDropdown(null);
    }
  };

  const handleBookNow = () => {
    // Example payload ready for API
    const payload = {
      country: searchData.country !== "Country" ? searchData.country : null,
      provinces: searchData.provinces,
      destinations: searchData.destinations,
      activity: searchData.activity !== "Activity" ? searchData.activity : null,
      duration: searchData.duration,
    };
    console.log("Search payload:", payload);
    navigate("/booking");
  };

  // Single select dropdown
  const DropdownField = ({
    field,
    value,
    icon: Icon,
    options,
    placeholder,
  }: {
    field: keyof SearchState;
    value: string;
    icon: any;
    options: string[];
    placeholder: string;
  }) => (
    <div className="relative flex-1">
      <button
        onClick={() =>
          setOpenDropdown(openDropdown === String(field) ? null : String(field))
        }
        className="w-full h-12 lg:h-16 px-4 lg:px-6 bg-transparent flex items-center justify-between hover:bg-gray-50 transition-all duration-200 focus:outline-none"
      >
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D]" />
          <span className="text-xs lg:text-sm font-medium text-gray-600 truncate">
            {value || placeholder}
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
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleDropdownSelect(field, option)}
              className="w-full px-4 lg:px-6 py-3 text-left text-xs lg:text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FFA75D] transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Multi-select dropdown with checkboxes
  const MultiSelectField = ({
    field,
    values,
    icon: Icon,
    options,
    placeholder,
  }: {
    field: "provinces" | "destinations";
    values: string[];
    icon: any;
    options: string[];
    placeholder: string;
  }) => (
    <div className="relative flex-1">
      <button
        onClick={() => setOpenDropdown(openDropdown === field ? null : field)}
        className="w-full h-12 lg:h-16 px-4 lg:px-6 bg-transparent flex items-center justify-between hover:bg-gray-50 transition-all duration-200 focus:outline-none"
      >
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D]" />
          <span className="text-xs lg:text-sm font-medium text-gray-600 truncate">
            {values.length > 0 ? `${values.length} selected` : placeholder}
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
          {options.length === 0 && (
            <div className="px-4 py-3 text-xs lg:text-sm text-gray-500">
              No options
            </div>
          )}
          {options.map((option) => {
            const checked = values.includes(option);
            return (
              <button
                key={option}
                onClick={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    [field]: toggleFromArray(prev[field], option),
                    ...(field === "provinces"
                      ? { destinations: [] } // clear destinations when provinces change
                      : {}),
                  }))
                }
                className="w-full px-4 lg:px-6 py-3 text-left text-xs lg:text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                    checked
                      ? "bg-[#FFA75D] border-[#FFA75D]"
                      : "border-gray-300"
                  }`}
                >
                  {checked && <Check className="h-3 w-3 text-white" />}
                </span>
                <span
                  className={`${checked ? "text-[#482B11]" : "text-gray-700"}`}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section className="relative mt-5 md:10 lg:mt-[204.73px] z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main bordered container */}
        <div className="bg-white border-2 border-[#FFA75D] rounded-2xl lg:rounded-3xl relative">
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Country */}
            <DropdownField
              field="country"
              value={searchData.country}
              icon={Globe}
              options={countries}
              placeholder="Country"
            />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Province (Multi) */}
            <MultiSelectField
              field="provinces"
              values={searchData.provinces}
              icon={Landmark}
              options={availableProvinces}
              placeholder="Province(s)"
            />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Destination (Multi) */}
            <MultiSelectField
              field="destinations"
              values={searchData.destinations}
              icon={MapPinned}
              options={availableDestinations}
              placeholder="Destination(s)"
            />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Activity */}
            <DropdownField
              field="activity"
              value={searchData.activity}
              icon={ActivityIcon}
              options={activities}
              placeholder="Activity"
            />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Duration */}
            <DropdownField
              field="duration"
              value={searchData.duration}
              icon={Clock}
              options={durations}
              placeholder="Duration"
            />

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
          className="fixed inset-0 z-[900]" // behind dropdowns (1001)
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </section>
  );
}
