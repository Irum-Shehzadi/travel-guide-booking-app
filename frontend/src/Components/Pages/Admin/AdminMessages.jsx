import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Mail,
    User,
    Calendar,
    Trash2,
    CheckCircle,
    Loader2,
    AlertCircle,
    Inbox,
    Eye
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/api/contact/all`);

            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }

            const data = await response.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error:', err);
            setError('Unable to load messages. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/${messageId}/read`, {
                method: 'PUT'
            });

            if (response.ok) {
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId ? { ...msg, is_read: true } : msg
                ));
            }
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const deleteMessage = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/${messageId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMessages(prev => prev.filter(msg => msg.id !== messageId));
                if (selectedMessage?.id === messageId) {
                    setSelectedMessage(null);
                }
            }
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
        if (!message.is_read) {
            markAsRead(message.id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return !msg.is_read;
        if (filter === 'read') return msg.is_read;
        return true;
    });

    const unreadCount = messages.filter(m => !m.is_read).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <MessageSquare className="w-8 h-8" />
                                Contact Messages
                            </h1>
                            <p className="text-blue-100 mt-2">
                                View and manage messages from visitors
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">{messages.length}</div>
                            <div className="text-blue-100 text-sm">Total Messages</div>
                            {unreadCount > 0 && (
                                <div className="mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">
                                    {unreadCount} Unread
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-3 mb-6">
                    {['all', 'unread', 'read'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl font-medium capitalize transition-all ${filter === f
                                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {f === 'all' ? `All (${messages.length})` :
                                f === 'unread' ? `Unread (${unreadCount})` :
                                    `Read (${messages.length - unreadCount})`}
                        </button>
                    ))}
                </div>

                {/* Messages List */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Message List */}
                    <div className="md:col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">Messages</h2>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {filteredMessages.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No messages found</p>
                                </div>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => handleMessageClick(msg)}
                                        className={`p-4 cursor-pointer transition-colors ${selectedMessage?.id === msg.id
                                                ? 'bg-blue-50 border-l-4 border-blue-500'
                                                : 'hover:bg-gray-50'
                                            } ${!msg.is_read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${!msg.is_read ? 'bg-linear-to-r from-blue-500 to-purple-500' : 'bg-gray-400'
                                                }`}>
                                                {msg.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-semibold truncate ${!msg.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {msg.name}
                                                    </p>
                                                    {!msg.is_read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{msg.email}</p>
                                                <p className="text-sm text-gray-400 truncate mt-1">{msg.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Message Detail */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
                        {selectedMessage ? (
                            <>
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                                {selectedMessage.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">{selectedMessage.name}</h2>
                                                <p className="text-gray-500 flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {selectedMessage.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteMessage(selectedMessage.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete message"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(selectedMessage.created_at)}
                                        </span>
                                        {selectedMessage.is_read && (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <Eye className="w-4 h-4" />
                                                Read
                                            </span>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {/* Reply Action */}
                                    <div className="mt-6">
                                        <a
                                            href={`mailto:${selectedMessage.email}?subject=Re: Your message on Travel Guide Pakistan`}
                                            className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            <Mail className="w-5 h-5" />
                                            Reply via Email
                                        </a>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12 text-center">
                                <div>
                                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Select a message to view details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
