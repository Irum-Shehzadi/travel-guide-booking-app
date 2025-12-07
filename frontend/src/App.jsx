import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import Contact from "./Components/contact/Contact";
import Footer from "./Components/Footer";
import Review from "./Components/Pages/Review";
import GuideBooking from "./Components/Pages/GuideBooking";


// new imports for the two pages
import TravelerSign from "./Components/Pages/TravelerSign";
import GuideRegistration from "./Components/Pages/GuideRegistration";
import About from "./Components/Pages/About";
import PakistanDestinations from "./Components/Pages/PakistanDestination";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/contact" element={<Contact />} />
        

        {/* Added routes */}
        <Route path="/traveler-signin" element={<TravelerSign />} />
        <Route path="/guide-registration" element={<GuideRegistration />} />
        <Route path="about" element={<About />} />
        <Route path="review" element={<Review />} />
         <Route path="guide-booking" element={<GuideBooking />} />
         <Route path="pakistan-destinations" element={<PakistanDestinations />} />
       

      </Routes>

      <Footer />
    </>
  );
}

export default App;
