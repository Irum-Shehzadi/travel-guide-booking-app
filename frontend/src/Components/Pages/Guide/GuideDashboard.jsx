import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2,
    AlertCircle, Mail, Phone, Briefcase, Zap, Shield, ChevronRight
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const GuideDashboard = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { navigate('/traveler-signin'); return; }
        if (!authLoading && user && user.type !== 'guide') { navigate('/traveler-dashboard'); return; }
        if (user?.email) fetchBookings();
    }, [user, isAuthenticated, authLoading, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/booking/guide-email/${user.email}`);
            const data = await response.json();
            setBookings(data.bookings || []);
        } catch (err) { setPageError('Unable to load bookings'); } finally { setLoading(false); }
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

    if (authLoading) return <div className="min-h-screen bg-aurora flex items-center justify-center"><Loader2 className="w-10 h-10 text-azure animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-aurora pt-20 sm:pt-24 pb-16 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Profile Header */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-6 sm:p-8 md:p-12 rounded-3xl md:rounded-[40px] border-azure/20 mb-6 sm:mb-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Shield className="w-40 h-40 text-azure" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
                        <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-3xl bg-gradient-to-tr from-azure to-aurora flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg overflow-hidden border-2 border-azure/20">
                            {user?.profile_photo && !imgError ? (
                                <img
                                    src={`${API_BASE_URL}${user.profile_photo}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                user?.name?.charAt(0) || 'G'
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 underline decoration-azure decoration-4 underline-offset-8">Guide Command Center</h1>
                            <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 break-all">
                                <Mail className="w-4 h-4 text-azure shrink-0" /> {user?.email}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {[
                        { label: 'Total Jobs', val: bookings.length, icon: Briefcase, color: 'text-azure' },
                        { label: 'Active', val: bookings.filter(b => b.status === 'confirmed').length, icon: CheckCircle, color: 'text-green-400' },
                        { label: 'New Requests', val: bookings.filter(b => b.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
                        { label: 'Completed', val: bookings.filter(b => b.status === 'completed').length, icon: Shield, color: 'text-blue-400' }
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants} className="glass-card p-6 rounded-3xl border-white/5">
                            <s.icon className={`w-6 h-6 ${s.color} mb-4`} />
                            <div className="text-3xl font-bold text-white mb-1">{s.val}</div>
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Requests List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Zap className="w-6 h-6 text-azure" /> Assignment Queue
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-azure animate-spin" /></div>
                    ) : bookings.length === 0 ? (
                        <div className="glass-panel p-10 sm:p-20 rounded-3xl md:rounded-[40px] text-center">
                            <Calendar className="w-16 h-16 text-white/5 mx-auto mb-6" />
                            <p className="text-xl text-gray-500 font-bold">No active requests found.</p>
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4">
                            {bookings.map((b) => (
                                <motion.div key={b.id} variants={itemVariants} className="glass-panel p-5 sm:p-6 rounded-2xl md:rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-white/5 hover:border-azure/20 transition-all group">
                                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 w-full">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-azure border border-azure/20">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                                <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[150px] sm:max-w-xs">{b.traveler_name}</h3>
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                                    b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                        'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500 font-medium">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-azure shrink-0" /><span className="truncate">{b.destination}</span></span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-azure shrink-0" />{new Date(b.booking_date).toDateString()}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-azure shrink-0" />{b.duration_days} Days</span>
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-azure shrink-0" />{b.contact_phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 sm:mt-6 lg:mt-0 w-full lg:w-auto justify-end">
                                        {actionLoading === b.id ? <Loader2 className="w-5 h-5 text-azure animate-spin" /> : (
                                            <>
                                                {b.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(b.id, 'confirmed')} className="px-5 py-2 bg-azure hover:bg-azure/80 text-white rounded-xl text-xs font-bold transition-all">Confirm</button>
                                                        <button onClick={() => handleStatusUpdate(b.id, 'cancelled')} className="px-5 py-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all border border-red-500/20">Decline</button>
                                                    </>
                                                )}
                                                {b.status === 'confirmed' && (
                                                    <button onClick={() => handleStatusUpdate(b.id, 'completed')} className="px-5 py-2 bg-green-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">Mark Completed</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideDashboard;
