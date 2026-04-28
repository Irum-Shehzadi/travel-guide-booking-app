import React, { useState, useEffect, useRef } from 'react';
import {
    Users, MapPin, CalendarCheck, Shield, Trash2, CheckCircle, Loader2,
    UserCheck, BarChart3, Mail, Phone, Search, Zap, Trash, Menu, X, LogOut, ChevronRight, Bell, MessageSquare, Star, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.svg";
import NotificationDropdown from '../../NotificationDropdown';

const API_BASE_URL = "http://localhost:8000";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [travelers, setTravelers] = useState([]);
    const [guides, setGuides] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [guideReviews, setGuideReviews] = useState([]);
    const [destinationReviews, setDestinationReviews] = useState([]);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [chatsLoading, setChatsLoading] = useState(false);
    const chatSocketRef = useRef(null);
    const chatEndRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'travelers') fetchTravelers();
        if (activeTab === 'guides') fetchGuides();
        if (activeTab === 'bookings') fetchBookings();
        if (activeTab === 'guide_reviews') fetchGuideReviews();
        if (activeTab === 'destination_reviews') fetchDestinationReviews();
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'chats') {
            fetchConversations();
            connectChatWS();
        } else if (chatSocketRef.current) {
            chatSocketRef.current.close();
        }
        return () => { if (chatSocketRef.current) chatSocketRef.current.close(); };
    }, [activeTab]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]);

    const connectChatWS = () => {
        const socket = new WebSocket(`ws://localhost:8000/api/chat/ws/admin`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (selectedChat && (data.sender_email === selectedChat.email || data.receiver_email === selectedChat.email)) {
                setChatHistory(prev => [...prev, data]);
            }
            fetchConversations(); // Refresh list to show last message
        };
        chatSocketRef.current = socket;
    };

    const fetchConversations = async () => {
        try {
            setChatsLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/chat/conversations`);
            const data = await res.json();
            setConversations(data.conversations || []);
        } catch (err) { console.error(err); } finally { setChatsLoading(false); }
    };

    const fetchChatHistory = async (userEmail) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/chat/history/${userEmail}?other_email=admin`);
            const data = await res.json();
            setChatHistory(data.messages || []);
        } catch (err) { console.error(err); }
    };

    const sendChatMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !selectedChat || !chatSocketRef.current) return;

        const payload = {
            receiver_email: selectedChat.email,
            message: chatInput,
            sender_name: "Admin Support",
            sender_role: "admin"
        };
        chatSocketRef.current.send(JSON.stringify(payload));
        setChatInput("");
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
            if (!res.ok) throw new Error("Failed to fetch stats");
            const data = await res.json();
            setStats(data);
        } catch (err) { 
            console.error("Stats fetch error:", err);
            // Fallback stats if server is momentarily unreachable
            setStats({
                travelers: 0, guides: 0, verified_guides: 0, unverified_guides: 0,
                bookings: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
                contacts: { total: 0, unread: 0 }
            });
        } finally { 
            setLoading(false); 
        }
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

    const fetchGuideReviews = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/review/all`);
            const data = await res.json();
            setGuideReviews(data.reviews || []);
        } catch (err) { console.error(err); }
    };

    const fetchDestinationReviews = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/review/destination-all/list`);
            const data = await res.json();
            setDestinationReviews(data.reviews || []);
        } catch (err) { console.error(err); }
    };
    
    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/contact/all`);
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) { console.error(err); }
    };

    const verifyGuide = async (id) => {
        await fetch(`${API_BASE_URL}/api/admin/guide/${id}/verify`, { method: 'PUT' });
        fetchGuides();
        fetchStats();
    };

    const deleteItem = async (type, id) => {
        if (!window.confirm(`Are you extremely certain you want to delete this ${type}? This action is irreversible.`)) return;
        await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, { method: 'DELETE' });
        if (type === 'traveler') fetchTravelers();
        if (type === 'guide') fetchGuides();
        if (type === 'booking') fetchBookings();
        if (type === 'destination_review') fetchDestinationReviews();
        if (type === 'message') fetchMessages();
        fetchStats();
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedMessage) return;
        
        try {
            const res = await fetch(`${API_BASE_URL}/api/contact/${selectedMessage.id}/reply`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply: replyText })
            });
            if (res.ok) {
                fetchMessages();
                setSelectedMessage(null);
                setReplyText('');
            }
        } catch (err) { console.error(err); }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const tabs = [
        { id: 'overview', label: 'Command Center', icon: BarChart3 },
        { id: 'travelers', label: 'Traveler Log', icon: Users },
        { id: 'guides', label: 'Guide Roster', icon: MapPin },
        { id: 'bookings', label: 'Trips & Bookings', icon: CalendarCheck },
        { id: 'destination_reviews', label: 'Dest. Reviews', icon: Star },
        { id: 'guide_reviews', label: 'Guide Reviews', icon: Star },
        { id: 'chats', label: 'Chat Hub', icon: MessageSquare },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-14 h-14 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-stone-50 text-stone-600 overflow-hidden font-sans relative">
            {/* Ambient Background Elements for Light Mode */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3 z-0" />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-stone-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Brand Logo */}
                <div className="h-24 flex items-center justify-center border-b border-stone-100 px-6 shrink-0 bg-stone-50/50">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                        <span className="text-xl font-black text-stone-900 tracking-wide">
                            Travel<span className="text-emerald-600">Guide</span>
                        </span>
                    </div>
                </div>

                {/* Info Tab */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-4">Administration</p>
                    <nav className="space-y-2">
                        {tabs.map(tab => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <tab.icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-stone-400 group-hover:text-stone-600 transition-colors'}`} />
                                        <span className={`font-bold text-sm ${active ? 'text-emerald-800' : ''}`}>{tab.label}</span>
                                    </div>
                                    {active && <ChevronRight className="w-4 h-4 text-emerald-600 opacity-70" />}
                                </button>
                            );
                        })}
                    </nav>
                    
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-4 mt-8">External Views</p>
                    <div className="space-y-2">
                        <button 
                            onClick={() => navigate('/traveler-dashboard')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all border border-transparent"
                        >
                            <Users className="w-5 h-5 opacity-60" />
                            <span className="font-bold text-sm">Traveler View</span>
                        </button>
                        <button 
                            onClick={() => navigate('/guide-dashboard')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-500 hover:text-cyan-700 hover:bg-cyan-50 transition-all border border-transparent"
                        >
                            <MapPin className="w-5 h-5 opacity-60" />
                            <span className="font-bold text-sm">Guide View</span>
                        </button>
                    </div>
                </div>

                {/* Profile Widget Bottom */}
                <div className="p-6 border-t border-stone-100 bg-stone-50 shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black border border-emerald-200">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="text-sm font-black text-stone-900 leading-none truncate w-32">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mt-1">Super Admin</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors border border-transparent hover:border-red-100" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Layout Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="h-24 px-6 sm:px-10 flex items-center justify-between bg-white border-b border-stone-200 shrink-0 shadow-sm z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-600 lg:hidden hover:bg-stone-100 transition">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:flex relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-emerald-600 transition-colors" />
                            <input type="text" placeholder="Search system logs..." className="bg-stone-50 border border-stone-200 rounded-full py-2.5 pl-11 pr-5 text-sm w-64 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all text-stone-900 font-medium placeholder-stone-400 shadow-inner" />
                        </div>
                        <div className="z-[999]">
                            <NotificationDropdown />
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-6xl mx-auto"
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 sm:space-y-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Active Travelers', val: stats.travelers, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', tab: 'travelers' },
                                            { label: 'Registered Guides', val: stats.guides, icon: MapPin, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', tab: 'guides' },
                                            { label: 'Total Bookings', val: stats.bookings?.total || 0, icon: CalendarCheck, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', tab: 'bookings' },
                                            { label: 'Verified Experts', val: stats.verified_guides, icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', tab: 'guides' },
                                        ].map((s, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setActiveTab(s.tab)}
                                                className={`bg-white p-6 sm:p-8 rounded-[32px] border ${s.border} relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer shadow-sm hover:shadow-lg`}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-6 relative z-10 border ${s.border}`}>
                                                    <s.icon className={`w-6 h-6 ${s.color}`} />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="text-5xl font-black text-stone-900 mb-2">{s.val}</div>
                                                    <div className="text-stone-400 text-xs font-black uppercase tracking-widest">{s.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-stone-200 relative overflow-hidden shadow-sm">
                                        <div className="absolute top-0 right-0 p-8 text-stone-100"><Zap className="w-64 h-64" /></div>
                                        <h2 className="text-2xl font-black text-stone-900 mb-4 relative z-10 flex items-center gap-3"><span className="w-2 h-8 bg-emerald-500 rounded-full" /> System Status</h2>
                                        <p className="text-stone-500 max-w-2xl leading-relaxed relative z-10 font-medium text-lg">
                                            All systems operational. The platform currently manages <strong className="text-emerald-600">{stats.travelers}</strong> combined travelers and <strong className="text-emerald-600">{stats.guides}</strong> local guides, facilitating a total of <strong className="text-emerald-600">{stats.bookings?.total || 0}</strong> secure interactions.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* TRAVELERS TAB */}
                            {activeTab === 'travelers' && (
                                <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-stone-200 overflow-hidden flex flex-col shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-3"><Users className="w-5 h-5 text-emerald-600 bg-emerald-50 p-1 rounded-md" /> Registered Travelers</h2>
                                        <span className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-inner">{travelers.length} Users</span>
                                    </div>
                                    <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8 custom-scrollbar">
                                        <table className="w-full text-left min-w-[600px] border-collapse">
                                            <thead>
                                                <tr className="border-b border-stone-100">
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest pl-2">Client Details</th>
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest">Network Status</th>
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest text-right pr-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {travelers.map((t, idx) => (
                                                    <tr key={t.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors group">
                                                        <td className="py-5 pl-2">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-black text-stone-700 border border-stone-200">{t.name.charAt(0)}</div>
                                                                <div>
                                                                    <div className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition-colors">{t.name}</div>
                                                                    <div className="text-xs text-stone-500 font-medium mt-0.5">{t.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 align-middle">
                                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active Node
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-right pr-2">
                                                            <button onClick={() => deleteItem('traveler', t.id)} className="p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {travelers.length === 0 && (
                                                    <tr><td colSpan="3" className="py-12 text-center text-stone-500 text-sm font-medium">No travelers registered in the system yet.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* GUIDES TAB */}
                            {activeTab === 'guides' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[32px] border border-stone-200 shadow-sm">
                                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-3"><MapPin className="w-5 h-5 text-cyan-600 bg-cyan-50 p-1 rounded-md" /> Guide Roster</h2>
                                        <span className="px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-cyan-100 shadow-inner">{guides.length} Personnel</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {guides.map(g => (
                                            <div key={g.id} className="bg-white p-6 sm:p-8 rounded-[32px] border border-stone-200 flex flex-col relative overflow-hidden group hover:border-emerald-300 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                                <div className="flex items-start gap-5 mb-6 relative z-10">
                                                    <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center font-black text-cyan-700 text-2xl shrink-0 border border-cyan-100 relative shadow-sm">
                                                        {g.fullName?.charAt(0)}
                                                        {g.is_verified && <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100"><CheckCircle className="w-4 h-4 text-emerald-500" /></div>}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-lg font-black text-stone-900 truncate group-hover:text-emerald-700 transition-colors">{g.fullName}</h3>
                                                        <p className="text-[11px] text-stone-500 font-bold uppercase tracking-widest mt-1 truncate flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-500" />{g.city}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-8 flex-1 relative z-10">
                                                    <div className="flex items-center gap-3 text-xs text-stone-600 font-medium bg-stone-50 py-2.5 px-3 rounded-xl border border-stone-100">
                                                        <Mail className="w-3.5 h-3.5 text-stone-400" /> <span className="truncate">{g.email}</span>
                                                    </div>
                                                    {g.phone && (
                                                        <div className="flex items-center gap-3 text-xs text-stone-600 font-medium bg-stone-50 py-2.5 px-3 rounded-xl border border-stone-100">
                                                            <Phone className="w-3.5 h-3.5 text-stone-400" /> <span>{g.phone}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 mt-auto pt-4 border-t border-stone-100 relative z-10 w-full">
                                                    <button onClick={() => setSelectedGuide(g)} className="flex-1 py-3 bg-stone-50 hover:bg-stone-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-stone-700 transition-colors border border-stone-200 flex items-center justify-center gap-2 shadow-sm">
                                                        <Search className="w-4 h-4" /> Inspect
                                                    </button>
                                                    <button onClick={() => deleteItem('guide', g.id)} className="w-12 shrink-0 py-3 bg-white border border-stone-200 rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center shadow-sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {!g.is_verified && (
                                                    <button onClick={() => verifyGuide(g.id)} className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-emerald-50 hover:text-emerald-700 border border-amber-200 hover:border-emerald-200 transition-all text-[9px] font-black uppercase tracking-[0.2em] hidden group-hover:block z-20 shadow-sm">
                                                        Verify
                                                    </button>
                                                )}
                                                {!g.is_verified && (
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-400/50" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {guides.length === 0 && (
                                        <div className="bg-white p-16 rounded-[40px] border border-stone-200 flex flex-col items-center justify-center text-center shadow-sm">
                                            <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center mb-6 border border-stone-100">
                                                <MapPin className="w-8 h-8 text-stone-300" />
                                            </div>
                                            <h3 className="text-xl font-black text-stone-900 mb-2">No Guides Enrolled</h3>
                                            <p className="text-stone-500 max-w-sm font-medium">There are currently no travel guides registered in the database.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* BOOKINGS TAB */}
                            {activeTab === 'bookings' && (
                                <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-stone-200 overflow-hidden flex flex-col shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-3"><CalendarCheck className="w-5 h-5 text-amber-500 bg-amber-50 p-1 rounded-md" /> Transaction Ledger</h2>
                                        <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-inner">{bookings.length} Trips</span>
                                    </div>
                                    <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8 custom-scrollbar">
                                        <table className="w-full text-left min-w-[700px] border-collapse">
                                            <thead>
                                                <tr className="border-b border-stone-100">
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest pl-2">Contract ID</th>
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest">Traveler Client</th>
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest">Assigned Guide</th>
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest">Target Destination</th>
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest">State</th>
                                                    <th className="pb-4 text-[10px] text-stone-400 font-black uppercase tracking-widest text-right pr-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {bookings.map((b, idx) => (
                                                    <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors group">
                                                        <td className="py-5 pl-2 font-mono text-[10px] text-stone-400 bg-stone-50 px-2 rounded-lg border border-stone-100 inline-block mt-3">CTX-{b.id.toString().padStart(4, '0')}</td>
                                                        <td className="py-5 font-bold text-stone-900">{b.traveler_name}</td>
                                                        <td className="py-5 text-stone-600 font-medium">{b.guide_name}</td>
                                                        <td className="py-5 font-bold text-emerald-700"><div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{b.destination}</div></td>
                                                        <td className="py-5 align-middle">
                                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${b.status?.toLowerCase() === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                b.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                                }`}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 text-right pr-2">
                                                            <button onClick={() => deleteItem('booking', b.id)} className="p-2.5 bg-white text-stone-400 hover:bg-red-50 hover:text-red-500 border border-stone-200 hover:border-red-200 rounded-xl transition-all shadow-sm">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {bookings.length === 0 && (
                                                    <tr><td colSpan="6" className="py-12 text-center text-stone-500 text-sm font-medium">Transaction ledger is currently empty.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* DESTINATION REVIEWS TAB */}
                            {activeTab === 'destination_reviews' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[32px] border border-stone-200 shadow-sm">
                                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-3"><MessageSquare className="w-5 h-5 text-indigo-500 bg-indigo-50 p-1 rounded-md" /> Destination Feedback</h2>
                                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-inner">{destinationReviews.length} Reviews</span>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {destinationReviews.map(review => (
                                            <div key={review.id} className="bg-white p-6 sm:p-8 rounded-[32px] border border-stone-200 flex flex-col relative overflow-hidden group hover:border-indigo-300 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                                <div className="flex items-center justify-between mb-6 relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-700 text-lg border border-indigo-100 shadow-sm">
                                                            {review.traveler_name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-stone-900 text-base">{review.traveler_name}</div>
                                                            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{new Date(review.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100 shadow-inner">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-stone-300"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 text-sm text-stone-600 font-medium italic mb-6 relative z-10 min-h-[80px]">
                                                    "{review.comment}"
                                                </div>
                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-stone-800">{review.destination_name}</span>
                                                    </div>
                                                    <button onClick={() => deleteItem('destination_review', review.id)} className="p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm" title="Delete Review">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {destinationReviews.length === 0 && (
                                        <div className="bg-white p-16 rounded-[40px] border border-stone-200 flex flex-col items-center justify-center text-center shadow-sm">
                                            <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center mb-6 border border-stone-100">
                                                <MessageSquare className="w-8 h-8 text-stone-300" />
                                            </div>
                                            <h3 className="text-xl font-black text-stone-900 mb-2">No Reviews Found</h3>
                                            <p className="text-stone-500 max-w-sm font-medium">No destination reviews exist in the system yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* GUIDE REVIEWS TAB */}
                            {activeTab === 'guide_reviews' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[32px] border border-stone-200 shadow-sm">
                                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-3"><Star className="w-5 h-5 text-amber-500 bg-amber-50 p-1 rounded-md" /> Guide Reviews</h2>
                                        <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-inner">{guideReviews.length} Reviews</span>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {guideReviews.map(review => (
                                            <div key={review.id} className="bg-white p-6 sm:p-8 rounded-[32px] border border-stone-200 flex flex-col relative overflow-hidden group hover:border-amber-300 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                                <div className="flex items-center justify-between mb-4 relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center font-black text-amber-700 text-lg border border-amber-100 shadow-sm">
                                                            {review.traveler_name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-stone-900 text-base">{review.traveler_name}</div>
                                                            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{new Date(review.created_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100 shadow-inner">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-stone-300"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 text-sm text-stone-600 font-medium italic mb-4 relative z-10 min-h-[60px]">
                                                    "{review.comment}"
                                                </div>
                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-cyan-600" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-stone-800">{review.guide_name || 'Unknown Guide'}</span>
                                                    </div>
                                                    <button onClick={() => deleteItem('guide_review', review.id)} className="p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm" title="Delete Review">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {guideReviews.length === 0 && (
                                        <div className="bg-white p-16 rounded-[40px] border border-stone-200 flex flex-col items-center justify-center text-center shadow-sm">
                                            <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center mb-6 border border-stone-100">
                                                <Star className="w-8 h-8 text-stone-300" />
                                            </div>
                                            <h3 className="text-xl font-black text-stone-900 mb-2">No Guide Reviews Yet</h3>
                                            <p className="text-stone-500 max-w-sm font-medium">No reviews have been submitted for guides yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* CHAT HUB TAB */}
                            {activeTab === 'chats' && (
                                <div className="bg-white rounded-[40px] border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px]">
                                    {/* Sidebar */}
                                    <div className="w-full md:w-[350px] border-r border-stone-100 flex flex-col bg-stone-50/30">
                                        <div className="p-8 border-b border-stone-100 bg-white">
                                            <h2 className="text-xl font-black text-stone-900 flex items-center gap-3">
                                                <MessageSquare className="w-6 h-6 text-emerald-600" /> Active Chats
                                            </h2>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            {conversations.length === 0 ? (
                                                <div className="p-10 text-center opacity-30 italic text-sm">No active discussions</div>
                                            ) : (
                                                conversations.map(conv => (
                                                    <button
                                                        key={conv.email}
                                                        onClick={() => { setSelectedChat(conv); fetchChatHistory(conv.email); }}
                                                        className={`w-full p-6 text-left border-b border-stone-50 transition-all flex items-center gap-4 ${selectedChat?.email === conv.email ? 'bg-white shadow-md border-emerald-100 relative z-10' : 'hover:bg-white/50'}`}
                                                    >
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-sm ${conv.sender_role === 'guide' ? 'bg-cyan-500' : 'bg-emerald-600'}`}>
                                                            {conv.sender_name?.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-black text-stone-900 truncate">{conv.sender_name}</span>
                                                                <span className="text-[8px] font-black uppercase text-stone-400">{new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <p className="text-xs text-stone-500 truncate font-medium">{conv.last_message}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Chat Pane */}
                                    <div className="flex-1 flex flex-col bg-white">
                                        {selectedChat ? (
                                            <>
                                                {/* Pane Header */}
                                                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white shadow-sm relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm ${selectedChat.sender_role === 'guide' ? 'bg-cyan-500' : 'bg-emerald-600'}`}>
                                                            {selectedChat.sender_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-stone-900 tracking-tight">{selectedChat.sender_name}</h3>
                                                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">{selectedChat.sender_role} • {selectedChat.email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Messages Area */}
                                                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-stone-50/50 custom-scrollbar">
                                                    {chatHistory.map((msg, i) => {
                                                        const isAdmin = msg.sender_role === 'admin';
                                                        return (
                                                            <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                                <div className={`max-w-[70%] p-5 rounded-[24px] shadow-sm relative ${isAdmin ? 'bg-stone-900 text-white rounded-tr-none' : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'}`}>
                                                                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                                                    <span className="text-[9px] mt-2 block opacity-40 font-black uppercase tracking-widest">
                                                                        {new Date(msg.created_at).toLocaleTimeString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    <div ref={chatEndRef} />
                                                </div>

                                                {/* Send Box */}
                                                <form onSubmit={sendChatMessage} className="p-6 bg-white border-t border-stone-100 flex items-center gap-4">
                                                    <input
                                                        type="text"
                                                        value={chatInput}
                                                        onChange={(e) => setChatInput(e.target.value)}
                                                        placeholder="Type a response..."
                                                        className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-lg active:scale-95"
                                                    >
                                                        <Send className="w-5 h-5" />
                                                    </button>
                                                </form>
                                            </>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
                                                <MessageSquare className="w-20 h-20 mb-6 text-stone-200" />
                                                <h3 className="text-2xl font-black text-stone-900">Select a Conversation</h3>
                                                <p className="max-w-xs mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Select a traveler or guide from the left to start live communication</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Guide Detail Modal (Light Theme version) */}
            <AnimatePresence>
                {selectedGuide && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", bounce: 0.3 }}
                            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] border border-stone-200 shadow-2xl flex flex-col custom-scrollbar"
                        >
                            <div className="sticky top-0 p-6 sm:p-8 border-b border-stone-100 bg-white/95 backdrop-blur-md flex items-center justify-between z-20 shadow-sm">
                                <h3 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-3 tracking-tight">
                                    <Shield className="w-6 h-6 text-emerald-600" /> Profile Inspector
                                </h3>
                                <button onClick={() => setSelectedGuide(null)} className="p-2.5 bg-stone-50 border border-stone-200 text-stone-400 hover:bg-stone-100 hover:text-stone-900 rounded-xl transition-colors shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 sm:p-10 space-y-8 lg:space-y-12 shrink-0 bg-stone-50">
                                {/* Bio Section */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left bg-white p-8 rounded-[32px] border border-stone-200 shadow-sm">
                                    <img
                                        src={`${API_BASE_URL}${selectedGuide.profile_photo}`}
                                        alt={selectedGuide.fullName}
                                        className="w-32 h-32 rounded-[28px] object-cover border-4 border-emerald-50 shadow-md bg-stone-100"
                                        onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + selectedGuide.fullName + '&background=0ea5e9&color=fff&size=128'}
                                    />
                                    <div className="flex-1 mt-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-xl text-[10px] font-black text-stone-500 border border-stone-200 uppercase tracking-widest mb-3 shadow-inner">
                                            ID: GDE-{selectedGuide.id}
                                        </div>
                                        <h2 className="text-3xl font-black text-stone-900 mb-2">{selectedGuide.fullName}</h2>
                                        <p className="text-emerald-700 text-sm font-bold flex items-center justify-center sm:justify-start gap-2 mb-4">
                                            <span>{selectedGuide.experience} Yrs Exp</span> • <span>{selectedGuide.city} Area</span>
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                            {selectedGuide.specializations?.map(s => (
                                                <span key={s} className="px-3 py-1.5 bg-stone-50 border border-stone-200 text-stone-600 rounded-xl text-xs font-bold uppercase tracking-wide">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Deep Verification View */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-stone-900 font-bold mb-6">
                                        <div className="h-px bg-stone-200 flex-1" />
                                        <span className="uppercase tracking-widest text-[10px] font-black text-stone-400 bg-white px-4 py-1.5 rounded-full border border-stone-200 shadow-sm">Security & Intel</span>
                                        <div className="h-px bg-stone-200 flex-1" />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-stone-200 shadow-sm hover:border-emerald-300 transition-colors group">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                                <Shield className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-[10px] text-stone-400 font-black uppercase mb-1.5 tracking-widest">Official CNIC / Govt ID</div>
                                            <div className="text-xl font-black font-mono text-stone-900 tracking-wider bg-stone-50 py-2 px-3 rounded-xl border border-stone-100 inline-block">{selectedGuide.cnic_number || 'UNVERIFIED'}</div>
                                        </div>

                                        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-stone-200 shadow-sm hover:border-cyan-300 transition-colors group">
                                            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                                <UserCheck className="w-6 h-6 text-cyan-600" />
                                            </div>
                                            <div className="text-[10px] text-stone-400 font-black uppercase mb-1.5 tracking-widest">Contact Identity</div>
                                            <div className="space-y-2 mt-3">
                                                <div className="flex items-center gap-3 text-sm font-bold text-stone-700 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-100"><Mail className="w-4 h-4 text-stone-400" />{selectedGuide.email}</div>
                                                <div className="flex items-center gap-3 text-sm font-bold text-stone-700 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-100"><Phone className="w-4 h-4 text-stone-400" />{selectedGuide.phone}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-[32px] border border-stone-200 shadow-sm overflow-hidden">
                                        <div className="px-5 pt-3 pb-4 text-[10px] text-stone-500 font-black uppercase tracking-widest flex justify-between items-center border-b border-stone-100 mb-4">
                                            <span>Document Scan (CNIC)</span>
                                            <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Click to Expand</span>
                                        </div>
                                        {selectedGuide.cnic_photo ? (
                                            <div className="bg-stone-50 rounded-[24px] p-3 border border-stone-100 overflow-hidden">
                                                <img
                                                    src={`${API_BASE_URL}${selectedGuide.cnic_photo}`}
                                                    alt="CNIC Document"
                                                    className="w-full h-auto object-cover rounded-[20px] shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in"
                                                    onClick={() => window.open(`${API_BASE_URL}${selectedGuide.cnic_photo}`, '_blank')}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-48 flex flex-col items-center justify-center text-stone-400 font-bold bg-stone-50 rounded-[24px] border-2 border-dashed border-stone-200">
                                                <Shield className="w-10 h-10 mb-3 opacity-20" />
                                                Visual Evidence Missing
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-8 shrink-0">
                                    <button
                                        onClick={() => { verifyGuide(selectedGuide.id); setSelectedGuide(null); }}
                                        className={`flex-1 py-4 sm:py-5 rounded-[20px] font-black text-xs sm:text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-md
                                            ${selectedGuide.is_verified
                                                ? 'bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300'
                                                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1'}`}
                                    >
                                        {selectedGuide.is_verified ? (
                                            <><Trash className="w-5 h-5" /> Revoke Clearance</>
                                        ) : (
                                            <><CheckCircle className="w-5 h-5" /> Authorize & Verify</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;
