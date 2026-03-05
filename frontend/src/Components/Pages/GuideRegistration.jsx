import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, FileText, Upload, Award, CheckCircle, ArrowRight, Camera, Shield, Star, Clock, Lock, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = "http://localhost:8000";

const GuideRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    experience: '',
    about: '',
    languages: [],
    specializations: [],
    certifications: '',
    profile_photo: null,
    cnic_number: '',
    cnic_photo: null
  });
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCnicPhoto, setUploadingCnicPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cnicPhotoPreview, setCnicPhotoPreview] = useState(null);
  const [error, setError] = useState('');

  const languages = ['English', 'Urdu', 'Punjabi', 'Pashto', 'Sindhi', 'Balochi'];
  const specializations = ['Historical Tours', 'Adventure Tourism', 'Cultural Tours', 'Mountain Trekking', 'Archaeological Sites', 'Religious Tours'];

  const toggleSelection = (array, item, field) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData({ ...formData, [field]: newArray });
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingPhoto(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, profile_photo: data.url }));
      } else {
        setError(data.detail || 'Failed to upload photo');
        setPhotoPreview(null);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error. Please try again.');
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle CNIC photo upload
  const handleCnicPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCnicPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingCnicPhoto(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, cnic_photo: data.url }));
      } else {
        setError(data.detail || 'Failed to upload CNIC photo');
        setCnicPhotoPreview(null);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error. Please try again.');
      setCnicPhotoPreview(null);
    } finally {
      setUploadingCnicPhoto(false);
    }
  };

  // Remove uploaded photo
  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profile_photo: null }));
    setPhotoPreview(null);
  };

  // Remove uploaded CNIC photo
  const removeCnicPhoto = () => {
    setFormData(prev => ({ ...prev, cnic_photo: null }));
    setCnicPhotoPreview(null);
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

    // Validate photos and ID
    if (!formData.profile_photo) {
      setError('Please upload your profile photo');
      return;
    }

    if (!formData.cnic_number || formData.cnic_number.length < 13) {
      setError('Please enter a valid CNIC number (minimum 13 digits)');
      return;
    }

    if (!formData.cnic_photo) {
      setError('Please upload your CNIC photo');
      return;
    }

    const exp = parseInt(formData.experience);
    if (isNaN(exp) || exp < 0) {
      setError('Please enter a valid number for years of experience');
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
          password: formData.password,
          experience: exp,
          about: formData.about,
          languages: formData.languages,
          specializations: formData.specializations,
          certifications: formData.certifications || "",
          profile_photo: formData.profile_photo,
          cnic_number: formData.cnic_number,
          cnic_photo: formData.cnic_photo
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        alert('Registration Complete! ✅\n\nThank you for registering as a guide. We will review your application and contact you soon via email.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          city: '',
          password: '',
          experience: '',
          about: '',
          languages: [],
          specializations: [],
          certifications: '',
          profile_photo: null,
          cnic_number: '',
          cnic_photo: null
        });
        setPhotoPreview(null);
        setCnicPhotoPreview(null);
        setStep(1);
      } else {
        // More descriptive error messages for validation
        let errorMessage = 'Registration failed. Please try again.';
        if (data.detail && Array.isArray(data.detail)) {
          errorMessage = data.detail.map(err => {
            const field = err.loc[err.loc.length - 1];
            return `${field}: ${err.msg}`;
          }).join(', ');
        } else if (data.detail) {
          errorMessage = data.detail;
        }
        setError(errorMessage);
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
      if (!formData.fullName || !formData.email || !formData.phone || !formData.city || !formData.about || !formData.password) {
        setError('Please fill all required fields');
        return;
      }
    } else if (step === 2) {
      if (!formData.experience || formData.languages.length === 0 || formData.specializations.length === 0) {
        setError('Please complete all required fields');
        return;
      }
    } else if (step === 3) {
      if (!formData.profile_photo) {
        setError('Profile photo is required');
        return;
      }
      if (!formData.cnic_number || formData.cnic_number.length < 13) {
        setError('Valid CNIC number is required (13+ digits)');
        return;
      }
      if (!formData.cnic_photo) {
        setError('CNIC photo is required for verification');
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
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${step >= s
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-500'
                  }`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-linear-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
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
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      placeholder="your.email@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused('')}
                      placeholder="+92 300 1234567"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
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
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      onFocus={() => setFocused('city')}
                      onBlur={() => setFocused('')}
                      placeholder="Your city"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
                    />
                  </div>
                </div>

                <div className={`relative transition-all duration-300 ${focused === 'password' ? 'transform scale-[1.02]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'password' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="w-5 h-5" />
                    {/* Using div placeholder or lock icon if available, assumed imports */}
                  </div>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
                  />
                </div>

                <div className={`relative transition-all duration-300 ${focused === 'about' ? 'transform scale-[1.02]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About You *</label>
                  <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'about' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    onFocus={() => setFocused('about')}
                    onBlur={() => setFocused('')}
                    placeholder="Tell us about your experience, passion for tourism, and why you want to be a guide..."
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none text-black"
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
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    onFocus={() => setFocused('experience')}
                    onBlur={() => setFocused('')}
                    placeholder="e.g., 5"
                    min="0"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
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
                        className={`p-3 rounded-xl border-2 font-medium transition-all duration-300 ${formData.languages.includes(lang)
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
                        className={`p-4 rounded-xl border-2 font-medium text-left transition-all duration-300 ${formData.specializations.includes(spec)
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
                  {/* Profile Photo - MANDATORY */}
                  <div className={`relative rounded-2xl p-6 border-2 border-dashed transition-all ${photoPreview
                    ? 'border-green-400 bg-green-50'
                    : 'border-red-400 bg-linear-to-br from-blue-50 to-purple-50 hover:border-blue-500'
                    }`}>
                    <input
                      type="file"
                      id="photo"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />

                    {photoPreview ? (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {formData.profile_photo && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <p className="text-green-600 font-medium mt-3">Photo Uploaded ✓</p>
                        <label htmlFor="photo" className="text-sm text-blue-600 cursor-pointer hover:underline mt-1">
                          Change Photo
                        </label>
                      </div>
                    ) : uploadingPhoto ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                        <p className="text-gray-600">Uploading...</p>
                      </div>
                    ) : (
                      <label htmlFor="photo" className="cursor-pointer flex flex-col items-center group">
                        <div className="bg-white p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                          <Camera className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">
                          Profile Photo <span className="text-red-500">*</span>
                        </p>
                        <p className="text-gray-500 text-sm text-center">Click to upload (Required)</p>
                      </label>
                    )}
                  </div>

                  {/* ID Card */}
                  <div className={`relative rounded-2xl p-6 border-2 border-dashed transition-all ${cnicPhotoPreview
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-purple-300 bg-linear-to-br from-purple-50 to-pink-50 hover:border-purple-500'
                    }`}>
                    <input
                      type="file"
                      id="cnic_photo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCnicPhotoUpload}
                      disabled={uploadingCnicPhoto}
                    />

                    {cnicPhotoPreview ? (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <img
                            src={cnicPhotoPreview}
                            alt="CNIC Preview"
                            className="w-full h-32 rounded-lg object-cover border-2 border-white shadow-md"
                          />
                          <button
                            type="button"
                            onClick={removeCnicPhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {formData.cnic_photo && (
                            <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white p-1 rounded-full shadow-md">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <p className="text-purple-600 font-medium mt-3">ID Uploaded ✓</p>
                        <label htmlFor="cnic_photo" className="text-sm text-purple-600 cursor-pointer hover:underline mt-1">
                          Change ID Image
                        </label>
                      </div>
                    ) : uploadingCnicPhoto ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                        <p className="text-gray-600">Uploading ID...</p>
                      </div>
                    ) : (
                      <label htmlFor="cnic_photo" className="cursor-pointer flex flex-col items-center group">
                        <div className="bg-white p-4 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-sm">
                          <Upload className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">
                          CNIC / ID Image <span className="text-red-500">*</span>
                        </p>
                        <p className="text-gray-500 text-sm text-center">Front side preferred (Required)</p>
                      </label>
                    )}
                  </div>
                </div>

                <div className={`relative transition-all duration-300 ${focused === 'cnic_number' ? 'transform scale-[1.02]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNIC / ID Number *</label>
                  <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'cnic_number' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.cnic_number}
                    onChange={(e) => setFormData({ ...formData, cnic_number: e.target.value })}
                    onFocus={() => setFocused('cnic_number')}
                    onBlur={() => setFocused('')}
                    placeholder="e.g. 35201-1234567-1"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-black"
                  />
                </div>

                <div className={`relative transition-all duration-300 ${focused === 'certifications' ? 'transform scale-[1.02]' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (Optional)</label>
                  <div className={`absolute left-4 top-[46px] transition-colors duration-300 ${focused === 'certifications' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <textarea
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    onFocus={() => setFocused('certifications')}
                    onBlur={() => setFocused('')}
                    placeholder="List any tourism certifications, training programs, or relevant qualifications..."
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none text-black"
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
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mb-4">
            Registration takes approximately <Clock className="w-4 h-4" /> 5-10 minutes
          </p>
          <p className="text-gray-600">
            Already registered? <Link to="/guide-login" className="text-blue-600 font-semibold hover:underline">Log In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuideRegistration;