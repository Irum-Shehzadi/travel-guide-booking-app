import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer";
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
import GuideProfile from "./Components/Pages/GuideProfile";


// Admin imports
import AdminLogin from "./Components/Pages/AdminLogin";
import AdminDashboard from "./Components/Pages/AdminDashboard";

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><TravelerDashboard /></ProtectedRoute>} />
        <Route path="/traveler-dashboard" element={<ProtectedRoute><TravelerDashboard /></ProtectedRoute>} />
        <Route path="/guide-dashboard" element={<ProtectedRoute><GuideDashboard /></ProtectedRoute>} />

        {/* Guide Profile - Only for guides */}
        <Route path="/guide-profile" element={<ProtectedRoute allowedRoles={['guide']}><GuideProfile /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />

        {/* Guide Booking - Only for travelers */}
        <Route path="/guide-booking" element={<ProtectedRoute allowedRoles={['traveler']}><GuideBooking /></ProtectedRoute>} />

        <Route path="/pakistan-destinations" element={<ProtectedRoute><PakistanDestinations /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
