import React, { useState } from 'react';
import { X, Star, Send, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = "https://travel-guide-fyp.duckdns.org";

const DestinationReviewForm = ({ cityName, isOpen, onClose, onSuccess }) => {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setError('Please log in to write a review.');
            return;
        }

        if (user?.type === 'guide') {
            setError('Guides cannot write destination reviews. Only travelers can submit reviews.');
            return;
        }

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            setError('Please write a review');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/review/destination/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    destination_name: cityName,
                    traveler_email: user.email,
                    traveler_name: user.name || user.fullName,
                    rating: rating,
                    comment: comment
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess && onSuccess(data);
                    onClose();
                    // Reset form
                    setSuccess(false);
                    setRating(0);
                    setComment('');
                }, 2000);
            } else {
                setError(data.detail || 'Failed to submit review');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-stone-50 p-6 sm:p-8 border-b border-stone-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-stone-900">Write a Review</h2>
                            <p className="text-stone-500 mt-1 font-semibold">Share your experience of {cityName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white hover:bg-stone-100 p-2.5 rounded-2xl transition-colors border border-stone-200 shadow-sm text-stone-400 hover:text-stone-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Success State */}
                    {success ? (
                        <div className="p-10 text-center">
                            <div className="w-24 h-24 bg-emerald-50 rounded-[32px] mx-auto mb-6 flex items-center justify-center border border-emerald-100">
                                <CheckCircle className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-stone-900 mb-2">Thank You!</h3>
                            <p className="text-stone-500 font-medium">Your review has been successfully added to {cityName}.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold shadow-sm">
                                    {error}
                                </div>
                            )}

                            {!isAuthenticated && (
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-sm font-bold shadow-sm mb-4">
                                    You must be logged in as a traveler to write a review.
                                </div>
                            )}

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-black text-stone-900 mb-3 uppercase tracking-widest">
                                    Rate {cityName}
                                </label>
                                <div className="flex justify-center gap-2 bg-stone-50 p-4 rounded-3xl border border-stone-100">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-10 h-10 ${star <= (hoverRating || rating)
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-stone-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-600 mt-3">
                                    {rating === 0 ? 'Select a rating' :
                                        rating === 1 ? 'Poor' :
                                            rating === 2 ? 'Fair' :
                                                rating === 3 ? 'Good' :
                                                    rating === 4 ? 'Very Good' : 'Excellent!'}
                                </p>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-black text-stone-900 mb-3 uppercase tracking-widest">
                                    Your Experience
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={`Tell others what you loved about ${cityName}...`}
                                    rows="4"
                                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-3xl focus:border-emerald-400 focus:bg-white focus:outline-none transition-all resize-none text-stone-900 shadow-sm font-medium text-sm"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !isAuthenticated}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Review
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DestinationReviewForm;
