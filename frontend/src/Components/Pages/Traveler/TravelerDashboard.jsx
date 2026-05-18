import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2,
    AlertCircle, ChevronRight, Mail, Zap, Compass, Trash2, Star, MessageSquare, X, Shield, ChevronDown, Flag, AlertTriangle
} from 'lucide-react';

const API_BASE_URL = "https://travel-guide-fyp.duckdns.org";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const ReviewForm = ({ booking, onClose, onSubmitted }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guide_id: booking?.guide_id,
                    traveler_email: user?.email,
                    traveler_name: user?.name,
                    rating: rating,
                    comment: comment,
                    booking_id: booking?.id
                })
            });
            if (response.ok) {
                const newReview = await response.json();
                alert('Review shared successfully!');
                onSubmitted(newReview.review); // Adjusting based on backend response
                onClose();
            } else {
                const data = await response.json();
                alert(data.detail || 'Failed to submit review');
            }
        } catch (err) {
            alert('Error submitting review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[40px] p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-stone-300 hover:text-stone-900 transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                        <MessageSquare className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">Share Experience</h2>
                    <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest mt-1">Review for {booking?.guide_name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s} type="button" onClick={() => setRating(s)}
                                className={`p-2 transition-all ${rating >= s ? "scale-110" : "grayscale opacity-30"}`}
                            >
                                <Star className={`w-10 h-10 ${rating >= s ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Your Story</label>
                        <textarea
                            required rows="4" value={comment} onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl p-5 text-sm font-medium focus:border-emerald-500 outline-none transition-all resize-none shadow-inner"
                            placeholder="Tell others about your amazing journey..."
                        ></textarea>
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="btn-premium w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6" /> Publish Review</>}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const ReportForm = ({ booking, onClose }) => {
    const { user } = useAuth();
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/complaints/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guide_id: booking?.guide_id,
                    guide_name: booking?.guide_name,
                    destination: booking?.destination,
                    traveler_email: user?.email,
                    traveler_name: user?.name,
                    reason: reason,
                    description: description
                })
            });
            if (response.ok) {
                toast.success('Complaint submitted to admin successfully. They will review it soon.');
                onClose();
            } else {
                const data = await response.json();
                toast.error(data.detail || 'Failed to submit report');
            }
        } catch (err) {
            toast.error('Error submitting report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-red-900/20 backdrop-blur-md flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[40px] p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-stone-300 hover:text-stone-900 transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-200">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">Report Guide</h2>
                    <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest mt-1">Submit your complaint about {booking?.guide_name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Reason for Complaint</label>
                        <select 
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm font-bold focus:border-red-500 outline-none transition-all"
                        >
                            <option value="">Select a reason</option>
                            <option value="Unprofessional Behavior">Unprofessional Behavior</option>
                            <option value="Late Arrival">Late Arrival</option>
                            <option value="Incorrect Information">Incorrect Information</option>
                            <option value="Safety Concerns">Safety Concerns</option>
                            <option value="Overcharging">Overcharging</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Explain the Issue</label>
                        <textarea
                            required rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl p-5 text-sm font-medium focus:border-red-500 outline-none transition-all resize-none shadow-inner"
                            placeholder="Provide details about what happened at the location..."
                        ></textarea>
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-black bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Flag className="w-6 h-6" /> Submit Report</>}
                    </button>
                    <p className="text-[9px] text-stone-400 text-center font-bold px-4 leading-relaxed">
                        Note: False reports can lead to account suspension. Please provide honest feedback.
                    </p>
                </form>
            </motion.div>
        </motion.div>
    );
};


const TravelerDashboard = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myReviews, setMyReviews] = useState([]);
    const [supportMessages, setSupportMessages] = useState([]);
    const [expandedBooking, setExpandedBooking] = useState(null);
    const [reviewingBooking, setReviewingBooking] = useState(null);
    const [reportingBooking, setReportingBooking] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { navigate('/traveler-signin'); return; }
        if (!authLoading && user && user.type === 'guide') { navigate('/guide-dashboard'); return; }
        if (user?.email) {
            fetchData();
        }
    }, [user, isAuthenticated, authLoading]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bRes, rRes, sRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/booking/traveler/${user.email}`),
                fetch(`${API_BASE_URL}/api/review/traveler/${user.email}`),
                fetch(`${API_BASE_URL}/api/contact/user/${user.email}`)
            ]);
            const bData = await bRes.json();
            const rData = await rRes.json();
            const sData = await sRes.json();
            setBookings(bData.bookings || []);
            setMyReviews(rData.reviews || []);
            setSupportMessages(sData.messages || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleDeleteBooking = async (id) => {
        if (!confirm('Cancel this booking?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/booking/${id}`, { method: 'DELETE' });
            setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
        } catch (err) { alert('Failed to cancel'); }
    };

    if (authLoading) return <div className="min-h-screen bg-aurora flex items-center justify-center"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div>;
    if (!user) return null;

    const getStatusCount = (status) => {
        return bookings.filter(b => (b.status || '').toLowerCase() === status.toLowerCase()).length;
    };

    return (
        <div className="min-h-screen bg-aurora pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="glass-panel p-8 sm:p-12 rounded-[40px] border-white/60 mb-10 bg-white/60 shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Compass className="w-48 h-48 text-emerald-600" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-3xl bg-emerald-600 flex items-center justify-center text-4xl font-black text-white shadow-xl">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl sm:text-5xl font-black text-stone-900 mb-2 font-display">Hello, <span className="text-emerald-600">{user?.name}!</span></h1>
                            <p className="text-stone-500 font-bold flex items-center justify-center md:justify-start gap-2 italic">
                                <Mail className="w-5 h-5 text-emerald-600" /> {user?.email}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Confirmed', val: getStatusCount('confirmed'), icon: CheckCircle, color: 'text-emerald-500' },
                        { label: 'Pending', val: getStatusCount('pending'), icon: Clock, color: 'text-amber-500' },
                        { label: 'Completed', val: getStatusCount('completed'), icon: Shield, color: 'text-cyan-600' },
                        { label: 'Cancelled', val: getStatusCount('cancelled'), icon: XCircle, color: 'text-red-500' }
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-6 rounded-3xl bg-white/70 shadow-sm transition-transform hover:scale-105">
                            <s.icon className={`w-6 h-6 ${s.color} mb-4`} />
                            <div className="text-3xl font-black text-stone-900 mb-1 font-display">{s.val}</div>
                            <div className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-black text-stone-900 flex items-center gap-4 px-2 font-display uppercase tracking-tight">
                        <Zap className="w-8 h-8 text-emerald-600" /> Journey Log
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>
                    ) : bookings.length === 0 ? (
                        <div className="glass-panel p-20 rounded-[40px] text-center border-stone-200 bg-white/50">
                            <MapPin className="w-16 h-16 text-stone-200 mx-auto mb-6" />
                            <p className="text-xl text-stone-400 font-bold mb-8">No journeys logged yet.</p>
                            <button onClick={() => navigate('/guide-booking')} className="btn-premium px-8 py-3">Book Your First Trip</button>
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6">
                            {bookings.map((b) => {
                                const review = myReviews.find(r => r.booking_id === b.id);
                                const isExpanded = expandedBooking === b.id;

                                return (
                                    <motion.div key={b.id} variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-[40px] border-stone-100 bg-white/80 shadow-sm hover:shadow-xl transition-all">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center font-black text-emerald-600 text-xl shadow-sm">
                                                    {b.guide_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-stone-900 mb-1">{b.guide_name}</h3>
                                                    <div className="flex flex-wrap gap-x-6 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                                                        <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {b.destination}</span>
                                                        <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-cyan-500" /> {new Date(b.booking_date).toDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 self-end lg:self-center">
                                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${(b.status || '').toLowerCase() === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                    (b.status || '').toLowerCase() === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                        (b.status || '').toLowerCase() === 'completed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                            'bg-red-50 border-red-200 text-red-700'
                                                    }`}>
                                                    {b.status}
                                                </div>

                                                {review && (
                                                    <button
                                                        onClick={() => setExpandedBooking(isExpanded ? null : b.id)}
                                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isExpanded ? 'bg-stone-900 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                            }`}
                                                    >
                                                        <Star className={`w-3.5 h-3.5 ${isExpanded ? 'fill-white' : 'fill-emerald-700'}`} />
                                                        {isExpanded ? 'Hide Feed' : 'View Review'}
                                                    </button>
                                                )}

                                                {(b.status || '').toLowerCase() === 'completed' && !review && (
                                                    <button onClick={() => setReviewingBooking(b)} className="btn-premium px-6 py-2.5 rounded-xl text-[10px] flex items-center gap-2">
                                                        <Star className="w-3 h-3" /> Review Now
                                                    </button>
                                                )}

                                                <button 
                                                    onClick={() => setReportingBooking(b)} 
                                                    className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                                    title="Report Guide"
                                                >
                                                    <Flag className="w-3.5 h-3.5" />
                                                    Report
                                                </button>

                                                {((b.status || '').toLowerCase() === 'pending' || (b.status || '').toLowerCase() === 'confirmed') && (
                                                    <button onClick={() => handleDeleteBooking(b.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expandable Section */}
                                        <AnimatePresence>
                                            {isExpanded && review && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-8 pt-8 border-t border-stone-100 space-y-6">
                                                        <div className="bg-stone-50 rounded-[32px] p-6 sm:p-8 space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                                                                    ))}
                                                                </div>
                                                                <span className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">Sent on {new Date(review.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-stone-600 font-medium italic text-lg leading-relaxed">"{review.comment}"</p>

                                                            {review.guide_reply && (
                                                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-emerald-600 p-6 sm:p-8 rounded-[32px] text-white shadow-lg relative ml-8">
                                                                    <div className="absolute -top-2 left-10 w-4 h-4 bg-emerald-600 rotate-45"></div>
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-[10px]">G</div>
                                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Guide's Response</span>
                                                                    </div>
                                                                    <p className="text-sm sm:text-lg font-medium italic opacity-95 leading-relaxed">"{review.guide_reply}"</p>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>

                {/* Support History Section */}
                {supportMessages.length > 0 && (
                    <div className="mt-20 space-y-8">
                        <h2 className="text-3xl font-black text-stone-900 flex items-center gap-4 px-2 font-display uppercase tracking-tight">
                            <Mail className="w-8 h-8 text-emerald-600" /> Admin Responses
                        </h2>

                        <div className="grid gap-6">
                            {supportMessages.map((msg) => (
                                <div key={msg.id} className="glass-panel p-8 rounded-[40px] border-stone-100 bg-white/80 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100">
                                                <MessageSquare className="w-5 h-5 text-stone-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">Sent on {new Date(msg.created_at).toLocaleDateString()}</p>
                                                <p className="text-stone-700 font-bold mt-1">{msg.message}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {msg.reply && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 pt-6 border-t border-stone-50 flex gap-6"
                                        >
                                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-500">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100 relative flex-1">
                                                <div className="absolute -top-2 left-6 w-4 h-4 bg-emerald-50/50 rotate-45 border-l border-t border-emerald-100"></div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-2">Platform Admin Jawab</div>
                                                <p className="text-stone-800 font-medium italic text-base leading-relaxed">"{msg.reply}"</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewingBooking && (
                    <ReviewForm
                        booking={reviewingBooking}
                        onClose={() => setReviewingBooking(null)}
                        onSubmitted={(newRev) => setMyReviews(prev => [...prev, newRev])}
                    />
                )}
            </AnimatePresence>

            {/* Report Modal */}
            <AnimatePresence>
                {reportingBooking && (
                    <ReportForm
                        booking={reportingBooking}
                        onClose={() => setReportingBooking(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TravelerDashboard;
