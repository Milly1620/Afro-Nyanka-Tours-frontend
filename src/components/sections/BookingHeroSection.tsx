import frame1 from "../../assets/adinkrawhite.svg";
import frame2 from "../../assets/agyindawuruwhite.svg";
import frame3 from "../../assets/nyamewhite.svg";
import frame4 from "../../assets/spiralwhite.svg";
import { useState, useEffect } from "react";
import type { BookingCreateResponse, Tour } from "@/types/api";
import { BookingForm } from "./BookingForm";
import { BookingSummary } from "./BookingSummary";
import { Congratulations } from "./Congratulations";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { bookingsApi, getErrorMessage, toursApi } from "@/services/api";
import {
  buildTourBookingPayload,
  chosenExtras,
  estimateTotal,
  offeredExtras,
  selectedTours,
  type BookingFormValues,
} from "@/lib/booking";

interface SearchData {
  country: string;
  destinations: string[];
  activities: string[];
  startDate: Date | null;
  endDate: Date | null;
  toursData: Tour[]; // Tour data from Redux
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
  const [formData, setFormData] = useState<BookingFormValues | null>(null);
  const [confirmation, setConfirmation] = useState<BookingCreateResponse | null>(null);
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

  const onSubmit = async (data: BookingFormValues) => {
    // Ensure we have toursData for the selected country
    let availableTours = toursData;
    if (!availableTours || availableTours.length === 0) {
      try {
        availableTours = await toursApi.getToursByCountry(data.selectedCountry, false);
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
      const payload = buildTourBookingPayload(formData, toursData);
      if (!payload.tour_selections?.length) {
        const message = "Select at least one destination.";
        setSubmitStatus({ type: "error", message });
        toast.error(message);
        return;
      }

      const result = await bookingsApi.create(payload);

      setConfirmation(result);
      setShowSummaryModal(false);
      toast.success(`Booking ${result.booking.reference} received`);
    } catch (error) {
      console.error("Error submitting booking:", error);
      const message = getErrorMessage(error);
      setSubmitStatus({ type: "error", message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chosenTours = selectedTours(toursData, formData?.selectedDestinations ?? []);
  const summaryExtras = chosenExtras(offeredExtras(chosenTours), formData?.extraIds ?? []);
  const estimatedTotal = estimateTotal(
    chosenTours,
    parseInt(formData?.numberOfPersons ?? "", 10),
    summaryExtras,
  );

  return (
    <>
    <section className="h-[400px] lg:h-[450px] flex flex-col justify-center overflow-hidden bg-black/40 bg-[url('/src/assets/heromain.svg')] bg-cover bg-no-repeat bg-blend-multiply">
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
    </section>

      <div className="relative z-20 -mt-2 md:-mt-[78px] lg:mt-0.5 mb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showSummaryModal && !confirmation ? (
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
            extras={summaryExtras}
            estimatedTotal={estimatedTotal}
            errorMessage={submitStatus.type === "error" ? submitStatus.message : ""}
            onBack={() => setShowSummaryModal(false)}
            onCompleteBooking={handleCompleteBooking}
            isSubmitting={isSubmitting}
          />
        ) : confirmation ? (
          <Congratulations
            confirmation={confirmation}
            onDone={() => {
              // Navigate first to avoid briefly rendering the form again
              navigate("/", { replace: true });
            }}
          />
        ) : null}
      </div>
    </>
  );
}
