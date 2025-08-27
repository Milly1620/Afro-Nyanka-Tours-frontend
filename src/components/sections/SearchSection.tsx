import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MapPin,
  Activity as ActivityIcon,
  Calendar,
  Globe,
  MapPinned,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toursApi } from "@/services/api";
import { Tour } from "@/types/api";
import { setSearchData, useAppDispatch } from "@/store";

type SearchState = {
  country: string;
  destinations: string[];
  activities: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export function SearchSection() {
  const [searchData, setLocalSearchData] = useState<SearchState>({
    country: "Country",
    destinations: [],
    activities: [],
    startDate: null,
    endDate: null,
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [toursData, setToursData] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch tours data when country changes
  useEffect(() => {
    if (searchData.country !== "Country") {
      fetchToursData(searchData.country);
      // Reset destinations and activities when country changes
      setLocalSearchData((prev) => ({
        ...prev,
        destinations: [],
        activities: [],
      }));
    }
  }, [searchData.country]);

  // Reset activities when destinations change
  useEffect(() => {
    if (searchData.destinations.length > 0) {
      setLocalSearchData((prev) => ({
        ...prev,
        activities: [],
      }));
    }
  }, [searchData.destinations]);

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const countriesData = await toursApi.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchToursData = async (country: string) => {
    setIsLoading(true);
    try {
      const tours = await toursApi.getToursByCountry(country);
      setToursData(tours);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setToursData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract destinations (tour names) for selected country
  const destinations = useMemo(() => {
    if (searchData.country === "Country") return [];
    return toursData.map((tour) => tour.name);
  }, [toursData, searchData.country]);

  // Extract activities (tour locations) for selected destinations
  const activities = useMemo(() => {
    if (searchData.destinations.length === 0) return [];

    const selectedTours = toursData.filter((tour) =>
      searchData.destinations.includes(tour.name)
    );

    const allActivities = selectedTours.flatMap((tour) =>
      tour.tour_locations.map((tl) => tl.location.name)
    );

    return [...new Set(allActivities)]; // Remove duplicates
  }, [toursData, searchData.destinations]);

  // Helpers
  const toggleFromArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const handleDropdownSelect = (field: keyof SearchState, value: string) => {
    setLocalSearchData((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setLocalSearchData((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));

    // Only close the date picker when both dates are selected
    if (start && end) {
      setIsDatePickerOpen(false);
    }
  };

  const handleBookNow = () => {
    // Store search data in Redux for the booking page
    dispatch(
      setSearchData({
        country: searchData.country !== "Country" ? searchData.country : "",
        destinations: searchData.destinations,
        activities: searchData.activities,
        startDate: searchData.startDate,
        endDate: searchData.endDate,
        toursData: toursData, // Include tour data for mapping
      })
    );

    // Navigate to booking page
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
        className="w-full h-12 lg:h-16 px-4 lg:px-6 bg-transparent flex items-center justify-between cursor-pointer transition-all duration-200 focus:outline-none"
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
          {isLoading && options.length === 0 ? (
            <div className="px-4 py-3 text-xs lg:text-sm text-gray-500">
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-xs lg:text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option}
                onClick={() => handleDropdownSelect(field, option)}
                className="w-full px-4 lg:px-6 py-3 text-left text-xs lg:text-sm text-gray-700 cursor-pointer hover:text-[#FFA75D] transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                {option}
              </button>
            ))
          )}
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
    field: "destinations" | "activities";
    values: string[];
    icon: any;
    options: string[];
    placeholder: string;
  }) => (
    <div className="relative flex-1">
      <button
        onClick={() => setOpenDropdown(openDropdown === field ? null : field)}
        className="w-full h-12 lg:h-16 px-4 lg:px-6 bg-transparent flex items-center justify-between cursor-pointer transition-all duration-200 focus:outline-none"
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
          {isLoading ? (
            <div className="px-4 py-3 text-xs lg:text-sm text-gray-500">
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-xs lg:text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option) => {
              const checked = values.includes(option);
              return (
                <button
                  key={option}
                  onClick={() =>
                    setLocalSearchData((prev) => ({
                      ...prev,
                      [field]: toggleFromArray(prev[field], option),
                      ...(field === "destinations"
                        ? { activities: [] } // clear activities when destinations change
                        : {}),
                    }))
                  }
                  className="w-full px-4 lg:px-6 py-3 text-left text-xs lg:text-sm text-gray-700 cursor-pointer transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
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
                    className={`${
                      checked ? "text-[#482B11]" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  // Date range picker field
  const DateRangeField = () => (
    <div className="relative flex-1">
      <div className="w-full h-12 lg:h-16 px-4 lg:px-6 bg-transparent flex items-center space-x-2 lg:space-x-3 cursor-pointer transition-all duration-200">
        <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-[#FFA75D] flex-shrink-0" />
        <DatePicker
          selected={searchData.startDate}
          onChange={handleDateChange}
          startDate={searchData.startDate}
          endDate={searchData.endDate}
          selectsRange
          placeholderText="Select dates"
          dateFormat="MMM dd, yyyy"
          minDate={new Date()}
          open={isDatePickerOpen}
          onInputClick={() => setIsDatePickerOpen(true)}
          onClickOutside={() => setIsDatePickerOpen(false)}
          className="flex-1 bg-transparent text-xs lg:text-sm font-medium text-gray-600 focus:outline-none cursor-pointer"
          wrapperClassName="flex-1"
          popperClassName="z-[1002]"
          popperPlacement="bottom-start"
          showPopperArrow={false}
          customInput={
            <div className="flex-1 text-left flex items-center justify-between">
              <span className="text-xs lg:text-sm font-medium text-gray-600">
                {searchData.startDate && searchData.endDate
                  ? `${searchData.startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                    })} - ${searchData.endDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                    })}`
                  : "Select dates"}
              </span>
              {isDatePickerOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDatePickerOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          }
        />
      </div>
    </div>
  );

  return (
    <section className="relative mt-5 md:10 lg:mt-[204.73px] z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main bordered container */}
        <div className="bg-white border-2 border-[#FFA75D] rounded-2xl lg:rounded-3xl relative">
          <div className="flex flex-col md:flex-row items-center justify-center">
            {/* Country */}
            <DropdownField
              field="country"
              value={searchData.country}
              icon={Globe}
              options={countries}
              placeholder="Country"
            />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Destinations (Multi) */}
            <MultiSelectField
              field="destinations"
              values={searchData.destinations}
              icon={MapPinned}
              options={destinations}
              placeholder="Destination(s)"
            />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Activities (Multi) */}
            <MultiSelectField
              field="activities"
              values={searchData.activities}
              icon={ActivityIcon}
              options={activities}
              placeholder="Activity(ies)"
            />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Date Range Picker */}
            <DateRangeField />

            <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>

            {/* Book Now Button */}
            <div className="flex items-center justify-center p-4 lg:px-4">
              <Button
                onClick={handleBookNow}
                className="w-full cursor-pointer lg:w-auto h-10 lg:h-10 px-6 lg:px-8 bg-[#FFA75D] hover:bg-[#FF9A4D] text-white rounded-full font-semibold text-sm lg:text-base transition-all duration-200 shadow-none border-0"
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
