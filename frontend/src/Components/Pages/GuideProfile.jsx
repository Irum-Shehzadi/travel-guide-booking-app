import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Award,
    Star,
    Briefcase,
    Globe,
    CheckCircle,
    Loader2,
    MessageSquare,
    Calendar
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const GuideProfile = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [guideData, setGuideData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/guide-login');
            return;
        }

        // Redirect travelers to their dashboard
        if (!authLoading && user?.type === 'traveler') {
            navigate('/traveler-dashboard');
            return;
        }

        if (user?.email) {
            fetchGuideProfile();
            fetchGuideReviews();
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const fetchGuideProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/api/guide/email/${user.email}`);

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setGuideData(data.guide);
        } catch (err) {
            console.error('Error:', err);
            setError('Unable to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchGuideReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/guide-email/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    if (error || !guideData) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">{error || 'Profile not found'}</p>
                    <button
                        onClick={() => navigate('/guide-dashboard')}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : guideData.rating?.toFixed(1) || '0.0';

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-linear-to-r from-orange-600 to-amber-600 p-8 text-white">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Profile Photo */}
                            {guideData.profile_photo ? (
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                                    <img
                                        src={guideData.profile_photo.startsWith('/api')
                                            ? `${API_BASE_URL}${guideData.profile_photo}`
                                            : guideData.profile_photo
                                        }
                                        alt={guideData.fullName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to initials on error
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    {/* Fallback initials (hidden by default) */}
                                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full hidden items-center justify-center text-5xl font-bold">
                                        {guideData.fullName?.charAt(0) || 'G'}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold">
                                    {guideData.fullName?.charAt(0) || 'G'}
                                </div>
                            )}
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-4xl font-bold mb-2">{guideData.fullName}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-orange-100">
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {guideData.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {guideData.phone}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {guideData.city}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                <span className="text-3xl font-bold text-gray-800">{avgRating}</span>
                            </div>
                            <p className="text-gray-500 text-sm">Rating</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Briefcase className="w-6 h-6 text-orange-600" />
                                <span className="text-3xl font-bold text-gray-800">{guideData.experience}</span>
                            </div>
                            <p className="text-gray-500 text-sm">Years Experience</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <span className="text-3xl font-bold text-gray-800">{guideData.total_bookings || 0}</span>
                            </div>
                            <p className="text-gray-500 text-sm">Total Bookings</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                                <span className="text-3xl font-bold text-gray-800">{reviews.length}</span>
                            </div>
                            <p className="text-gray-500 text-sm">Reviews</p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-orange-600" />
                            About Me
                        </h2>
                        <p className="text-gray-600">{guideData.about || 'No description provided'}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-orange-600" />
                            Skills & Expertise
                        </h2>

                        {/* Languages */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {guideData.languages?.map((lang, idx) => (
                                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Specializations */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Specializations</h3>
                            <div className="flex flex-wrap gap-2">
                                {guideData.specializations?.map((spec, idx) => (
                                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        {guideData.certifications && (
                            <div className="mt-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Certifications</h3>
                                <p className="text-gray-600 text-sm">{guideData.certifications}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                        Reviews from Travelers ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">No reviews yet</p>
                            <p className="text-gray-500 text-sm">Reviews from travelers will appear here</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {review.traveler_name?.charAt(0) || 'T'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{review.traveler_name}</h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(review.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-500">{review.rating}/5</span>
                                    </div>

                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideProfile;
