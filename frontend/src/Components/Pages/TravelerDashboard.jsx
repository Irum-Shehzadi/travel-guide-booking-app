import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2,
    AlertCircle, ChevronRight, Mail, Zap, Compass, Trash2
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

const TravelerDashboard = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/traveler-signin');
            return;
        }
        if (!authLoading && user && user.type === 'guide') {
            navigate('/guide-dashboard');
            return;
        }
        if (user?.email) fetchBookings();
    }, [user, isAuthenticated, authLoading, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/booking/traveler/${user.email}`);
            const data = await response.json();
            setBookings(data.bookings || []);
        } catch (err) {
            setError('Unable to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!confirm('Cancel this booking?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/booking/${id}`, { method: 'DELETE' });
            setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
        } catch (err) { alert('Failed to cancel'); }
    };

    if (authLoading) return <div className="min-h-screen bg-aurora flex items-center justify-center"><Loader2 className="w-10 h-10 text-azure animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-aurora pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="glass-panel p-8 md:p-12 rounded-[40px] border-azure/20 mb-10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Compass className="w-40 h-40 text-azure" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-azure to-aurora p-1">
                            <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center text-3xl font-bold text-white">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 underline decoration-azure decoration-4 underline-offset-8">Hello, {user?.name}!</h1>
                            <p className="text-gray-500 font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-azure" /> {user?.email}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Bookings', val: bookings.length, icon: Calendar, color: 'text-azure' },
                        { label: 'Confirmed', val: bookings.filter(b => b.status === 'confirmed').length, icon: CheckCircle, color: 'text-green-400' },
                        { label: 'Pending', val: bookings.filter(b => b.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
                        { label: 'Cancelled', val: bookings.filter(b => b.status === 'cancelled').length, icon: XCircle, color: 'text-red-400' }
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants} className="glass-card p-6 rounded-3xl border-white/5">
                            <s.icon className={`w-6 h-6 ${s.color} mb-4`} />
                            <div className="text-3xl font-bold text-white mb-1">{s.val}</div>
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bookings List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Zap className="w-6 h-6 text-azure" /> Travel Log
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-azure animate-spin" /></div>
                    ) : bookings.length === 0 ? (
                        <div className="glass-panel p-20 rounded-[40px] text-center">
                            <MapPin className="w-16 h-16 text-white/5 mx-auto mb-6" />
                            <p className="text-xl text-gray-500 font-bold mb-8">No journeys logged yet.</p>
                            <button onClick={() => navigate('/pakistan-destinations')} className="btn-premium px-8 py-3">Find a Destination</button>
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4">
                            {bookings.map((b) => (
                                <motion.div key={b.id} variants={itemVariants} className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between border-white/5 hover:border-azure/20 transition-all group">
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-white text-2xl group-hover:bg-azure transition-colors">
                                            {b.guide_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-azure transition-colors">{b.guide_name}</h3>
                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-azure" />{b.destination}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-azure" />{new Date(b.booking_date).toDateString()}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-azure" />{b.duration_days} Days</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto justify-end">
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                                b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-400'
                                            }`}>
                                            {b.status}
                                        </div>
                                        {(b.status === 'pending' || b.status === 'confirmed') && (
                                            <button onClick={() => handleDeleteBooking(b.id)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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

export default TravelerDashboard;
