import React, { useState, useEffect } from "react";
import { MapPin, Clock, Search, Star, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../BookingForm";

// API Base URL - can be configured in environment variable
const API_BASE_URL = "http://localhost:8000";

const GuideBooking = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // States for API integration
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect guides to their dashboard
  useEffect(() => {
    if (isAuthenticated && user?.type === 'guide') {
      navigate('/guide-dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch guides from backend API
  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/guide/all`);

      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }

      const data = await response.json();
      setGuides(data.guides || []);
    } catch (err) {
      console.error('Error fetching guides:', err);
      setError('Unable to load guides. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Filter guides based on search query
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
    // Optionally refresh guides to update booking counts
    fetchGuides();
  };

  // Loading State
  if (loading) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-medium">Loading guides...</p>
          <p className="text-gray-500 mt-2">Please wait while we fetch available guides</p>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 py-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl text-gray-800 font-semibold mb-2">Unable to Load Guides</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchGuides()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 py-16 px-4">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Book Your Guide
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-4">
          Choose from trusted guides to explore Pakistan safely and comfortably.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by city, guide name, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none shadow-lg text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length > 0 ? (
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                {/* Guide Image - show profile photo if available */}
                {guide.profile_photo ? (
                  <img
                    src={guide.profile_photo.startsWith('/api')
                      ? `${API_BASE_URL}${guide.profile_photo}`
                      : guide.profile_photo
                    }
                    alt={guide.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient on error
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback gradient with initial */}
                <div
                  className={`absolute inset-0 bg-linear-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center ${guide.profile_photo ? 'hidden' : ''}`}
                >
                  <div className="text-white text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center text-4xl font-bold">
                      {guide.fullName?.charAt(0) || 'G'}
                    </div>
                  </div>
                </div>
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-gray-800">{guide.rating?.toFixed(1) || '0.0'}</span>
                </div>
                {/* Verified Badge */}
                {guide.is_verified && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    ✓ Verified
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{guide.fullName}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-3 gap-2">
                  <MapPin className="w-4 h-4" /> {guide.city}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Experience: {guide.experience} years
                </p>
                {/* Languages */}
                {guide.languages && guide.languages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {guide.languages.slice(0, 3).map((lang, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                    {guide.languages.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{guide.languages.length - 3}
                      </span>
                    )}
                  </div>
                )}
                {/* Specializations */}
                {guide.specializations && guide.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {guide.specializations.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Full day
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Bookings</span>
                    <p className="text-lg font-bold text-blue-600">{guide.total_bookings || 0}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBookNow(guide)}
                  className="w-full mt-4 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          {guides.length === 0 ? (
            <>
              <p className="text-xl text-gray-600 font-semibold">No verified guides yet</p>
              <p className="text-gray-500 mt-2">Check back soon! Guides are being verified.</p>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-600 font-semibold">No guides found</p>
              <p className="text-gray-500 mt-2">Try searching with a different city, name, or specialization</p>
            </>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <BookingForm
        guide={selectedGuide}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={handleBookingSuccess}
      />
    </section>
  );
};

export default GuideBooking;