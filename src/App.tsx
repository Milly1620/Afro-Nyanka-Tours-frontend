import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { BookingPage } from "./components/pages/BookingPage";
import { HomePage } from "./components/pages/HomePage";
import { CarouselProvider } from "./components/sections/CarouselContext";
import { AdminRoutes } from "./components/admin/AdminRoutes";

function PublicSite() {
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

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}

export default App;
