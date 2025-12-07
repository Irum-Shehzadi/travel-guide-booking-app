import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, FileText, Upload, Award, CheckCircle, ArrowRight, Camera, Shield, Star, Clock } from 'lucide-react';

const GuideRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    experience: '',
    about: '',
    languages: [],
    specializations: [],
    certifications: ''
  });
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = ['English', 'Urdu', 'Punjabi', 'Pashto', 'Sindhi', 'Balochi'];
  const specializations = ['Historical Tours', 'Adventure Tourism', 'Cultural Tours', 'Mountain Trekking', 'Archaeological Sites', 'Religious Tours'];

  const toggleSelection = (array, item, field) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.city) {
      setError('Please fill all required fields');
      return;
    }

    if (!formData.experience || formData.experience < 0) {
      setError('Please enter valid experience');
      return;
    }

    if (formData.languages.length === 0) {
      setError('Please select at least one language');
      return;
    }

    if (formData.specializations.length === 0) {
      setError('Please select at least one specialization');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/guide/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          experience: parseInt(formData.experience),
          about: formData.about,
          languages: formData.languages,
          specializations: formData.specializations,
          certifications: formData.certifications
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        alert('Registration Complete! ✅\n\nThank you for registering as a guide. We will review your application and contact you soon via email.');
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          city: '',
          experience: '',
          about: '',
          languages: [],
          specializations: [],
          certifications: ''
        });
        setStep(1);
      } else {
        setError(data.detail || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please check if backend is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.city || !formData.about) {
        setError('Please fill all required fields');
        return;
      }
    } else if (step === 2) {
      if (!formData.experience || formData.languages.length === 0 || formData.specializations.length === 0) {
        setError('Please complete all required fields');
        return;
      }
    }
    
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Become a Guide
          </h1>
          <p className="text-gray-600">Join our community of expert travel guides</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                  step >= s 
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step > s ? 'bg-linear-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>Personal Info</span>
            <span>Skills & Experience</span>
            <span>Verification</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
                  <p className="text-gray-500">Tell us about yourself</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`relative transition-all duration-300 ${focused === 'name' ? 'transform scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'name' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className={`relative transition-all duration-300 ${focused === 'email' ? 'transform scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'email' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      placeholder="your.email@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className={`relative transition-all duration-300 ${focused === 'phone' ? 'transform scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'phone' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused('')}
                      placeholder="+92 300 1234567"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className={`relative transition-all duration-300 ${focused === 'city' ? 'transform scale-[1.02]' : ''}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'city' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      onFocus={() => setFocused('city')}
                      onBlur={() => setFocused('')}
                      placeholder="Your city"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className={`relative transition-all duration-300 ${focused === 'about' ? 'transform scale-[1.02]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About You *</label>
                  <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'about' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({...formData, about: e.target.value})}
                    onFocus={() => setFocused('about')}
                    onBlur={() => setFocused('')}
                    placeholder="Tell us about your experience, passion for tourism, and why you want to be a guide..."
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Skills & Experience */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills & Experience</h2>
                  <p className="text-gray-500">Share your expertise with travelers</p>
                </div>

                <div className={`relative transition-all duration-300 ${focused === 'experience' ? 'transform scale-[1.02]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'experience' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    onFocus={() => setFocused('experience')}
                    onBlur={() => setFocused('')}
                    placeholder="e.g., 5"
                    min="0"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Languages You Speak *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleSelection(formData.languages, lang, 'languages')}
                        className={`p-3 rounded-xl border-2 font-medium transition-all duration-300 ${
                          formData.languages.includes(lang)
                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Specializations *</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {specializations.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSelection(formData.specializations, spec, 'specializations')}
                        className={`p-4 rounded-xl border-2 font-medium text-left transition-all duration-300 ${
                          formData.specializations.includes(spec)
                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-[1.02]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification & Documents</h2>
                  <p className="text-gray-500">Upload your credentials for verification</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Profile Photo */}
                  <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all cursor-pointer group">
                    <input type="file" id="photo" className="hidden" accept="image/*" />
                    <label htmlFor="photo" className="cursor-pointer flex flex-col items-center">
                      <div className="bg-white p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-gray-700 font-medium mb-1">Profile Photo</p>
                      <p className="text-gray-500 text-sm text-center">Click to upload your photo</p>
                    </label>
                  </div>

                  {/* ID Card */}
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all cursor-pointer group">
                    <input type="file" id="idcard" className="hidden" accept="image/*" />
                    <label htmlFor="idcard" className="cursor-pointer flex flex-col items-center">
                      <div className="bg-white p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-gray-700 font-medium mb-1">ID Card / CNIC</p>
                      <p className="text-gray-500 text-sm text-center">Upload front & back</p>
                    </label>
                  </div>
                </div>

                <div className={`relative transition-all duration-300 ${focused === 'certifications' ? 'transform scale-[1.02]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (Optional)</label>
                  <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'certifications' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <textarea
                    value={formData.certifications}
                    onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                    onFocus={() => setFocused('certifications')}
                    onBlur={() => setFocused('')}
                    placeholder="List any tourism certifications, training programs, or relevant qualifications..."
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>

                {/* Benefits Section */}
                <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    Benefits of Joining Us
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Flexible work schedule',
                      'Competitive earnings',
                      'Marketing support',
                      'Training & development',
                      'Insurance coverage',
                      'Growing community'
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(step - 1);
                    setError('');
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                onClick={() => step < 3 ? handleNext() : handleSubmit()}
                disabled={loading}
                className="flex-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-[1.02] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : (step < 3 ? 'Next Step' : 'Submit Registration')}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            Registration takes approximately <Clock className="w-4 h-4" /> 5-10 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuideRegistration;