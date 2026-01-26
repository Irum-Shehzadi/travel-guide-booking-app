import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import Contact from "./Components/contact/Contact";
import Footer from "./Components/Footer";
import Review from "./Components/Pages/Review";
import GuideBooking from "./Components/Pages/GuideBooking";
import ProtectedRoute from "./Components/ProtectedRoute";

// Page imports
import TravelerSign from "./Components/Pages/TravelerSign";
import GuideRegistration from "./Components/Pages/GuideRegistration";
import About from "./Components/Pages/About";
import PakistanDestinations from "./Components/Pages/PakistanDestination";
import TravelerDashboard from "./Components/Pages/TravelerDashboard";
import GuideDashboard from "./Components/Pages/GuideDashboard";
import GuideLogin from "./Components/Pages/GuideLogin";
import AdminMessages from "./Components/Pages/AdminMessages";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes - accessible without login */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/traveler-signin" element={<TravelerSign />} />
        <Route path="/guide-registration" element={<GuideRegistration />} />
        <Route path="/guide-login" element={<GuideLogin />} />

        {/* Protected routes - require login */}
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><TravelerDashboard /></ProtectedRoute>} />
        <Route path="/traveler-dashboard" element={<ProtectedRoute><TravelerDashboard /></ProtectedRoute>} />
        <Route path="/guide-dashboard" element={<ProtectedRoute><GuideDashboard /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />

        {/* Other pages */}
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/guide-booking" element={<ProtectedRoute><GuideBooking /></ProtectedRoute>} />
        <Route path="/pakistan-destinations" element={<ProtectedRoute><PakistanDestinations /></ProtectedRoute>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
