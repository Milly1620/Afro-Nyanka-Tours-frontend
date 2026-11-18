import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { BookingPage } from "./components/pages/BookingPage";
import { HomePage } from "./components/pages/HomePage";
import { CarouselProvider } from "./components/sections/CarouselContext";

function App() {
  const location = useLocation();
  const isBookingPage = location.pathname === "/booking";

  return (
    <CarouselProvider>
      <div className="min-h-screen">
        <Header />
        <main className={isBookingPage ? "pt-0" : ""}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CarouselProvider>
  );
}

export default App;
