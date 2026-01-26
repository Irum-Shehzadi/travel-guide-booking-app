import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, Phone, MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = "http://localhost:8000";

const BookingForm = ({ guide, isOpen, onClose, onSuccess }) => {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        booking_date: '',
        duration_days: 1,
        destination: guide?.city || '',
        special_requests: '',
        contact_phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setError('Please login to make a booking');
            return;
        }

        if (!formData.booking_date || !formData.destination || !formData.contact_phone) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/booking/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    guide_id: guide.id,
                    traveler_email: user.email,
                    traveler_name: user.name,
                    booking_date: formData.booking_date,
                    duration_days: parseInt(formData.duration_days),
                    destination: formData.destination,
                    special_requests: formData.special_requests,
                    contact_phone: formData.contact_phone
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess && onSuccess(data);
                    onClose();
                }, 2000);
            } else {
                setError(data.detail || 'Failed to create booking');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !guide) return null;

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Book Your Guide</h2>
                            <p className="text-blue-100 mt-1">with {guide.fullName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Success State */}
                {success ? (
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                        <p className="text-gray-600">Your booking request has been sent to {guide.fullName}. You will be contacted soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Not Logged In Warning */}
                        {!isAuthenticated && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                                ⚠️ Please <a href="/traveler-signin" className="font-semibold underline">login</a> to make a booking.
                            </div>
                        )}

                        {/* Guide Info Card */}
                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {guide.fullName?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{guide.fullName}</h3>
                                <p className="text-gray-500 text-sm flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {guide.city}
                                </p>
                                <p className="text-gray-500 text-sm">{guide.experience} years experience</p>
                            </div>
                        </div>

                        {/* Booking Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Booking Date *
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={formData.booking_date}
                                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-2" />
                                Duration (Days)
                            </label>
                            <select
                                value={formData.duration_days}
                                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                            >
                                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'Day' : 'Days'}</option>
                                ))}
                            </select>
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Destination *
                            </label>
                            <input
                                type="text"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                placeholder="Where do you want to visit?"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Contact Phone *
                            </label>
                            <input
                                type="tel"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                placeholder="+92 300 1234567"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* Special Requests */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Special Requests (Optional)
                            </label>
                            <textarea
                                value={formData.special_requests}
                                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                                placeholder="Any special requirements or preferences..."
                                rows="3"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !isAuthenticated}
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Confirm Booking
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BookingForm;
