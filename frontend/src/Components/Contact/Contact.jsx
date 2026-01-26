import React, { useState } from "react";
import { Send, Loader2, CheckCircle, MapPin, Phone, Mail } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.detail || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-linear-to-br from-blue-50 via-white to-purple-50">

      {/* Title */}
      <div className="text-center mb-20 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          Get in Touch
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
          Start your journey to Pakistan's most beautiful destinations. Book a trusted guide and make your travel safe, easy, and unforgettable.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-14 max-w-6xl mx-auto">

        {/* Left Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-10 space-y-6 animate-slideInLeft">
          <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Let's Talk
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Connect with us to plan your unforgettable journey across Pakistan. Our expert guides ensure your trip is safe, authentic, and full of beautiful memories.
          </p>

          <div className="space-y-4 pt-4">
            <p className="text-gray-800 text-lg flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>shehzadaqib511@gmail.com</span>
            </p>
            <p className="text-gray-800 text-lg flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>03015440307</span>
            </p>
            <p className="text-gray-800 text-lg flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Haripur, Pakistan</span>
            </p>
          </div>
        </div>

        {/* Right Card / Form */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-10 flex flex-col gap-6 animate-slideInRight"
        >
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-100 border border-green-200 rounded-xl text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="text-gray-800 font-semibold">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-2 border border-gray-300 rounded-xl p-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-gray-800 font-semibold">Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-2 border border-gray-300 rounded-xl p-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-gray-800 font-semibold">Write your message here</label>
            <textarea
              rows="6"
              placeholder="Enter your message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full mt-2 border border-gray-300 rounded-xl p-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Now
              </>
            )}
          </button>

        </form>
      </div>
    </section>
  );
};

export default Contact;
