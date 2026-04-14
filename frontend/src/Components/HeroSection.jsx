import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, ChevronRight, Compass, Mountain, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Globe3D from "./Globe3D";
import GallerySection from "./Landing/GallerySection";
import ReviewSection from "./Landing/ReviewSection";
import GuideTestimonials from "./Landing/GuideTestimonials";

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
        <div className="bg-aurora min-h-screen pt-16 sm:pt-20 overflow-hidden relative">
            {/* Background Glows for Light Theme */}
            <div className="absolute top-0 left-1/4 aurora-glow opacity-40 bg-green-200" />
            <div className="absolute bottom-0 right-1/4 aurora-glow opacity-40 bg-amber-100" />

            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-center py-10 sm:py-16 lg:py-20">
                {/* Left Content */}
                <div className="z-10 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full glass-panel border-emerald-500/20 text-emerald-700 bg-white/60 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] mb-5 sm:mb-8"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        Next-Gen Travel Experience
                    </motion.div>

                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-stone-900 mb-5 sm:mb-8"
                        style={{ fontFamily: 'var(--font-display)', lineHeight: '1.08', letterSpacing: '-0.03em' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Your Gateway to{' '}
                        <span className="text-gradient drop-shadow-sm italic">Majestic Pakistan</span>
                    </motion.h1>

                    <motion.div
                        className="flex items-center justify-center lg:justify-start gap-3 mb-5 sm:mb-8 text-lg sm:text-xl md:text-2xl text-stone-600"
                        style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="h-8 sm:h-9 overflow-hidden inline-block align-middle">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={wordIndex}
                                    className="block text-amber-600 font-bold drop-shadow-sm"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                >
                                    {rotatingWords[wordIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className="text-stone-600">the unexplored beauty.</span>
                    </motion.div>

                    <motion.p
                        className="text-stone-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0"
                        style={{ fontFamily: 'var(--font-body)', lineHeight: '1.8', fontWeight: 400 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Experience the raw beauty of Pakistan with local experts. From the rocky mountains of Balochistan to the lush green valleys of KPK.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link to="/pakistan-destinations" className="btn-premium flex items-center justify-center gap-2">
                            Explore Destinations
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link to="/guide-booking" className="px-6 sm:px-8 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-white bg-white/50 shadow-sm transition-all font-semibold text-center">
                            Find a Guide
                        </Link>
                    </motion.div>
                </div>

                {/* Right Content - 3D Globe (hidden on small screens) */}
                <motion.div
                    className="hidden sm:flex relative w-full h-[300px] md:h-[450px] lg:h-[600px] items-center justify-end p-6 sm:p-12 lg:pr-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >

                    <Suspense fallback={<div className="text-emerald-700 animate-pulse text-sm font-semibold">Loading Globe...</div>}>
                        <Globe3D />
                    </Suspense>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-4 sm:px-6 pb-16 sm:pb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-3 gap-3 sm:gap-6">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className="glass-card p-4 sm:p-8 rounded-2xl sm:rounded-3xl group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center mb-3 sm:mb-6 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                <s.icon className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-2xl sm:text-4xl font-black text-stone-900 mb-1 sm:mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                                <AnimatedCounter target={s.value} suffix={s.suffix} />
                            </div>
                            <div className="text-stone-500 uppercase text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.18em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Row */}
            <section className="py-16 sm:py-24 bg-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border-y border-stone-200/50 backdrop-blur-md relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-stone-900 mb-4" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Why Travel With Us?</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg" style={{ fontFamily: 'var(--font-body)', lineHeight: '1.75', fontWeight: 400 }}>We provide the most secure and immersive travel platform in Pakistan.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { icon: Compass, title: "Curated Trails", desc: "Handpicked routes that show you the soul of Pakistan, not just the highlights." },
                            { icon: Shield, title: "Verified Safety", desc: "Every guide is personally interviewed and verified by our admin team." },
                            { icon: Mountain, title: "Untouched Beauty", desc: "We take you to places that aren't even on the maps yet." }
                        ].map((item, i) => (
                            <div key={i} className="text-center group bg-white/60 p-8 rounded-3xl border border-stone-200/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-cyan-500 transition-all duration-500">
                                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600 group-hover:text-white" />
                                </div>
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-stone-900 mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{item.title}</h3>
                                <p className="text-stone-600 text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: '1.75', fontWeight: 400 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <GallerySection />

            {/* Review Section */}
            <ReviewSection />

            {/* Featured Guide Testimonials */}
            <GuideTestimonials />
        </div>
    );
};

export default HeroSection;
