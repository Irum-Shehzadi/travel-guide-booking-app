import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Shield, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = "https://travel-guide-fyp.duckdns.org";

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
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-aurora relative overflow-hidden">

            {/* Background decorative elements */}
            <div className="aurora-glow top-0 left-0" />
            <div className="aurora-glow bottom-0 right-0" style={{ backgroundColor: 'var(--lake-blue)' }} />

            <div className="relative w-full max-w-md">
                {/* Logo/Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-r from-[#0284C7] to-[#10B981] shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gradient">Admin Panel</h1>
                    <p className="text-gray-500 mt-2">Login to manage your platform</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl text-red-600 bg-red-50 border border-red-200">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@travelguide.com"
                                required
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
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
                        className="w-full btn-premium py-3.5 rounded-xl transition-all disabled:opacity-50"
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
