import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
    AlertTriangle, Shield, ShieldAlert, ShieldCheck, 
    User, MapPin, Clock, Search, Filter, 
    MoreVertical, CheckCircle2, XCircle, AlertCircle,
    Loader2, MessageSquare, ExternalLink, Calendar,
    Flag, Trash2, Ban, UserCheck
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, warned, blocked, permanent, dismissed
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/complaints`);
            const data = await response.json();
            setComplaints(data.complaints || []);
        } catch (err) {
            console.error("Error fetching complaints:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (complaintId, action) => {
        if (!adminNote && action !== 'dismiss') {
            toast.error("Please add an admin note for this action.");
            return;
        }

        setIsActionLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/complaint/${complaintId}/action`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, admin_note: adminNote })
            });

            if (response.ok) {
                toast.success(`Action ${action} taken successfully!`);
                setAdminNote('');
                setSelectedComplaint(null);
                fetchComplaints();
            } else {
                const error = await response.json();
                toast.error(error.detail || "Failed to take action");
            }
        } catch (err) {
            console.error("Error taking action:", err);
            toast.error("Connection error");
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesFilter = filter === 'all' || c.status === filter;
        const matchesSearch = c.guide_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.traveler_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.destination.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'warned': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'blocked': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'permanent': return 'bg-red-100 text-red-700 border-red-200';
            case 'dismissed': return 'bg-stone-100 text-stone-500 border-stone-200';
            default: return 'bg-stone-100 text-stone-700 border-stone-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'warned': return <AlertCircle className="w-3 h-3" />;
            case 'blocked': return <ShieldAlert className="w-3 h-3" />;
            case 'permanent': return <Ban className="w-3 h-3" />;
            case 'dismissed': return <CheckCircle2 className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Flag className="w-8 h-8 text-red-500" />
                            Guide Complaints
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Review traveler reports and take disciplinary actions.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {['pending', 'warned', 'blocked', 'permanent', 'all'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                                    filter === f 
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-3 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search by guide, traveler or destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between px-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reports</p>
                            <p className="text-2xl font-black text-slate-900">{complaints.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Complaints List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                        <Loader2 className="w-10 h-10 text-slate-300 animate-spin mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching Reports...</p>
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm text-center px-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No reports found</h3>
                        <p className="text-slate-500 text-sm mt-2">Everything is clean! No {filter !== 'all' ? filter : ''} complaints to show.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredComplaints.map((c) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={c.id}
                                className={`bg-white border rounded-[32px] p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 group ${
                                    selectedComplaint?.id === c.id ? 'border-slate-900 ring-4 ring-slate-900/5' : 'border-slate-100'
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Left Side: Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(c.status)}`}>
                                                {getStatusIcon(c.status)}
                                                {c.status}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl">
                                                {c.guide_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 leading-tight">
                                                    {c.guide_name} 
                                                    <span className="text-slate-400 font-medium text-xs ml-2 uppercase tracking-widest block lg:inline">Reported by {c.traveler_name}</span>
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-red-500" /> {c.destination}</span>
                                                    <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-blue-500" /> Guide ID: {c.guide_id.substring(0,8)}...</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4">
                                            <p className="text-slate-900 font-black text-sm mb-1 uppercase tracking-tight">{c.reason}</p>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{c.description}"</p>
                                        </div>
                                        
                                        {c.admin_note && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <ShieldCheck className="w-3 h-3" /> Admin Note
                                                </p>
                                                <p className="text-blue-800 text-xs font-bold leading-relaxed">"{c.admin_note}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side: Actions */}
                                    {c.status === 'pending' && (
                                        <div className="lg:w-80 flex flex-col gap-2 pt-2 border-t lg:border-t-0 lg:border-l lg:pl-6 border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Take Action</p>
                                            
                                            {selectedComplaint && (selectedComplaint.id === c.id || selectedComplaint._id === c.id) ? (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="space-y-3"
                                                >
                                                    <textarea 
                                                        placeholder="Add note for the guide..."
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/5 resize-none"
                                                        rows="3"
                                                        value={adminNote}
                                                        onChange={(e) => setAdminNote(e.target.value)}
                                                    ></textarea>
                                                    
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button 
                                                            disabled={isActionLoading}
                                                            onClick={() => handleAction(c.id, 'warn')}
                                                            className="bg-blue-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                        >
                                                            Warn
                                                        </button>
                                                        <button 
                                                            disabled={isActionLoading}
                                                            onClick={() => handleAction(c.id, 'block_week')}
                                                            className="bg-orange-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-colors disabled:opacity-50"
                                                        >
                                                            1 Week
                                                        </button>
                                                        <button 
                                                            disabled={isActionLoading}
                                                            onClick={() => handleAction(c.id, 'permanent_block')}
                                                            className="bg-red-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 col-span-2"
                                                        >
                                                            Permanent Block
                                                        </button>
                                                        <button 
                                                            onClick={() => setSelectedComplaint(null)}
                                                            className="bg-slate-100 text-slate-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors col-span-2"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            console.log("Selected Complaint:", c);
                                                            setSelectedComplaint(c);
                                                        }}
                                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg active:scale-[0.98]"
                                                    >
                                                        Review & Act <ExternalLink className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(c.id, 'dismiss')}
                                                        className="w-full bg-slate-50 text-slate-400 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all"
                                                    >
                                                        Dismiss Report
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;
