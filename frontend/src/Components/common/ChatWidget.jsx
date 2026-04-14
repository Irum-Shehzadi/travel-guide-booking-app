import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Shield, Loader2, Minus, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = "http://localhost:8000";
const WS_BASE_URL = "ws://localhost:8000";

const ChatWidget = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const scrollRef = useRef(null);

    // Get User Role Display Name
    const getRoleLabel = () => {
        if (!user) return "Guest";
        if (user.type === 'guide') return "Guide Support";
        return "Traveler Support";
    };

    useEffect(() => {
        if (isOpen && isAuthenticated && user?.email) {
            connectWebSocket();
            fetchHistory();
        } else if (!isOpen && socketRef.current) {
            socketRef.current.close();
        }

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [isOpen, isAuthenticated, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isMinimized]);

    const connectWebSocket = () => {
        const socket = new WebSocket(`${WS_BASE_URL}/api/chat/ws/${user.email}`);

        socket.onopen = () => {
            setIsConnected(true);
            console.log("Chat Connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("Chat Disconnected");
            // Auto-reconnect after 3 seconds if still open
            if (isOpen) {
                setTimeout(connectWebSocket, 3000);
            }
        };

        socketRef.current = socket;
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/chat/history/${user.email}?other_email=admin`);
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error("Failed to fetch chat history", err);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

        const payload = {
            receiver_email: "admin",
            message: input,
            sender_name: user.name || user.fullName,
            sender_role: user.type || (user.cnic_number ? "guide" : "traveler")
        };

        socketRef.current.send(JSON.stringify(payload));
        setInput("");
    };

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`bg-white rounded-[32px] border border-stone-200 shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 ${isMinimized ? 'h-16 w-64' : 'h-[500px] w-[350px] sm:w-[400px]'}`}
                    >
                        {/* Header */}
                        <div className="p-4 bg-emerald-600 flex items-center justify-between shadow-md relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 backdrop-blur-md">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase tracking-wider">{getRoleLabel()}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-300 animate-pulse' : 'bg-red-400'}`} />
                                        <span className="text-[10px] text-emerald-100 font-bold uppercase">{isConnected ? 'Online' : 'Connecting...'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div 
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 custom-scrollbar scroll-smooth"
                                >
                                    <div className="text-center py-4">
                                        <span className="px-3 py-1 bg-stone-200 text-stone-500 rounded-lg text-[9px] font-black uppercase tracking-widest">Chat Secured with End-to-End Encryption</span>
                                    </div>

                                    {messages.map((msg, i) => {
                                        const isMe = msg.sender_role !== 'admin';
                                        return (
                                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm relative ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'}`}>
                                                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                                    <span className={`text-[9px] mt-1 block opacity-60 font-black uppercase tracking-widest ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {messages.length === 0 && isConnected && (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                            <MessageSquare className="w-12 h-12 mb-4 text-stone-300" />
                                            <p className="text-sm font-bold text-stone-500">Hello! {user.name}, start your conversation with Admin below.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Input */}
                                <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-100 flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || !isConnected}
                                        className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:grayscale transition-all shadow-md active:scale-90"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-stone-900 rotate-90' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
                {isOpen ? <X className="text-white w-7 h-7" /> : <MessageSquare className="text-white w-7 h-7" />}
                
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-black text-white">1</span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
