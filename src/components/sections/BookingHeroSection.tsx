import frame1 from "../../assets/adinkrawhite.svg";
import frame2 from "../../assets/agyindawuruwhite.svg";
import frame3 from "../../assets/nyamewhite.svg";
import frame4 from "../../assets/spiralwhite.svg";
import { useState, useEffect } from "react";
import { Tour } from "@/types/api";
import { BookingForm } from "./BookingForm";
import { BookingSummary } from "./BookingSummary";
import { Congratulations } from "./Congratulations";
import { useNavigate } from "react-router-dom";
import { toursApi } from "@/services/api";

interface SearchData {
  country: string;
  destinations: string[];
  activities: string[];
  startDate: Date | null;
  endDate: Date | null;
  toursData: Tour[]; // Tour data from Redux
}

interface BookingForm {
  selectedCountry: string;
  selectedDestinations: string[];
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  email: string;
  age: string;
  country: string;
  additionalServices: string;
  numberOfPersons: string;
}

interface BookingHeroSectionProps {
  searchData: SearchData;
}

export function BookingHeroSection({ searchData }: BookingHeroSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [formData, setFormData] = useState<BookingForm | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const navigate = useNavigate();
  // Data for activities computation
  const [toursData, setToursData] = useState<Tour[]>([]);
  const [activities, setActivities] = useState<string[]>([]);

  // Seed initial data from searchData
  useEffect(() => {
    if (searchData.toursData && searchData.toursData.length > 0) {
      setToursData(searchData.toursData);
    }
  }, [searchData.toursData]);

  // Compute activities based on selected destinations
  useEffect(() => {
    if (
      !formData?.selectedDestinations ||
      formData.selectedDestinations.length === 0 ||
      toursData.length === 0
    ) {
      setActivities([]);
      return;
    }

    const selectedTours = toursData.filter((tour) =>
      formData.selectedDestinations.includes(tour.name)
    );

    const allActivities = selectedTours.flatMap((tour) =>
      tour.tour_locations.map((tl) => tl.location.name)
    );

    const uniqueActivities = [...new Set(allActivities)];
    setActivities(uniqueActivities);
  }, [formData?.selectedDestinations, toursData]);

  const onSubmit = async (data: BookingForm) => {
    // Ensure we have toursData for the selected country
    let availableTours = toursData;
    if (!availableTours || availableTours.length === 0) {
      try {
        availableTours = await toursApi.getToursByCountry(data.selectedCountry);
        setToursData(availableTours);
      } catch (e) {
        availableTours = [];
      }
    }

    // Compute activities from selected destinations against availableTours
    if (data.selectedDestinations?.length && availableTours?.length) {
      const selectedTours = availableTours.filter((t) =>
        data.selectedDestinations.includes(t.name)
      );
      const allActivities = selectedTours.flatMap((tour) =>
        tour.tour_locations.map((tl) => tl.location.name)
      );
      const unique = [...new Set(allActivities)];
      setActivities(unique);
    } else {
      setActivities([]);
    }

    setFormData(data);
    setShowSummaryModal(true);
  };

  const handleCompleteBooking = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Map the form data to the API structure
      const tourSelections = formData.selectedDestinations
        .map((destination, index) => {
          // Find the tour by name to get the tour_id
          const tour = toursData.find((t: Tour) => t.name === destination);
          if (!tour) return null;

          // Get the location IDs for the selected activities
          const locationIds = activities
            .filter((activity) => {
              // Check if this activity belongs to this tour
              return tour.tour_locations.some(
                (tl: any) => tl.location.name === activity
              );
            })
            .map((activity) => {
              const tourLocation = tour.tour_locations.find(
                (tl: any) => tl.location.name === activity
              );
              return tourLocation?.location_id || 0;
            })
            .filter((id) => id > 0);

          return {
            locations: locationIds,
            order: index + 1,
            tour_id: tour.id,
          };
        })
        .filter(Boolean);

      const payload = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_age: parseInt(formData.age),
        customer_country: formData.country,
        number_of_people: parseInt(formData.numberOfPersons),
        start_date: formData.startDate?.toISOString() || null,
        end_date: formData.endDate?.toISOString() || null,
        additional_services: formData.additionalServices || "",
        tour_selections: tourSelections,
      };

      await toursApi.createBooking(payload);

      setShowSummaryModal(false);
      setShowCongratulations(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-[400px] lg:h-[450px] flex flex-col justify-center overflow-hidden bg-black/40 bg-[url('/src/assets/heromain.svg')] bg-cover bg-no-repeat bg-blend-multiply mb-[870px] md:mb-[582.19px]">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-white">
        <div className="md:flex items-center justify-between mb-6 lg:w-[1204px]">
          <img src={frame1} alt="frame1" className="hidden md:block" />
          <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-center">
            Book Your Tour
          </h2>
          <img src={frame2} alt="frame2" className="hidden md:block" />
        </div>
        <div className="flex items-center gap-[35.75px]">
          <img src={frame3} alt="frame3" className="hidden md:block" />
          <p className="lg:w-[776px] text-sm md:text-base lg:text-lg leading-relaxed poppins-regular text-center">
            Start planning your African adventure today
          </p>
          <img src={frame4} alt="frame4" className="hidden md:block" />
        </div>
      </div>

      <div className="absolute top-[392px] md:top-[322px] lg:top-[452px] left-0 right-0 z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showSummaryModal && !showCongratulations ? (
          <BookingForm
            searchData={searchData}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            initialFormData={formData}
          />
        ) : showSummaryModal ? (
          <BookingSummary
            formData={formData!}
            activities={activities}
            onBack={() => setShowSummaryModal(false)}
            onCompleteBooking={handleCompleteBooking}
            isSubmitting={isSubmitting}
          />
        ) : showCongratulations ? (
          <Congratulations
            onDone={() => {
              // Navigate first to avoid briefly rendering the form again
              navigate("/", { replace: true });
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
