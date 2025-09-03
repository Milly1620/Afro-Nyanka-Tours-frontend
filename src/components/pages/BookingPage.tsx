import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { BookingHeroSection } from "../sections/BookingHeroSection";

export function BookingPage() {
  const searchData = useAppSelector((state) => state.booking.searchData);
  const navigate = useNavigate();

  // Create default search data if none exists
  const defaultSearchData = {
    country: "",
    destinations: [],
    activities: [],
    startDate: null,
    endDate: null,
    toursData: [],
  };

  // Use search data if available, otherwise use default
  const bookingData = searchData || defaultSearchData;

  // Ensure the page scrolls to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Booking Hero Section */}
      <BookingHeroSection searchData={bookingData} />
    </>
  );
}
