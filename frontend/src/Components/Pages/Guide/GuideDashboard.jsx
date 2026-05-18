import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2,
    AlertCircle, Mail, Phone, Briefcase, Zap, Shield, ChevronRight, Star, MessageSquare, ChevronDown, ChevronUp, AlertTriangle, Flag
} from 'lucide-react';

const API_BASE_URL = "http://92.4.67.243:8000";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const GuideDashboard = () => {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [supportMessages, setSupportMessages] = useState([]);
    const [expandedReview, setExpandedReview] = useState(null);
    const [replyText, setReplyText] = useState({});
    const [guideData, setGuideData] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { navigate('/guide-login'); return; }
        if (!authLoading && user && user.type !== 'guide') { navigate('/traveler-dashboard'); return; }
        if (user?.email) {
            fetchData();
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bRes, rRes, sRes, gRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/booking/guide-email/${user.email}`),
                fetch(`${API_BASE_URL}/api/review/guide-email/${user.email}`),
                fetch(`${API_BASE_URL}/api/contact/user/${user.email}`),
                fetch(`${API_BASE_URL}/api/guide/email/${user.email}`)
            ]);
            const bData = await bRes.json();
            const rData = await rRes.json();
            const sData = await sRes.json();
            const gData = await gRes.json();
            setBookings(bData.bookings || []);
            setReviews(rData.reviews || []);
            setSupportMessages(sData.messages || []);
            setGuideData(gData.guide || null);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            setActionLoading(bookingId);
            await fetch(`${API_BASE_URL}/api/booking/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (err) { alert('Update failed'); } finally { setActionLoading(null); }
    };

    const handleReplySubmit = async (reviewId) => {
        const reply = replyText[reviewId];
        if (!reply?.trim()) return;

        try {
            setActionLoading(`reply-${reviewId}`);
            const response = await fetch(`${API_BASE_URL}/api/review/${reviewId}/reply`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply }),
            });

            if (response.ok) {
                setReviews(reviews.map(r => r.id === reviewId ? { ...r, guide_reply: reply } : r));
                setReplyText(prev => ({ ...prev, [reviewId]: '' }));
                alert('Reply saved!');
            }
        } catch (err) { alert('Reply failed'); } finally { setActionLoading(null); }
    };

    if (authLoading) return <div className="min-h-screen bg-aurora flex items-center justify-center"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-aurora pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* DISCIPLINARY WARNING BANNER */}
                {guideData?.report_count > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        className="mb-8 overflow-hidden"
                    >
                        <div className={`p-6 rounded-[32px] border flex flex-col md:flex-row items-center gap-6 shadow-xl ${
                            guideData.report_count >= 2 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                        }`}>
                            <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${
                                guideData.report_count >= 2 ? 'bg-red-600' : 'bg-amber-500'
                            }`}>
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className={`text-xl font-black tracking-tight mb-1 ${
                                    guideData.report_count >= 2 ? 'text-red-900' : 'text-amber-900'
                                }`}>
                                    Account Under Review ({guideData.report_count} Reports)
                                </h3>
                                <p className={`text-sm font-bold leading-relaxed ${
                                    guideData.report_count >= 2 ? 'text-red-700/70' : 'text-amber-700/70'
                                }`}>
                                    {guideData.report_count === 1 
                                        ? "Admin has issued a formal warning based on traveler feedback. Please maintain professional standards." 
                                        : "Multiple complaints received. Your account is at risk of permanent suspension. Contact support if you have clarifications."}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                guideData.report_count >= 2 ? 'bg-red-600 text-white border-red-600' : 'bg-amber-500 text-white border-amber-500'
                                }`}>
                                Action Required
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Profile Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="glass-panel p-8 rounded-[40px] border-emerald-500/20 mb-10 bg-white/60 shadow-xl"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-600 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-black text-stone-900 mb-1">Guide Dashboard</h1>
                            <p className="text-stone-500 font-bold flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4 text-emerald-600" /> {user?.email}
                            </p>
                        </div>
                        <button onClick={logout} className="px-6 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                            Log Out
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 uppercase tracking-widest font-black">
                    {[
                        { label: 'Pending', val: bookings.filter(b => b.status === 'pending').length, color: 'text-amber-500' },
                        { label: 'Confirmed', val: bookings.filter(b => b.status === 'confirmed').length, color: 'text-emerald-500' },
                        { label: 'Completed', val: bookings.filter(b => b.status === 'completed').length, color: 'text-cyan-600' },
                        { label: 'Total Jobs', val: bookings.length, color: 'text-stone-400' }
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-6 rounded-3xl text-center shadow-sm">
                            <div className={`text-2xl mb-1 ${s.color}`}>{s.val}</div>
                            <div className="text-[9px] text-stone-500">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Assignment Queue */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-stone-900 flex items-center gap-4 px-2 tracking-tight">
                        <Zap className="w-8 h-8 text-emerald-600" /> Assignment Queue
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>
                    ) : bookings.length === 0 ? (
                        <div className="glass-panel p-20 rounded-[40px] text-center border-stone-200 bg-white/40">
                            <MapPin className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                            <p className="text-xl text-stone-400 font-bold">No assignments yet.</p>
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6">
                            {bookings.map((b) => {
                                const review = reviews.find(r => r.booking_id === b.id);
                                const isExpanded = expandedReview === b.id;

                                return (
                                    <motion.div key={b.id} variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-[40px] border-stone-100 bg-white/80 shadow-sm hover:shadow-xl transition-all">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center font-black text-emerald-600 text-xl">
                                                    {b.traveler_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-black text-stone-900">{b.traveler_name}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                            b.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
                                                        }`}>
                                                            {b.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-6 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                                                        <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {b.destination}</span>
                                                        <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-cyan-500" /> {new Date(b.booking_date).toDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 self-end lg:self-center">
                                                {review && (
                                                    <button 
                                                        onClick={() => setExpandedReview(isExpanded ? null : b.id)}
                                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                                                            isExpanded ? 'bg-stone-900 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        }`}
                                                    >
                                                        <Star className={`w-3.5 h-3.5 ${isExpanded ? 'fill-white' : 'fill-emerald-700'}`} />
                                                        {isExpanded ? 'Hide Review' : 'View Review'}
                                                    </button>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    {actionLoading === b.id ? <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" /> : (
                                                        <>
                                                            {b.status === 'pending' && (
                                                                <>
                                                                    <button onClick={() => handleStatusUpdate(b.id, 'confirmed')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">Accept</button>
                                                                    <button onClick={() => handleStatusUpdate(b.id, 'cancelled')} className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Decline</button>
                                                                </>
                                                            )}
                                                            {b.status === 'confirmed' && (
                                                                <button onClick={() => handleStatusUpdate(b.id, 'completed')} className="px-8 py-2.5 bg-white border-2 border-emerald-600 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Mark as Completed</button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expandable Review Section */}
                                        <AnimatePresence>
                                            {isExpanded && review && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }} 
                                                    animate={{ height: 'auto', opacity: 1 }} 
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-8 pt-8 border-t border-stone-100">
                                                        <div className="bg-stone-50 rounded-[32px] p-6 sm:p-8 space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                                                                    ))}
                                                                </div>
                                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Feedback on {new Date(review.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-stone-600 font-medium italic text-lg leading-relaxed">"{review.comment}"</p>
                                                            
                                                            {review.guide_reply ? (
                                                                <div className="bg-emerald-600 p-6 sm:p-8 rounded-[32px] text-white shadow-lg relative ml-8">
                                                                    <div className="absolute -top-2 left-10 w-4 h-4 bg-emerald-600 rotate-45"></div>
                                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 opacity-70">Your Professional Response</p>
                                                                    <p className="text-sm sm:text-lg font-medium italic leading-relaxed">"{review.guide_reply}"</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4 pt-4 border-t border-stone-200">
                                                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Send a Professional Answer</p>
                                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                                        <textarea
                                                                            placeholder="Type your thank you note or clarification here..."
                                                                            className="flex-1 bg-white border border-stone-200 rounded-3xl p-5 text-sm font-medium focus:border-emerald-500 outline-none transition-all resize-none shadow-sm"
                                                                            rows="2"
                                                                            value={replyText[review.id] || ''}
                                                                            onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                                                                        ></textarea>
                                                                        <button
                                                                            onClick={() => handleReplySubmit(review.id)}
                                                                            disabled={actionLoading === `reply-${review.id}`}
                                                                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                                                                        >
                                                                            {actionLoading === `reply-${review.id}` ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Answer'}
                                                                        </button>
                                                                    </div>
                                                                </div>
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
                        <h2 className="text-3xl font-black text-stone-900 flex items-center gap-4 px-2 tracking-tight">
                            <Mail className="w-8 h-8 text-emerald-600" /> Admin Help Center
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
                                                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-2">Platform Admin Response</div>
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
        </div>
    );
};

export default GuideDashboard;
