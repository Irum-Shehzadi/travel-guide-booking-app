import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, 'admin-token');
                navigate('/admin-dashboard');
            } else {
                setError(data.detail || 'Invalid credentials');
            }
        } catch (err) {
            setError('Server error. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)" }} />
                <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-15"
                    style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)" }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo/Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white">Admin Panel</h1>
                    <p className="text-gray-400 mt-2">Login to manage your platform</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-6"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backdropFilter: "blur(20px)"
                    }}>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl text-red-300"
                            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)" }}>
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@travelguide.com"
                                required
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                                className="w-full pl-12 pr-12 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl text-white font-semibold text-lg transition-all disabled:opacity-50 cursor-pointer hover:shadow-xl"
                        style={{
                            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)"
                        }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Logging in...
                            </span>
                        ) : (
                            'Login as Admin'
                        )}
                    </button>

                    {/* Info */}
                    <div className="text-center pt-2">
                        <p className="text-xs text-gray-500">
                            This area is restricted to authorized administrators only.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
