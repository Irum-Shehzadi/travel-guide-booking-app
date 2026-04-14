import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Calendar, Shield, Award, Clock, Mail, Phone, ArrowLeft, Zap, MessageSquare, Compass, Globe, ChevronDown } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const GuideDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guide, setGuide] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [visibleCount, setVisibleCount] = useState(3);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGuideDetails();
        fetchGuideReviews();
    }, [id]);

    const fetchGuideDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/guide/${id}`);
            if (!response.ok) throw new Error('Guide not found');
            const data = await response.json();
            setGuide(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchGuideReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/guide/${id}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <Zap className="w-12 h-12 text-emerald-600 animate-spin" />
        </div>
    );

    if (error || !guide) return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-stone-900 mb-4 font-display">Oops! Guide Not Found</h2>
            <button onClick={() => navigate('/guide-booking')} className="btn-premium px-8 py-3">Back to Directory</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20 selection:bg-emerald-100 selection:text-emerald-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-stone-400 hover:text-emerald-700 font-black uppercase text-[10px] tracking-widest mb-10 transition-all hover:-translate-x-1"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>

                <div className="grid lg:grid-cols-[1.1fr_0.4fr] gap-12 items-start">
                    <div className="space-y-12">
                        {/* Profile Header Block */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            className="bg-white p-8 sm:p-12 rounded-[48px] border border-stone-100 shadow-2xl shadow-stone-200/50"
                        >
                            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                                <div className="w-36 h-36 sm:w-56 sm:h-56 rounded-[48px] overflow-hidden border-8 border-stone-50 shadow-xl shrink-0 bg-stone-100 p-0.5">
                                    {guide.profile_photo ? (
                                        <img 
                                            src={guide.profile_photo.startsWith('/api') ? `${API_BASE_URL}${guide.profile_photo}` : guide.profile_photo} 
                                            alt={guide.fullName} 
                                            className="w-full h-full object-cover rounded-[44px]"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl font-black text-emerald-200 uppercase">
                                            {guide.fullName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200">Verified Expert</span>
                                            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                                                <Star className="w-4 h-4 fill-amber-500" /> {guide.rating || "New"}
                                            </div>
                                        </div>
                                        <h1 className="text-4xl sm:text-6xl font-black text-stone-900 font-display tracking-tight leading-none uppercase">{guide.fullName}</h1>
                                    </div>
                                    <p className="flex items-center justify-center md:justify-start gap-2 text-stone-400 font-black uppercase text-xs tracking-[0.2em]">
                                        <MapPin className="w-5 h-5 text-emerald-600" /> {guide.city}, PK
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                        <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 px-5 py-3 rounded-2xl">
                                            <Award className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Experience</p>
                                                <p className="text-sm font-black text-stone-800">{guide.experience} Years</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 px-5 py-3 rounded-2xl">
                                            <Shield className="w-5 h-5 text-cyan-500" />
                                            <div>
                                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Safety</p>
                                                <p className="text-sm font-black text-stone-800">Certified</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bio Section */}
                        <div className="space-y-6 px-4">
                            <h2 className="text-2xl font-black text-stone-900 font-display flex items-center gap-4 uppercase tracking-tighter">
                                <Zap className="w-7 h-7 text-emerald-600" /> About the Guide
                            </h2>
                            <p className="text-stone-500 font-medium text-xl leading-relaxed max-w-3xl">
                                {guide.about || `${guide.fullName} is an experienced guide dedicated to making your journey through ${guide.city} unforgettable with local insights and hidden treasures.`}
                            </p>
                        </div>

                        {/* Reviews Section */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-4 border-b border-stone-200 pb-6">
                                <h3 className="text-3xl font-black text-stone-900 font-display uppercase tracking-tighter flex items-center gap-4">
                                    <MessageSquare className="w-8 h-8 text-emerald-600" /> Reviews ({reviews.length})
                                </h3>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Total Satisfaction</p>
                                    <div className="flex gap-0.5 mt-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <AnimatePresence mode="popLayout">
                                    {reviews.slice(0, visibleCount).map((r, i) => (
                                        <motion.div 
                                            key={r.id || i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-xl shadow-stone-100/50"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center font-black text-emerald-600 border border-stone-100">
                                                        {r.traveler_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-stone-900 text-sm uppercase tracking-tight">{r.traveler_name}</h4>
                                                        <div className="flex gap-0.5 mt-1">
                                                            {[...Array(5)].map((_, idx) => (
                                                                <Star key={idx} className={`w-3 h-3 ${idx < r.rating ? "text-amber-400 fill-amber-400" : "text-stone-100"}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-stone-300 font-black uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-stone-500 text-lg font-medium italic leading-relaxed">"{r.comment}"</p>
                                            
                                            {r.guide_reply && (
                                                <div className="mt-8 bg-emerald-600 p-8 rounded-[38px] text-white shadow-lg relative">
                                                    <div className="absolute -top-2 left-10 w-4 h-4 bg-emerald-600 rotate-45"></div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-[10px]">G</div>
                                                        <p className="text-[9px] font-black text-white/80 uppercase tracking-widest">Guide's Response</p>
                                                    </div>
                                                    <p className="text-white text-base font-medium italic leading-relaxed">"{r.guide_reply}"</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {visibleCount < reviews.length && (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => setVisibleCount(prev => prev + 3)}
                                    className="w-full py-6 rounded-[32px] border-2 border-dashed border-stone-200 text-stone-400 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:border-emerald-500 hover:text-emerald-700 transition-all bg-white/50"
                                >
                                    <ChevronDown className="w-5 h-5 animate-bounce" /> See More Reviews
                                </motion.button>
                            )}

                            {reviews.length === 0 && (
                                <div className="bg-white p-20 rounded-[48px] text-center border-2 border-dashed border-stone-100">
                                    <MessageSquare className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                                    <p className="text-stone-400 font-black uppercase tracking-widest text-sm">No reviews yet for this guide</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Card Sidebar */}
                    <div className="bg-stone-900 p-8 sm:p-10 rounded-[48px] shadow-2xl space-y-8 lg:sticky lg:top-24 text-white overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <h3 className="text-2xl font-black font-display text-center uppercase tracking-widest relative z-10">Trip Selection</h3>
                        
                        <div className="space-y-4 relative z-10">
                            <div className="p-5 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                                <div className="flex items-center gap-4 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                    <Calendar className="w-5 h-5" /> Online Booking
                                </div>
                                <p className="text-stone-400 text-sm font-medium leading-relaxed">Select this guide for your next journey and get local insights.</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/guide-booking')} 
                            className="btn-premium w-full py-5 rounded-3xl flex items-center justify-center gap-3 text-lg group relative z-10"
                        >
                            <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Reserve Spot
                        </button>
                        
                        <div className="space-y-5 pt-6 border-t border-white/10 relative z-10">
                            <div className="flex items-center gap-4 text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                                {guide.email}
                            </div>
                            <div className="flex items-center gap-4 text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                                {guide.phone}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideDetail;
