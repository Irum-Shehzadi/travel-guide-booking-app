import { useState, useEffect } from 'react';
import {
    Users, MapPin, CalendarCheck, Shield, Trash2, CheckCircle, Loader2,
    UserCheck, BarChart3, Mail, Phone, Search, Zap, Trash
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [travelers, setTravelers] = useState([]);
    const [guides, setGuides] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGuide, setSelectedGuide] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'travelers') fetchTravelers();
        if (activeTab === 'guides') fetchGuides();
        if (activeTab === 'bookings') fetchBookings();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
            const data = await res.json();
            setStats(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchTravelers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/travelers`);
            const data = await res.json();
            setTravelers(data.travelers || []);
        } catch (err) { console.error(err); }
    };

    const fetchGuides = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/guides`);
            const data = await res.json();
            setGuides(data.guides || []);
        } catch (err) { console.error(err); }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/bookings`);
            const data = await res.json();
            setBookings(data.bookings || []);
        } catch (err) { console.error(err); }
    };

    const verifyGuide = async (id) => {
        await fetch(`${API_BASE_URL}/api/admin/guide/${id}/verify`, { method: 'PUT' });
        fetchGuides();
        fetchStats();
    };

    const deleteItem = async (type, id) => {
        if (!confirm(`Delete this ${type}?`)) return;
        await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, { method: 'DELETE' });
        if (type === 'traveler') fetchTravelers();
        if (type === 'guide') fetchGuides();
        if (type === 'booking') fetchBookings();
        fetchStats();
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'travelers', label: 'Travelers', icon: Users },
        { id: 'guides', label: 'Guides', icon: MapPin },
        { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-aurora"><Loader2 className="w-12 h-12 text-azure animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-aurora pt-20">
            <div className="max-w-7xl mx-auto px-6 py-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-azure/10 flex items-center justify-center border border-azure/20">
                            <Shield className="w-6 h-6 text-azure" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Command Center</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">System Integrity Management</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Tabs */}
                <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${activeTab === tab.id ? 'bg-azure text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'text-gray-500 hover:text-white glass-panel'
                                }`}>
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'overview' && stats && (
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { label: 'Travelers', val: stats.travelers, icon: Users, color: 'azure' },
                            { label: 'Guides', val: stats.guides, icon: MapPin, color: 'aurora' },
                            { label: 'Bookings', val: stats.bookings?.total, icon: CalendarCheck, color: 'green-400' },
                            { label: 'Verified', val: stats.verified_guides, icon: UserCheck, color: 'blue-400' },
                        ].map((s, i) => (
                            <div key={i} className="glass-card p-6 rounded-3xl border-white/5">
                                <s.icon className={`w-8 h-8 text-${s.color} mb-4`} />
                                <div className="text-4xl font-bold text-white mb-1">{s.val}</div>
                                <div className="text-gray-500 text-xs font-bold uppercase">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'travelers' && (
                    <div className="glass-panel rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300 text-sm">
                                {travelers.map(t => (
                                    <tr key={t.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                                        <td className="px-6 py-4">{t.email}</td>
                                        <td className="px-6 py-4"><span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold">Active</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteItem('traveler', t.id)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div className="grid gap-4">
                        {guides.map(g => (
                            <div key={g.id} className="glass-panel p-6 rounded-3xl flex items-center justify-between border-white/5 group hover:border-azure/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-azure to-aurora flex items-center justify-center font-bold text-white">
                                        {g.fullName?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold">{g.fullName}</span>
                                            {g.is_verified && <CheckCircle className="w-4 h-4 text-azure" />}
                                        </div>
                                        <div className="text-xs text-gray-500 flex gap-4 mt-1">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{g.email}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{g.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setSelectedGuide(g)} className="p-2 text-gray-400 hover:text-white glass-panel rounded-xl transition-all">
                                        <Users className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => verifyGuide(g.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${g.is_verified ? 'bg-azure/10 text-azure' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                                        {g.is_verified ? 'Verified' : 'Verify Now'}
                                    </button>
                                    <button onClick={() => deleteItem('guide', g.id)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Guide Detail Modal */}
                {selectedGuide && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <div className="sticky top-0 p-6 border-b border-white/5 bg-aurora/80 backdrop-blur-md flex items-center justify-between z-10">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-azure" />
                                    Guide Verification Profile
                                </h3>
                                <button onClick={() => setSelectedGuide(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <Zap className="w-6 h-6 rotate-45" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Bio Section */}
                                <div className="flex items-start gap-6">
                                    <img
                                        src={`${API_BASE_URL}${selectedGuide.profile_photo}`}
                                        alt={selectedGuide.fullName}
                                        className="w-24 h-24 rounded-2xl object-cover border-2 border-azure/20 shadow-lg"
                                        onerror={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + selectedGuide.fullName}
                                    />
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-1">{selectedGuide.fullName}</h2>
                                        <p className="text-azure text-sm font-medium mb-3">{selectedGuide.experience} Years Experience • {selectedGuide.city}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedGuide.specializations?.map(s => (
                                                <span key={s} className="px-2 py-1 bg-white/5 text-gray-400 rounded-md text-[10px] font-bold uppercase">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-white font-bold mb-4 border-l-4 border-azure pl-4">
                                        Identity Verification Data
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="glass-card p-4 rounded-2xl border-white/5">
                                            <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-widest">CNIC / ID Number</div>
                                            <div className="text-lg font-mono text-white flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-green-400" />
                                                {selectedGuide.cnic_number || 'Not Provided'}
                                            </div>
                                        </div>

                                        <div className="glass-card p-4 rounded-2xl border-white/5">
                                            <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-widest">Contact Identity</div>
                                            <div className="text-white font-medium flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm"><Mail className="w-3 h-3 text-azure" />{selectedGuide.email}</div>
                                                <div className="flex items-center gap-2 text-sm mt-1"><Phone className="w-3 h-3 text-azure" />{selectedGuide.phone}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card p-2 rounded-2xl border-white/5 overflow-hidden">
                                        <div className="px-4 pt-4 pb-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">CNIC Attachment</div>
                                        {selectedGuide.cnic_photo ? (
                                            <div className="p-2">
                                                <img
                                                    src={`${API_BASE_URL}${selectedGuide.cnic_photo}`}
                                                    alt="CNIC Document"
                                                    className="w-full rounded-xl border border-white/5 hover:scale-[1.02] transition-transform cursor-zoom-in"
                                                    onClick={() => window.open(`${API_BASE_URL}${selectedGuide.cnic_photo}`, '_blank')}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-48 flex flex-col items-center justify-center text-gray-500 italic bg-white/5 rounded-xl m-2 border border-dashed border-white/10">
                                                <Shield className="w-12 h-12 mb-2 opacity-20" />
                                                No ID image provided
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => { verifyGuide(selectedGuide.id); setSelectedGuide(null); }}
                                        className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${selectedGuide.is_verified ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-azure text-white shadow-lg shadow-azure/20 hover:scale-[1.02]'}`}
                                    >
                                        {selectedGuide.is_verified ? (
                                            <><Trash className="w-5 h-5" /> Revoke Verification</>
                                        ) : (
                                            <><CheckCircle className="w-5 h-5" /> Approve & Verify Identity</>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setSelectedGuide(null)}
                                        className="px-8 py-4 glass-panel text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="glass-panel rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Traveler</th>
                                    <th className="px-6 py-4">Guide</th>
                                    <th className="px-6 py-4">Destination</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300 text-sm">
                                {bookings.map(b => (
                                    <tr key={b.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white font-bold">{b.traveler_name}</td>
                                        <td className="px-6 py-4">{b.guide_name}</td>
                                        <td className="px-6 py-4 text-azure font-medium">{b.destination}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-azure/10 text-azure rounded-full text-[10px] font-bold uppercase">{b.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteItem('booking', b.id)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
