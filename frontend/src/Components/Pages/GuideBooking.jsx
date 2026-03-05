import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Search, Star, Loader2, AlertCircle, Shield, ChevronRight, CheckCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../BookingForm";

const API_BASE_URL = "http://localhost:8000";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const GuideBooking = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.type === 'guide') navigate('/guide-dashboard');
  }, [isAuthenticated, user, navigate]);

  useEffect(() => { fetchGuides(); }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/guide/all`);
      if (!response.ok) throw new Error('Failed to fetch guides');
      const data = await response.json();
      setGuides(data.guides || []);
    } catch (err) {
      setError('Unable to load guides. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(guide =>
    guide.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.specializations?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookNow = (guide) => {
    setSelectedGuide(guide);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    fetchGuides();
  };

  if (loading) return (
    <div className="min-h-screen bg-aurora flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-azure animate-spin mx-auto mb-4" />
        <p className="text-white font-bold">Loading expert guides...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-aurora flex items-center justify-center p-6">
      <div className="glass-panel p-10 rounded-[40px] text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={fetchGuides} className="btn-premium px-8 py-3 w-full">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-aurora pt-24 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16 relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-azure/10 text-azure text-xs font-bold uppercase tracking-widest mb-6">Explore Pakistan with Experts</motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-extrabold text-white mb-8">Ready to Meet Your <span className="text-gradient">Guide?</span></motion.h1>
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-azure transition-colors" />
            <input
              type="text" placeholder="Search by city, name, or specialty..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-azure/30 transition-all shadow-2xl"
            />
          </div>
        </header>

        {filteredGuides.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <motion.div key={guide.id} variants={itemVariants} className="glass-card rounded-[40px] overflow-hidden group border-white/5 hover:border-azure/20 transition-all">
                <div className="relative h-72 overflow-hidden">
                  {guide.profile_photo ? (
                    <img src={guide.profile_photo.startsWith('/api') ? `${API_BASE_URL}${guide.profile_photo}` : guide.profile_photo} alt={guide.fullName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-azure/20 to-aurora/20 flex items-center justify-center">
                      <span className="text-7xl font-bold text-white/10">{guide.fullName?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full flex items-center gap-1 z-10">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-white text-xs font-bold">{guide.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  {guide.is_verified && (
                    <div className="absolute top-4 left-4 bg-azure/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2 z-10">
                      <Shield className="w-3 h-3" /> Verified
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-azure transition-colors">{guide.fullName}</h3>
                    <div className="text-azure flex items-center gap-1 text-[10px] font-bold uppercase bg-azure/10 px-3 py-1.5 rounded-xl border border-azure/20">
                      {guide.experience} Years Exp
                    </div>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-6 gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-azure" /> {guide.city}
                  </div>

                  {/* Languages & Specialties */}
                  <div className="space-y-3 mb-8">
                    <div className="flex flex-wrap gap-2">
                      {guide.languages?.slice(0, 3).map((l, i) => (
                        <span key={i} className="text-[10px] font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{l}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {guide.specializations?.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] font-bold text-azure bg-azure/5 px-2.5 py-1 rounded-lg border border-azure/10 uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Available</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Bookings</p>
                      <p className="text-lg font-bold text-white">{guide.total_bookings || 0}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookNow(guide)}
                    className="btn-premium w-full mt-8 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                  >
                    Get Started <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-panel p-20 rounded-[50px] text-center border-white/5">
            <Search className="w-16 h-16 mx-auto mb-6 text-white/5" />
            <p className="text-xl text-gray-500 font-bold">No guides found matching your selection.</p>
            <button onClick={() => setSearchQuery('')} className="text-azure mt-4 hover:underline font-bold">Show all guides</button>
          </div>
        )}
      </div>

      <BookingForm
        guide={selectedGuide}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default GuideBooking;