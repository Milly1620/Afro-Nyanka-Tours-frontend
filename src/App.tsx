import { Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { BookingPage } from "./components/pages/BookingPage";
import { TextEditor } from "./components/TextEditor";
import { HomePage } from "./components/pages/HomePage";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
    // <TextEditor />
  );
}

export default App;
