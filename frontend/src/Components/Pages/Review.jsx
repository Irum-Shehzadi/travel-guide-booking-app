import React, { useState, useEffect } from "react";
import { Star, User, MapPin, Calendar, Loader2, MessageSquare, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:8000";

const Review = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedRating, setSelectedRating] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ratingsFilter = ["all", 5, 4, 3, 2, 1];

  // Fetch reviews from API
  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = `${API_BASE_URL}/api/review/all`;

      // If user is a guide, fetch only their reviews
      if (isAuthenticated && user?.type === 'guide') {
        endpoint = `${API_BASE_URL}/api/review/guide-email/${user.email}`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Unable to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews =
    selectedRating === "all"
      ? reviews
      : reviews.filter((rev) => rev.rating === selectedRating);

  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {user?.type === 'guide' ? 'My Reviews' : 'Traveler Reviews'}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            {user?.type === 'guide'
              ? 'Reviews and feedback from travelers who booked your services.'
              : 'Honest feedback shared by real travelers about guides, destinations, and experiences.'
            }
          </p>

          {/* Stats */}
          {!loading && reviews.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                  <span className="text-3xl font-bold">{avgRating}</span>
                </div>
                <p className="text-sm text-blue-100">Average Rating</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-3xl font-bold">{totalReviews}</span>
                </div>
                <p className="text-sm text-blue-100">Total Reviews</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-300" />
                  <span className="text-3xl font-bold">{fiveStarCount}</span>
                </div>
                <p className="text-sm text-blue-100">5-Star Reviews</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {ratingsFilter.map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all 
                ${selectedRating === rating
                  ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {rating === "all" ? "All Reviews" : `${rating} Star${rating !== 1 ? 's' : ''}`}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to load reviews</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchReviews}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* REVIEWS GRID */}
        {!loading && !error && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 transform hover:-translate-y-2"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {rev.traveler_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{rev.traveler_name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Reviewed: {rev.guide_name}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{rev.rating}/5</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-4">{rev.comment}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {formatDate(rev.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-20">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-700">
                  {reviews.length === 0 ? "No reviews yet" : "No reviews with this rating"}
                </h3>
                <p className="text-gray-500">
                  {reviews.length === 0
                    ? "Be the first to share your experience!"
                    : "Try selecting a different rating filter."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Review;
