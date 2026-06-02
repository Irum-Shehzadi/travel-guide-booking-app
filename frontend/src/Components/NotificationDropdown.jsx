import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, CalendarCheck, Star, Shield, Zap, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const typeIcons = {
    booking_new: CalendarCheck,
    booking_confirmed: Check,
    booking_cancelled: X,
    booking_completed: Star,
    review_received: Star,
    guide_verified: Shield,
    system: Zap,
};

const typeColors = {
    booking_new: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    booking_confirmed: 'text-green-600 bg-green-50 border-green-200',
    booking_cancelled: 'text-red-500 bg-red-50 border-red-200',
    booking_completed: 'text-purple-600 bg-purple-50 border-purple-200',
    review_received: 'text-amber-500 bg-amber-50 border-amber-200',
    guide_verified: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    system: 'text-stone-500 bg-stone-100 border-stone-200',
};

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

export default function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Map notification links to admin dashboard tabs
    const adminTabMap = {
        '/admin/guides': 'guides',
        '/admin/bookings': 'bookings',
        '/admin/complaints': 'complaints',
        '/admin/chats': 'chats',
        '/admin/travelers': 'travelers',
        '/admin/reviews': 'guide_reviews',
        '/admin/messages': 'chats',
    };

    const handleNotifClick = (notif) => {
        if (!notif.is_read) markAsRead(notif.id);
        if (notif.link) {
            // Check if it's an admin dashboard tab link
            const tabId = adminTabMap[notif.link];
            if (tabId) {
                navigate(`/admin-dashboard?tab=${tabId}`);
            } else if (notif.link === '/admin-dashboard') {
                navigate('/admin-dashboard');
            } else {
                navigate(notif.link);
            }
            setOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all group shadow-sm"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 group-hover:animate-[wiggle_0.5s_ease-in-out]" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-red-500/30"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-3 w-96 max-w-[92vw] bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/50 z-[999] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-black text-stone-900 tracking-tight">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-emerald-50"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Read all
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-[400px] overflow-y-auto hide-scrollbar divide-y divide-stone-100">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-6 bg-white">
                                    <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center mb-4">
                                        <Bell className="w-7 h-7 text-stone-400" />
                                    </div>
                                    <p className="text-stone-600 font-bold text-sm">No notifications yet</p>
                                    <p className="text-stone-400 text-xs mt-1 font-medium">We'll notify you about important updates</p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const Icon = typeIcons[notif.type] || Zap;
                                    const colorClass = typeColors[notif.type] || typeColors.system;
                                    return (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleNotifClick(notif)}
                                            className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-all hover:bg-stone-50 group relative ${!notif.is_read ? 'bg-emerald-50/50' : 'bg-white'}`}
                                        >
                                            {/* Unread indicator */}
                                            {!notif.is_read && (
                                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-md shadow-emerald-500/40" />
                                            )}

                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold leading-snug ${!notif.is_read ? 'text-stone-900' : 'text-stone-600'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-stone-400 mt-1.5 font-bold uppercase tracking-widest">
                                                    {timeAgo(notif.created_at)}
                                                </p>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="border-t border-stone-100 p-3 text-center bg-stone-50/80">
                                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                                    {notifications.length} total notifications
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
