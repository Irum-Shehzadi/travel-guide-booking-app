import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Calendar,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    ChevronRight,
    Mail,
    Star,
    MessageSquare
} from 'lucide-react';
import ReviewForm from '../ReviewForm';

const API_BASE_URL = "http://localhost:8000";

const TravelerDashboard = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/traveler-signin');
            return;
        }

        // Redirect guides to their own dashboard
        if (!authLoading && user && user.type === 'guide') {
            navigate('/guide-dashboard');
            return;
        }

        if (user?.email) {
            fetchBookings();
            fetchMyReviews();
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/api/booking/traveler/${user.email}`);

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            setBookings(data.bookings || []);
        } catch (err) {
            console.error('Error:', err);
            setError('Unable to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/traveler/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    const hasReviewedBooking = (bookingId) => {
        return reviews.some(r => r.booking_id === bookingId);
    };

    const handleWriteReview = (booking) => {
        setSelectedBooking(booking);
        setShowReviewModal(true);
    };

    const handleReviewSuccess = () => {
        fetchMyReviews(); // Refresh reviews list
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/booking/${bookingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            // Update local state - mark as cancelled
            setBookings(bookings.map(b =>
                b.id === bookingId ? { ...b, status: 'cancelled' } : b
            ));
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Failed to cancel booking');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const canWriteReview = (booking) => {
        // Allow review for confirmed or completed bookings that haven't been reviewed yet
        return (booking.status === 'confirmed' || booking.status === 'completed')
            && !hasReviewedBooking(booking.id);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Traveler'}!</h1>
                            <p className="text-blue-100 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" />
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Confirmed</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {bookings.filter(b => b.status === 'confirmed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Pending</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Completed</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {bookings.filter(b => b.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Your Bookings</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Loading your bookings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-gray-600">{error}</p>
                            <button
                                onClick={fetchBookings}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-600 font-semibold mb-2">No bookings yet</p>
                            <p className="text-gray-500 mb-4">Start exploring and book your first guide!</p>
                            <button
                                onClick={() => navigate('/guide-booking')}
                                className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                Browse Guides
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                                                {booking.guide_name?.charAt(0) || 'G'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 mb-1">{booking.guide_name}</h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {booking.destination}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {booking.duration_days} {booking.duration_days === 1 ? 'day' : 'days'}
                                                    </span>
                                                </div>
                                                {booking.special_requests && (
                                                    <p className="text-sm text-gray-400 mt-2 italic">
                                                        "{booking.special_requests}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </span>

                                            {/* Write Review Button */}
                                            {canWriteReview(booking) ? (
                                                <button
                                                    onClick={() => handleWriteReview(booking)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
                                                >
                                                    <Star className="w-4 h-4" />
                                                    Write Review
                                                </button>
                                            ) : hasReviewedBooking(booking.id) ? (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Reviewed
                                                </span>
                                            ) : null}

                                            {/* Cancel Booking Button - show for pending or confirmed */}
                                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                <button
                                                    onClick={() => handleDeleteBooking(booking.id)}
                                                    className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-full text-sm font-medium transition-all"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/guide-booking')}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Book Another Guide</h3>
                                <p className="text-gray-500 text-sm">Explore more destinations with expert guides</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/review')}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">View All Reviews</h3>
                                <p className="text-gray-500 text-sm">See what other travelers are saying</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Review Modal */}
            <ReviewForm
                booking={selectedBooking}
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSuccess={handleReviewSuccess}
            />
        </div>
    );
};

export default TravelerDashboard;
