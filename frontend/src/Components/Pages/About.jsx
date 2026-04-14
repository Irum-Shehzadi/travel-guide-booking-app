import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Award, MapPin, Users, CheckCircle, Target, Heart, Globe, Zap, ArrowRight, Compass } from 'lucide-react';

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
    { icon: Shield, value: '500+', label: 'Verified Guides', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: MapPin, value: '50+', label: 'Cities Covered', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { icon: Users, value: '10K+', label: 'Travelers', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Award, value: '4.9/5', label: 'Top Rated', color: 'text-emerald-700', bg: 'bg-emerald-100/50' },
  ];

  const features = [
    { icon: Globe, title: 'Authentic Experience', desc: 'Real local connections that go beyond typical tourist spots.', color: 'text-emerald-600' },
    { icon: Shield, title: 'Safe & Secure', desc: 'Vetted guides and verified profiles for your peace of mind.', color: 'text-cyan-600' },
    { icon: Zap, title: 'Instant Booking', desc: 'No more waiting. Book your guide and start exploring.', color: 'text-amber-600' },
  ];

  return (
    <div className="bg-aurora min-h-screen pt-24 pb-20 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <header className="text-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Compass className="w-3.5 h-3.5" /> Our Mission
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-stone-900 mb-6"
            style={{ fontFamily: 'var(--font-display)', lineHeight: '1.1' }}
          >
            Revolutionizing Tourism in <br />
            <span className="text-gradient drop-shadow-sm italic font-normal px-2">Majestic Pakistan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-stone-600 text-base sm:text-xl max-w-2xl mx-auto font-medium"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            We bridge the gap between world-class travelers and hidden local gems, providing authentic journeys that you'll remember forever.
          </motion.p>
        </header>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-20 sm:mb-32"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card p-6 sm:p-10 rounded-[32px] text-center border-white/60">
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm`}>
                <s.icon className={`w-7 h-7 ${s.color}`} />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</div>
              <div className="text-stone-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center mb-20 sm:mb-32">
          <motion.div
            initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Your Gateway to <span className="text-emerald-600">Hidden Treasures</span>
            </h2>
            <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
              Pakistan is a land of untold stories, breathtaking landscapes, and unmatched hospitality. Yet, many travelers only see the surface. Our platform was born from a desire to change that.
            </p>
            <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
              We empower local experts—from the rugged mountains of Gilgit to the bustling streets of Lahore—giving them a platform to share their heritage while ensuring travelers have the safest and most authentic experience possible.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
              {['Verified Guides', 'Secure Payments', 'Custom Tours', '24/7 Support'].map(t => (
                <div key={t} className="flex items-center gap-2.5 text-sm sm:text-base text-stone-700 font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> {t}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-panel p-8 sm:p-12 rounded-[40px] sm:rounded-[60px] border-white/60 relative z-10 shadow-2xl shadow-emerald-500/5">
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mb-10" style={{ fontFamily: 'var(--font-display)' }}>Why Travelers Trust Us</h3>
              <div className="space-y-8 sm:space-y-12">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-5 sm:gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-300">
                      <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color}`} />
                    </div>
                    <div>
                      <h4 className="text-stone-900 font-black text-lg sm:text-xl mb-2">{f.title}</h4>
                      <p className="text-stone-500 text-sm sm:text-base leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Glossy blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-200/20 blur-[80px] rounded-full" />
          </motion.div>
        </div>

        {/* Values section */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 mb-20 sm:mb-32">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To showcase the true spirit of Pakistan by connecting global adventurers with verified local expertise.', color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
            { icon: Heart, title: 'Our Vision', desc: 'To become the gold standard for cultural tourism in the region, fostering sustainable growth for local communities.', color: 'text-cyan-600', bg: 'bg-cyan-50/50' }
          ].map((v, i) => (
            <motion.div
              key={i} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              className={`p-10 sm:p-16 rounded-[40px] sm:rounded-[50px] border border-white/60 ${v.bg} hover:border-emerald-200 transition-all group shadow-sm hover:shadow-xl`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[28px] bg-white flex items-center justify-center mb-8 sm:mb-10 border border-stone-100 shadow-sm group-hover:scale-110 transition-transform">
                <v.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${v.color}`} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-stone-900 mb-6" style={{ fontFamily: 'var(--font-display)' }}>{v.title}</h3>
              <p className="text-stone-600 leading-relaxed text-base sm:text-xl font-medium">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
          className="glass-panel p-10 sm:p-24 rounded-[50px] sm:rounded-[80px] text-center relative overflow-hidden group border-white/60 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-stone-900 mb-6 sm:mb-8" style={{ fontFamily: 'var(--font-display)' }}>Real Adventure Awaits</h2>
            <p className="text-stone-600 text-base sm:text-xl mb-10 sm:mb-14 max-w-xl mx-auto font-medium">Join thousands of travelers who have discovered the heart of Pakistan with us.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link to="/pakistan-destinations" className="btn-premium px-12 py-4 sm:py-5 text-lg flex items-center justify-center gap-2">
                Start Exploring <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="px-12 py-4 sm:py-5 border border-stone-200 rounded-3xl text-stone-800 font-black hover:bg-white transition-all text-lg bg-white/50">Contact Us</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
