import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { BookingHeroSection } from "../sections/BookingHeroSection";

export function BookingPage() {
  const searchData = useAppSelector((state) => state.booking.searchData);
  const navigate = useNavigate();

  // Redirect to home if no search data
  useEffect(() => {
    if (!searchData) {
      navigate("/");
    }
  }, [searchData, navigate]);

  if (!searchData) {
    return null; // Will redirect
  }

  return (
    <>
      {/* Booking Hero Section */}
      <BookingHeroSection searchData={searchData} />
    </>
  );
}
