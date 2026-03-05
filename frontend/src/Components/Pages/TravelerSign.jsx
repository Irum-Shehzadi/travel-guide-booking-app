import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, MapPin, Mountain, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TravelerSign = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle Signup
  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending signup request with data:', {
        name: formData.name,
        email: formData.email,
        password: '***' // Don't log actual password
      });

      const response = await fetch('http://localhost:8000/api/traveler/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Success!
        console.log('Signup successful:', data);
        login({ ...data.user, type: 'traveler' }, data.access_token);
        navigate('/traveler-dashboard'); // Redirect to traveler dashboard
      } else {
        console.error('Signup failed:', data);
        setError(data.detail || data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending login request with email:', formData.email);

      const response = await fetch('http://localhost:8000/api/traveler/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok) {
        // Success!
        console.log('Login successful:', data);
        login({ ...data.user, type: 'traveler' }, data.access_token);
        navigate('/traveler-dashboard'); // Redirect to traveler dashboard
      } else {
        console.error('Login failed:', data);
        setError(data.detail || data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated Background Elements 
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
*/}
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Mountain className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Compass className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <MapPin className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold">Pakistan Travel</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Discover the<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-pink-300">
                Beauty of Pakistan
              </span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of travelers exploring ancient heritage,
              majestic mountains, and vibrant cultures.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-blue-200 text-sm">Expert Guides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200 text-sm">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-blue-200 text-sm">Happy Travelers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pakistan Travel
            </span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-500">
                {isSignUp ? 'Start your journey with us' : 'Sign in to continue your adventure'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}



            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className={`relative transition-all duration-300 ${focused === 'name' ? 'transform scale-[1.02]' : ''}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'name' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
                    required={isSignUp}
                  />
                </div>
              )}

              <div className={`relative transition-all duration-300 ${focused === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'email' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
                  required
                />
              </div>

              <div className={`relative transition-all duration-300 ${focused === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'password' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
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
                className="w-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-[1.02] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Toggle */}
            <p className="text-center mt-6 text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-400 text-sm">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravelerSign;