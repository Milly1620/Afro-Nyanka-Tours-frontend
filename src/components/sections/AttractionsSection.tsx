import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSearchData, useAppDispatch } from "@/store";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toursApi } from "@/services/api";
import type { Tour } from "@/types/api";


const AttractionCard = ({
  tour,
  onBookNow,
}: {
  tour: Tour;
  onBookNow: (tour: Tour) => void;
}) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="relative overflow-hidden">
      <img
        src={tour.main_image_url}
        alt={tour.name}
        className={`w-full h-48 lg:h-[290px] group-hover:scale-105 transition-transform duration-300 ${
          "object-cover"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <div className="p-6">
      <h3 className="text-sm lg:text-[16.61px] poppins-semibold text-[#0D0D0C] mb-[7.3px] group-hover:text-[#FFA75D] transition-colors poppins-medium">
        {tour.name}
      </h3>

      <div className="flex items-center text-[#6E7070] mb-2">
        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="text-[14.76px] poppins-regular">
          {tour.country}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-[#6E7070] mb-2">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-[14.76px] poppins-regular">
            {`${tour.tour_locations?.length || 0} activities`}
          </span>
        </div>
        <Button
          onClick={() => onBookNow(tour)}
          className="p-3 lg:px-4 lg:py-2  bg-transparent text-[#482B11] hover:text-[#FFA75D] poppins-medium text-sm transition-colors group border border-[#E1E4E5]  hover:bg-transparent cursor-pointer"
        >
          <span className="text-[14.76px] poppins-medium">Book Now</span>
          <ArrowRight className="h-6 w-6 ml-1 text-[#FFA75D] group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  </div>
);

export function AttractionsSection() {
  const [countries, setCountries] = useState<string[]>([]);
  const [activeCountry, setActiveCountry] = useState<string>("Ghana");
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Fetch countries (tabs)
  useEffect(() => {
    (async () => {
      try {
        const c = await toursApi.getCountries();
        const sorted = [...c].sort((a, b) => {
          if (a === "Ghana") return -1;
          if (b === "Ghana") return 1;
          return a.localeCompare(b);
        });
        setCountries(sorted);
        if (sorted.length && !sorted.includes(activeCountry)) {
          setActiveCountry(sorted[0]);
        }
      } catch (e) {
        setCountries(["Ghana"]);
      }
    })();
  }, []);

  // Fetch tours for active country
  useEffect(() => {
    if (!activeCountry) return;
    setIsLoading(true);
    (async () => {
      try {
        const t = await toursApi.getToursByCountry(activeCountry);
        setTours(t);
      } catch (e) {
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [activeCountry]);

  const handleBookNow = (tour: Tour) => {
    // Pre-fill booking: country, destination, activities, and tours list
    const activities = tour.tour_locations?.map((tl) => tl.location.name) || [];
    const searchData = {
      country: tour.country,
      destinations: [tour.name],
      activities,
      startDate: null,
      endDate: null,
      toursData: tours, // provide all tours for the country so Booking page has context
    };
    dispatch(setSearchData(searchData));
    navigate("/booking");
    window.scrollTo(0, 0);
  };

  return (
    <section id="attractions" className="py-5 lg:py-10 bg-[#E6E6E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 lg:mb-6">
          <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-[#482B11] mb-4">
            Popular attractions
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 poppins-regular max-w-2xl mx-auto">
            Explore the best destinations across Africa
          </p>
        </div>

        {/* Country Tabs (from API) */}
        <div className="flex flex-wrap gap-3 lg:gap-4 mb-5 lg:mb-10">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`p-3 lg:px-4 lg:py-2 text-sm md:text-base lg:text-base font-medium transition-all duration-200 rounded-xl poppins-medium ${
                activeCountry === country
                  ? "bg-[#101010A1] text-white"
                  : "bg-white text-[#482B11] "
              } cursor-pointer`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7.5 mb-5 lg:mb-6">
          {(!isLoading && tours.length === 0) && (
            <div className="col-span-full text-center text-gray-500">No tours available</div>
          )}
          {tours.map((tour) => (
            <AttractionCard key={tour.id} tour={tour} onBookNow={handleBookNow} />
          ))}
        </div>
      </div>
    </section>
  );
}
