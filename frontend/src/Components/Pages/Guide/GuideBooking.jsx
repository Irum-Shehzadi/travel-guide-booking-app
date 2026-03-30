import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Search, Star, Loader2, AlertCircle, Shield, ChevronRight, CheckCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import BookingForm from "../../BookingForm";

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

  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [guideReviews, setGuideReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchGuideReviews = async (guideId) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/guide/${guideId}`);
      const data = await response.json();
      setGuideReviews(data.reviews || []);
      setShowReviewsModal(true);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleBookNow = (guide) => {
    setSelectedGuide(guide);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    fetchGuides();
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        <p className="text-stone-600 font-bold">Loading expert guides...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[40px] text-center max-w-md shadow-lg border border-red-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 bg-red-50 rounded-2xl p-4" />
        <h2 className="text-2xl font-black text-stone-900 mb-4">Connection Error</h2>
        <p className="text-stone-500 mb-8 font-medium">{error}</p>
        <button onClick={fetchGuides} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl w-full transition-colors shadow-sm text-sm">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-20 overflow-hidden relative">
      {/* Background Decorative Elements for Light Mode */}
      <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -translate-x-1/3 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="text-center mb-16 relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-white text-emerald-700 text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100 shadow-sm">Explore Pakistan with Experts</motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-black text-stone-900 mb-8 tracking-tighter">Ready to Meet Your <span className="text-emerald-600 drop-shadow-sm">Guide?</span></motion.h1>
          <div className="max-w-2xl mx-auto relative group shadow-sm rounded-3xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors w-6 h-6" />
            <input
              type="text" placeholder="Search by city, name, or specialty..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200 focus:border-emerald-400 rounded-3xl py-5 pl-16 pr-8 text-stone-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm font-semibold text-base sm:text-lg"
            />
          </div>
        </header>

        {filteredGuides.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <motion.div key={guide.id} variants={itemVariants} className="bg-white rounded-[32px] sm:rounded-[40px] overflow-hidden group border border-stone-200 hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl hover:-translate-y-2 flex flex-col">
                <div className="relative h-72 overflow-hidden bg-stone-100">
                  {guide.profile_photo ? (
                    <img src={guide.profile_photo.startsWith('/api') ? `${API_BASE_URL}${guide.profile_photo}` : guide.profile_photo} alt={guide.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center border-b border-emerald-100">
                      <span className="text-7xl font-black text-emerald-200">{guide.fullName?.charAt(0)}</span>
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-1.5 z-10">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-stone-900 text-[11px] font-black">{guide.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  {/* Verified Badge */}
                  {guide.is_verified && (
                    <div className="absolute top-4 left-4 bg-emerald-100/95 backdrop-blur-md text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 z-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Shield className="w-3.5 h-3.5" /> Verified
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-stone-900 group-hover:text-emerald-700 transition-colors truncate pr-2">{guide.fullName}</h3>
                    <div className="text-amber-600 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-amber-50 px-2 py-1.5 rounded-md border border-amber-100 shrink-0">
                      <Zap className="w-3 h-3" /> {guide.experience} Yrs
                    </div>
                  </div>

                  <div className="flex items-center text-stone-500 text-sm mb-6 gap-2 font-semibold">
                    <MapPin className="w-4 h-4 text-emerald-600" /> {guide.city}
                  </div>

                  {/* Languages & Specialties */}
                  <div className="space-y-3 mb-8">
                    <div className="flex flex-wrap gap-2">
                      {guide.languages?.slice(0, 3).map((l, i) => (
                        <span key={i} className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">{l}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {guide.specializations?.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-widest">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between py-5 border-t border-stone-100 mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs text-stone-500 font-bold uppercase tracking-widest">Available</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">Total Bookings</p>
                        <p className="text-lg font-black text-stone-900">{guide.total_bookings || 0}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <button
                        onClick={() => handleBookNow(guide)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 text-xs font-bold shadow-md hover:shadow-lg uppercase tracking-wider w-full"
                      >
                        Book Now <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => fetchGuideReviews(guide.id)}
                        className="bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider w-full"
                      >
                        Reviews <Star className="w-4 h-4 text-amber-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white p-20 rounded-[40px] text-center border border-stone-200 shadow-sm max-w-2xl mx-auto">
            <Search className="w-16 h-16 mx-auto mb-6 text-stone-300" />
            <p className="text-xl text-stone-500 font-bold">No guides found matching your selection.</p>
            <button onClick={() => setSearchQuery('')} className="bg-stone-100 text-stone-600 hover:bg-stone-200 px-6 py-2 rounded-full mt-6 transition-colors font-bold text-sm border border-stone-200">Show all guides</button>
          </div>
        )}
      </div>

      <BookingForm
        guide={selectedGuide}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={handleBookingSuccess}
      />

      {/* Reviews Modal */}
      <AnimatePresence>
        {showReviewsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewsModal(false)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[32px] sm:rounded-[40px] border border-stone-200 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div>
                  <h3 className="text-2xl font-black text-stone-900">Guide Reviews</h3>
                  <p className="text-stone-500 text-sm font-semibold mt-1">See what other travelers say</p>
                </div>
                <button onClick={() => setShowReviewsModal(false)} className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:bg-stone-100 shadow-sm transition-colors"><AlertCircle className="rotate-45 w-6 h-6" /></button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {reviewsLoading ? (
                  <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div>
                ) : guideReviews.length > 0 ? (
                  <div className="space-y-4">
                    {guideReviews.map((r, i) => (
                      <div key={i} className="p-6 bg-stone-50 rounded-[28px] border border-stone-200 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-lg">{r.traveler_name.charAt(0)}</div>
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm">{r.traveler_name}</h4>
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? "text-amber-400 fill-amber-400" : "text-stone-300"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed italic font-medium bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-stone-50 rounded-[32px] border border-stone-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200 shadow-sm">
                      <Star className="w-8 h-8 text-stone-300" />
                    </div>
                    <p className="text-stone-500 font-bold text-lg">No reviews for this guide yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuideBooking;