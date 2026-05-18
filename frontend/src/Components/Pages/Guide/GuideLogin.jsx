import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, MapPin, Shield, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const GuideLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [focused, setFocused] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://92.4.67.243:8000/api/guide/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                // We pass a custom user object with is_guide: true
                login({ ...data.user, type: 'guide' }, data.access_token);
                navigate('/guide-dashboard');
            } else {
                setError(data.detail || 'Login failed');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Network error. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-aurora">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0284C7] to-[#10B981] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <Shield className="w-8 h-8" />
                            </div>
                            <span className="text-2xl font-bold">Guide Portal</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Share Your<br />
                            <span className="text-white font-extrabold">
                                Passion & Expertise
                            </span>
                        </h1>
                        <p className="text-xl text-orange-100 leading-relaxed">
                            Connect with travelers, manage bookings, and showcase the beauty of Pakistan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="bg-gradient-to-r from-[#0284C7] to-[#10B981] p-3 rounded-xl">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient">Guide Portal</span>
                    </div>

                    <div className="glass-card rounded-3xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Guide</h2>
                            <p className="text-gray-500">Sign in to manage your tours</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className={`relative transition-all duration-300 ${focused === 'email' ? 'transform scale-[1.02]' : ''}`}>
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'email' ? 'text-[#0284C7]' : 'text-gray-400'}`}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused('')}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#10B981] focus:bg-white focus:outline-none transition-all duration-300 text-black"
                                    required
                                />
                            </div>

                            <div className={`relative transition-all duration-300 ${focused === 'password' ? 'transform scale-[1.02]' : ''}`}>
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'password' ? 'text-[#0284C7]' : 'text-gray-400'}`}>
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused('')}
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#10B981] focus:bg-white focus:outline-none transition-all duration-300 text-black"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium py-4 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-gray-600">
                            Don't have a guide account?{' '}
                            <Link
                                to="/guide-registration"
                                className="font-semibold text-[#0284C7] hover:text-[#10B981] transition-all"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideLogin;
