import React, { useState } from "react";
import { Star, User, MapPin, Calendar } from "lucide-react";

const Review = () => {
  const [selectedRating, setSelectedRating] = useState("all");

  const ratingsFilter = ["all", 5, 4, 3];

  const review = [
    {
      id: 1,
      name: "Ali Khan",
      location: "Lahore, Pakistan",
      rating: 5,
      date: "Jan 2025",
      review:
        "Amazing experience! The guide was very friendly, and the overall trip was smooth. Highly recommended!",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    },
    {
      id: 2,
      name: "Sara Baloch",
      location: "Karachi, Pakistan",
      rating: 4,
      date: "Dec 2024",
      review:
        "Great service! Loved the destination choices. Would love to book again.",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    },
    {
      id: 3,
      name: "Hassan Raza",
      location: "Islamabad, Pakistan",
      rating: 3,
      date: "Nov 2024",
      review:
        "Decent experience. The place was beautiful but could be more organized.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    },
  ];

  const filteredReviews =
    selectedRating === "all"
      ? review
      : review.filter((rev) => rev.rating === selectedRating);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Traveler Reviews</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Honest feedback shared by real travelers about guides, destinations, and experiences.
          </p>
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
                ${
                  selectedRating === rating
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {rating === "all" ? "All Reviews" : `${rating} Stars`}
            </button>
          ))}
        </div>

        {/* REVIEWS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 transform hover:-translate-y-2"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{rev.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {rev.location}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{rev.review}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-700">No reviews</h3>
            <p className="text-gray-500">Try selecting a different rating filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
