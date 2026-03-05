import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Award, Clock, Star, Users, MapPin, TrendingUp, Heart, CheckCircle, Target, Globe, Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const About = () => {
  const stats = [
    { icon: Shield, value: '500+', label: 'Verified Guides' },
    { icon: MapPin, value: '50+', label: 'Cities Covered' },
    { icon: Users, value: '10K+', label: 'Travelers' },
    { icon: Award, value: '4.9/5', label: 'Top Rated' },
  ];

  const features = [
    { icon: Globe, title: 'Authentic Experience', desc: 'Real local connections that go beyond typical tourist spots.' },
    { icon: Shield, title: 'Safe & Secure', desc: 'Vetted guides and verified profiles for your peace of mind.' },
    { icon: Zap, title: 'Instant Booking', desc: 'No more waiting. Book your guide and start exploring.' },
  ];

  return (
    <div className="bg-aurora min-h-screen pt-24 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-azure/10 text-azure text-xs font-bold uppercase tracking-widest mb-6"
          >
            Our Mission
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Revolutionizing Tourism in <br />
            <span className="text-gradient">Majestic Pakistan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            We bridge the gap between world-class travelers and hidden local gems, providing authentic journeys that you'll remember forever.
          </motion.p>
        </header>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card p-8 rounded-3xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-azure/10 flex items-center justify-center mx-auto mb-4 border border-azure/20">
                <s.icon className="w-6 h-6 text-azure" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Your Gateway to <span className="text-azure">Hidden Treasures</span></h2>
            <p className="text-gray-400 leading-relaxed">
              Pakistan is a land of untold stories, breathtaking landscapes, and unmatched hospitality. Yet, many travelers only see the surface. Our platform was born from a desire to change that.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We empower local experts—from the rugged mountains of Gilgit to the bustling streets of Lahore—giving them a platform to share their heritage while ensuring travelers have the safest and most authentic experience possible.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {['Verified Guides', 'Secure Payments', 'Custom Tours', '24/7 Support'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-azure" /> {t}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-panel p-8 rounded-[40px] border-azure/20 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-8">Why Travelers Trust Us</h3>
              <div className="space-y-8">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-azure/10 flex items-center justify-center shrink-0 border border-azure/20">
                      <f.icon className="w-5 h-5 text-azure" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{f.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-aurora/30 blur-[80px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-azure/20 blur-[80px] rounded-full" />
          </motion.div>
        </div>

        {/* Values section */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To showcase the true spirit of Pakistan by connecting global adventurers with verified local expertise.', bg: 'bg-azure/5' },
            { icon: Heart, title: 'Our Vision', desc: 'To become the gold standard for cultural tourism in the region, fostering sustainable growth for local communities.', bg: 'bg-aurora/5' }
          ].map((v, i) => (
            <motion.div
              key={i} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              className={`p-12 rounded-[40px] border border-white/5 ${v.bg} hover:border-azure/20 transition-all group`}
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                <v.icon className={`w-8 h-8 ${i === 0 ? 'text-azure' : 'text-aurora'}`} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{v.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
          className="glass-panel p-12 md:p-20 rounded-[50px] text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-azure/5 to-aurora/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Real Adventure Awaits</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of travelers who have discovered the heart of Pakistan with us.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pakistan-destinations" className="btn-premium px-10 py-4 text-lg">Start Exploring</Link>
              <Link to="/contact" className="px-10 py-4 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/5 transition-all text-lg">Contact Us</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
