import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle, MapPin, Phone, Mail, Globe, Zap, MessageSquare } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-aurora min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12 sm:mb-20 relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-azure/10 text-azure text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
            Get in Touch
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6">
            Let's Start Your <span className="text-gradient">Adventure</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Ready to explore Pakistan's hidden gems? Send us a message and we'll help you plan the trip of a lifetime.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
          {/* Info Side */}
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6 sm:space-y-8">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl md:rounded-[40px] border-azure/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare className="w-32 h-32 sm:w-40 sm:h-40 text-azure" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Contact Information</h2>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email Us', value: 'shehzadaqib511@gmail.com', color: 'text-azure' },
                  { icon: Phone, label: 'Call Us', value: '03015440307', color: 'text-green-400' },
                  { icon: MapPin, label: 'Visit Us', value: 'Haripur, Pakistan', color: 'text-red-400' },
                  { icon: Globe, label: 'Coverage', value: 'All 4 Provinces', color: 'text-aurora' }
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ x: 10 }} className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-azure group-hover:border-azure transition-all duration-300">
                      <item.icon className="w-6 h-6 text-gray-400 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-white font-medium text-lg">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-2xl md:rounded-[30px] flex items-center gap-4 border-azure/10">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-azure/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-azure" />
              </div>
              <p className="text-gray-400 text-sm">We typically respond to all inquiries within 2 hours during business hours.</p>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative">
            <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-48 h-48 sm:w-64 sm:h-64 bg-azure/10 blur-[80px] sm:blur-[100px] rounded-full" />

            <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl md:rounded-[40px] border-white/5 relative z-10 space-y-5 sm:space-y-6">
              <AnimatePresence>
                {success && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 text-green-400 text-sm">
                    <CheckCircle className="w-5 h-5 shrink-0" /> Message sent successfully!
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text" placeholder="Aaqib Shehzad" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-azure/30 transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email" placeholder="aaqib@example.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-azure/30 transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Message</label>
                <textarea
                  rows="5" placeholder="Tell us about your travel plans..." value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-azure/30 transition-all placeholder:text-gray-700 resize-none"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="btn-premium w-full py-5 rounded-2xl text-lg flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
