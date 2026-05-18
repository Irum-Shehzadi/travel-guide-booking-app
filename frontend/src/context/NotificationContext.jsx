import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const API_BASE_URL = "http://92.4.67.243:8000";
const WS_BASE_URL = "ws://92.4.67.243:8000";

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    // Fetch existing notifications on mount / login
    const fetchNotifications = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/notification/${user.email}`);
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (err) {
            console.error('[Notifications] Fetch error:', err);
        }
    }, [user?.email]);

    // Connect WebSocket
    const connectWebSocket = useCallback(() => {
        if (!user?.email) return;
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(`${WS_BASE_URL}/api/notification/ws/${user.email}`);

        ws.onopen = () => {
            console.log('[WS] Connected');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const notification = JSON.parse(event.data);
                // Prepend new notification to list
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Play a notification sound (optional browser-level)
                if (Notification.permission === 'granted') {
                    new Notification(notification.title, { body: notification.message, icon: '/favicon.ico' });
                }
            } catch (err) {
                // It might just be a "pong" text reply
                if (event.data !== 'pong') {
                    console.error('[WS] Parse error:', err);
                }
            }
        };

        ws.onclose = () => {
            console.log('[WS] Disconnected');
            setIsConnected(false);
            // Auto-reconnect after 3 seconds
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (err) => {
            console.error('[WS] Error:', err);
            ws.close();
        };

        wsRef.current = ws;

        // Keep alive with pings every 25 seconds
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('ping');
            }
        }, 25000);

        // Return cleanup
        return () => clearInterval(pingInterval);
    }, [user?.email]);

    // Mark single notification as read
    const markAsRead = async (notificationId) => {
        try {
            await fetch(`${API_BASE_URL}/api/notification/${notificationId}/read`, { method: 'PUT' });
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('[Notifications] Mark read error:', err);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        if (!user?.email) return;
        try {
            await fetch(`${API_BASE_URL}/api/notification/${user.email}/read-all`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('[Notifications] Mark all read error:', err);
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        try {
            await fetch(`${API_BASE_URL}/api/notification/${notificationId}`, { method: 'DELETE' });
            setNotifications(prev => {
                const notif = prev.find(n => n.id === notificationId);
                if (notif && !notif.is_read) setUnreadCount(c => Math.max(0, c - 1));
                return prev.filter(n => n.id !== notificationId);
            });
        } catch (err) {
            console.error('[Notifications] Delete error:', err);
        }
    };

    // Effects
    useEffect(() => {
        if (isAuthenticated && user?.email) {
            fetchNotifications();
            const cleanup = connectWebSocket();
            // Request browser notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            return () => {
                if (cleanup) cleanup();
                if (wsRef.current) wsRef.current.close();
                if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            };
        } else {
            // Cleanup on logout
            if (wsRef.current) wsRef.current.close();
            setNotifications([]);
            setUnreadCount(0);
            setIsConnected(false);
        }
    }, [isAuthenticated, user?.email, fetchNotifications, connectWebSocket]);

    const value = {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};
