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
    Mail,
    Phone,
    Briefcase
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const GuideDashboard = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // id of booking being updated

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/traveler-signin');
            return;
        }

        // Redirect travelers to their own dashboard
        if (!authLoading && user && user.type !== 'guide') {
            navigate('/traveler-dashboard');
            return;
        }

        if (user?.email) {
            fetchBookings();
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setPageError(null);

            const response = await fetch(`${API_BASE_URL}/api/booking/guide-email/${user.email}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Guide profile not found. Are you registered as a guide?');
                }
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            setBookings(data.bookings || []);
        } catch (err) {
            console.error('Error:', err);
            setPageError(err.message || 'Unable to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            setActionLoading(bookingId);
            const response = await fetch(`${API_BASE_URL}/api/booking/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setBookings(bookings.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));

        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update booking status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) {
            return;
        }

        try {
            setActionLoading(bookingId);
            const response = await fetch(`${API_BASE_URL}/api/booking/${bookingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete booking');
            }

            // Update local state - mark as cancelled
            setBookings(bookings.map(b =>
                b.id === bookingId ? { ...b, status: 'cancelled' } : b
            ));
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Failed to delete booking');
        } finally {
            setActionLoading(null);
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

    if (authLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-linear-to-r from-orange-600 to-amber-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
                            {user?.name?.charAt(0) || 'G'}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">Guide Dashboard</h1>
                            <p className="text-orange-100 flex items-center justify-center md:justify-start gap-2">
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
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <Briefcase className="w-6 h-6 text-orange-600" />
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
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
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

                {/* Bookings List */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Booking Requests</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Loading bookings...</p>
                        </div>
                    ) : pageError ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-gray-600">{pageError}</p>
                            <button
                                onClick={fetchBookings}
                                className="mt-4 text-orange-600 hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-600 font-semibold mb-2">No bookings received yet</p>
                            <p className="text-gray-500">Your profile is visible to travelers.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        {/* Booking Info */}
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shrink-0">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-800">{booking.traveler_name}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize border ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {booking.destination}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(booking.booking_date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {booking.duration_days} days
                                                    </span>
                                                    {booking.contact_phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {booking.contact_phone}
                                                        </span>
                                                    )}
                                                </div>
                                                {booking.special_requests && (
                                                    <div className="mt-2 bg-gray-50 p-2 rounded-lg text-sm text-gray-600 border border-gray-100">
                                                        <span className="font-semibold text-xs text-gray-400 block mb-1">SPECIAL REQUEST:</span>
                                                        "{booking.special_requests}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 self-start lg:self-center">
                                            {actionLoading === booking.id && (
                                                <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                                            )}

                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                        disabled={actionLoading === booking.id}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                        disabled={actionLoading === booking.id}
                                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 text-sm font-medium transition-colors"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                    disabled={actionLoading === booking.id}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                                                >
                                                    Mark Completed
                                                </button>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                    disabled={actionLoading === booking.id}
                                                    className="px-4 py-2 text-gray-500 hover:text-red-600 disabled:opacity-50 text-sm font-medium transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {/* Delete Button - visible for all statuses */}
                                            <button
                                                onClick={() => handleDeleteBooking(booking.id)}
                                                disabled={actionLoading === booking.id}
                                                className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                                                title="Delete Booking"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideDashboard;
