import React, { useState } from "react";
import { MapPin, Clock, Search, Star, X, Send } from "lucide-react";

const GuideBooking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState({});
  const [bookedGuides, setBookedGuides] = useState([]);

  const guides = [
    {
      id: 1,
      name: "Ali Khan",
      city: "Lahore",
      rating: 4.9,
      experience: "5 years",
      price: 500,
      image: "https://images.unsplash.com/photo-1596464716121-2a84d1d93b5c?w=400",
    },
    {
      id: 2,
      name: "Sara Malik",
      city: "Karachi",
      rating: 4.8,
      experience: "7 years",
      price: 700,
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400",
    },
    {
      id: 3,
      name: "Imran Shah",
      city: "Islamabad",
      rating: 5.0,
      experience: "10 years",
      price: 1000,
      image: "https://images.unsplash.com/photo-1580657011326-9b7b6f1f8f53?w=400",
    },
    {
      id: 4,
      name: "Ayesha Khan",
      city: "Peshawar",
      rating: 4.7,
      experience: "4 years",
      price: 450,
      image: "https://images.unsplash.com/photo-1573495628361-ace7e7e28be1?w=400",
    },
    {
      id: 5,
      name: "Hassan Ahmed",
      city: "Lahore",
      rating: 4.6,
      experience: "6 years",
      price: 600,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 6,
      name: "Fatima Noor",
      city: "Karachi",
      rating: 4.9,
      experience: "3 years",
      price: 400,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    },
  ];

  // Filter guides based on search query
  const filteredGuides = guides.filter(guide =>
    guide.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookNow = (guide) => {
    setSelectedGuide(guide);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    setBookedGuides(prev => [...prev, selectedGuide.id]);
    setShowBookingModal(false);
    alert(`Successfully booked ${selectedGuide.name}! You can leave a review after your tour.`);
  };

  const handleAddReview = (guide) => {
    setSelectedGuide(guide);
    setShowReviewModal(true);
    setReviewRating(0);
    setReviewText('');
  };

  const handleSubmitReview = () => {
    if (reviewRating > 0 && reviewText.trim()) {
      const newReview = {
        rating: reviewRating,
        text: reviewText,
        date: new Date().toLocaleDateString(),
      };
      
      setReviews(prev => ({
        ...prev,
        [selectedGuide.id]: [...(prev[selectedGuide.id] || []), newReview]
      }));
      
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewText('');
      alert('Thank you for your review!');
    } else {
      alert('Please provide both rating and review text');
    }
  };

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
            placeholder="Search by city or guide name..."
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
              <div className="relative overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-gray-800">{guide.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{guide.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-3 gap-2">
                  <MapPin className="w-4 h-4" /> {guide.city}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Experience: {guide.experience}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Full day
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">From</span>
                    <p className="text-lg font-bold text-blue-600">Rs. {guide.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBookNow(guide)}
                  className="w-full mt-4 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                  Book Now
                </button>

                {/* Add Review Button - Only show if booked */}
                {bookedGuides.includes(guide.id) && (
                  <button 
                    onClick={() => handleAddReview(guide)}
                    className="w-full mt-2 bg-linear-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    Leave a Review
                  </button>
                )}
                
                {/* Show Reviews */}
                {reviews[guide.id] && reviews[guide.id].length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Reviews:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {reviews[guide.id].slice(-2).map((review, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">{review.date}</span>
                          </div>
                          <p className="text-xs text-gray-600">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          <p className="text-xl text-gray-600 font-semibold">No guides found</p>
          <p className="text-gray-500 mt-2">Try searching with a different city or guide name</p>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingModal && selectedGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Confirm Booking</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={selectedGuide.image} 
                  alt={selectedGuide.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{selectedGuide.name}</h4>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {selectedGuide.city}
                  </p>
                  <p className="text-blue-600 font-semibold">Rs. {selectedGuide.price}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                By confirming, you agree to book this guide. You can leave a review after completing your tour.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Review {selectedGuide.name}</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Rate your experience:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Write your review:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this guide..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                rows="4"
              />
            </div>

            <button
              onClick={handleSubmitReview}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Review
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GuideBooking;