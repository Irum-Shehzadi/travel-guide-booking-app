import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, ChevronRight, Compass, Mountain, Globe as GlobeIcon, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Globe3D from "./Globe3D";

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        const timer = setTimeout(() => requestAnimationFrame(animate), 500);
        return () => clearTimeout(timer);
    }, [target, duration]);

    return <span>{count}{suffix}</span>;
};

const rotatingWords = ["Explore", "Discover", "Experience", "Adventure"];

const HeroSection = () => {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((i) => (i + 1) % rotatingWords.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: "Destinations", value: 150, suffix: "+", icon: MapPin },
        { label: "Expert Guides", value: 500, suffix: "+", icon: Shield },
        { label: "Travelers", value: 10, suffix: "K+", icon: Users },
    ];

    return (
        <div className="bg-aurora min-h-screen pt-20">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 aurora-glow" />
            <div className="absolute bottom-0 right-1/4 aurora-glow opacity-50" />

            <section className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-20">
                {/* Left Content */}
                <div className="z-10 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-azure/20 text-azure text-[11px] font-semibold uppercase tracking-[0.2em] mb-8" style={{ fontFamily: 'var(--font-body)' }}
                    >
                        <Zap className="w-3 h-3 fill-azure" />
                        Next-Gen Travel Experience
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-black text-white mb-8"
                        style={{ fontFamily: 'var(--font-display)', lineHeight: '1.08', letterSpacing: '-0.03em' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Your Gateway to <br />
                        <span className="text-gradient">Majestic Pakistan</span>
                    </motion.h1>

                    <motion.div
                        className="flex items-center gap-3 mb-8 text-xl md:text-2xl text-gray-400"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="h-9 overflow-hidden inline-block align-middle">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={wordIndex}
                                    className="block text-azure font-bold"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                >
                                    {rotatingWords[wordIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        the unexplored beauty.
                    </motion.div>

                    <motion.p
                        className="text-gray-400 text-base md:text-lg mb-10 max-w-lg"
                        style={{ fontFamily: 'var(--font-body)', lineHeight: '1.8', fontWeight: 400 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Experience the raw beauty of Pakistan with local experts. From snow-capped peaks to coastal serenity, we make every journey legendary.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link to="/pakistan-destinations" className="btn-premium flex items-center gap-2">
                            Explore Destinations
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link to="/guide-booking" className="px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-semibold glass-panel">
                            Find a Guide
                        </Link>
                    </motion.div>
                </div>

                {/* Right Content - 3D Globe */}
                <motion.div
                    className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center p-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="absolute inset-0 bg-azure/5 blur-[120px] rounded-full scale-150 animate-pulse" />
                    <Suspense fallback={<div className="text-azure animate-pulse">Loading Globe...</div>}>
                        <Globe3D />
                    </Suspense>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className="glass-card p-8 rounded-3xl group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-azure/10 flex items-center justify-center mb-6 border border-azure/20 group-hover:bg-azure group-hover:text-white transition-all duration-500">
                                <s.icon className="w-6 h-6 text-azure group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                                <AnimatedCounter target={s.value} suffix={s.suffix} />
                            </div>
                            <div className="text-gray-500 uppercase text-[11px] tracking-[0.18em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Row */}
            <section className="py-24 bg-white/1 shadow-inner relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Why Travel With Us?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg" style={{ fontFamily: 'var(--font-body)', lineHeight: '1.75', fontWeight: 400 }}>We provide the most secure and immersive travel platform in Pakistan.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Compass, title: "Curated Trails", desc: "Handpicked routes that show you the soul of Pakistan, not just the highlights." },
                            { icon: Shield, title: "Verified Safety", desc: "Every guide is personally interviewed and verified by our admin team." },
                            { icon: Mountain, title: "Untouched Beauty", desc: "We take you to places that aren't even on the maps yet." }
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 rounded-full bg-azure/5 border border-azure/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon className="w-8 h-8 text-azure" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{item.title}</h3>
                                <p className="text-gray-400 text-sm px-4" style={{ fontFamily: 'var(--font-body)', lineHeight: '1.75', fontWeight: 400 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;
