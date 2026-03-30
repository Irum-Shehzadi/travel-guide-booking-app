import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const baseDestinations = [
  { title: "Neelum Valley", desc: "Lush green forests and crystal-clear rivers." },
  { title: "Lake Saiful Muluk", desc: "A mystical alpine lake surrounded by snow-clad mountains." },
  { title: "Fairy Meadows", desc: "A lush green plateau offering a breathtaking view." },
  { title: "Kalam Valley", desc: "Dense pine forests and pristine alpine rivers." },
  { title: "Attabad Lake", desc: "A breathtaking turquoise lake formed in the mountains." },
  { title: "Deosai Plains", desc: "High-altitude alpine plain known for its rich flora." },
  { title: "Kumrat Valley", desc: "Towering Deodar forest and a beautiful river running through." },
  { title: "Ratti Gali Lake", desc: "An alpine glacial lake nestled in the mountains of Neelum." },
  { title: "Naltar Valley", desc: "Famous for its vibrant blue and green lakes and pine forests." },
  { title: "Shangrila Resort", desc: "Also known as 'Heaven on Earth' with its heart-shaped lake." },
  { title: "Astore Valley", desc: "Stunning landscapes featuring rugged terrains and meadows." },
  { title: "Phander Valley", desc: "Filled with trout-filled green waters and lush plains." },
  { title: "Mahodand Lake", desc: "A picturesque lake in the upper Usho Valley." },
  { title: "Lulusar Lake", desc: "The largest lake in the Kaghan Valley with mirror-like waters." },
  { title: "Siri Paye Meadows", desc: "Clouds hovering over lush green meadows." }
];

const photoIds = [
  "1627896157734-4cfcf0bfa3f4", "1574182903332-613bfa319760", "1621831836173-10815152ed4d", 
  "1590396013316-f64f3d2f232f", "1632822830847-d352b92641e4", "1588725807968-36423c5d6c93",
  "1688628994503-b0f3e6c0c2be", "1464822759023-fed622ff2c3b", "1470071131384-001b85755b36",
  "1433086966358-54859d0ed716", "1472214103451-9374bd1c798e", "1501854140801-50d01698950b",
  "1518495973542-4542c06a5843", "1455214513697-31031c26027a", "1445307391741-2139031c29e2"
];

const dimensions = [
  {w: 1200, h: 800}, {w: 800, h: 1200}, {w: 1000, h: 1000}, {w: 1400, h: 900}, {w: 800, h: 1300}, {w: 1200, h: 700}
];

const galleryData = Array.from({ length: 30 }).map((_, i) => {
    const dest = baseDestinations[i % baseDestinations.length];
    const photo = photoIds[(i * 3) % photoIds.length];
    const dim = dimensions[(i * 2 + 1) % dimensions.length];
    
    const titleSuffix = i >= baseDestinations.length ? " (Explorer's View)" : "";
    return {
        id: i + 1,
        title: dest.title + titleSuffix,
        image: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=${dim.w}&h=${dim.h}&q=80`,
        description: dest.desc + " Experience raw, unfiltered nature with our expert guides who know every hidden trail.",
        elevation: (4000 + (Math.floor(i * 300))) + " ft",
        bestTime: "April to October"
    };
});

const GallerySection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [visibleCount, setVisibleCount] = useState(9); // Show 9 items initially

    const displayedItems = galleryData.slice(0, visibleCount);

    const handleShowMore = () => {
        setVisibleCount(prev => Math.min(prev + 9, galleryData.length));
    };

    return (
        <section className="py-20 relative bg-[#F9F7F3]">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 mb-4" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
                        Glimpses of <span className="text-gradient drop-shadow-sm">Paradise</span>
                    </h2>
                    <p className="text-stone-600 max-w-2xl mx-auto text-base md:text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                        Explore the untouched beauty of Pakistan. Click on any destination to uncover its story.
                    </p>
                </div>

                {/* Masonry Layout Container */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {displayedItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (index % 9) * 0.1 }}
                            className="break-inside-avoid mb-6 inline-block w-full"
                        >
                            <div 
                                className="relative rounded-2xl overflow-hidden cursor-pointer group bg-white shadow-xl shadow-stone-200/50 border border-stone-200 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1"
                                onClick={() => setSelectedImage(item)}
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="block w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = `https://picsum.photos/seed/${item.id}/800/1000`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-bold text-xl mb-1 flex items-center gap-2 drop-shadow-md">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                        {item.title}
                                    </h3>
                                    <p className="text-stone-200 text-sm line-clamp-2 drop-shadow-sm">{item.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Show More Button */}
                {visibleCount < galleryData.length && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex justify-center mt-12 w-full"
                    >
                        <button 
                            onClick={handleShowMore}
                            className="px-8 py-3 rounded-full border border-emerald-500/30 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-all duration-300 font-semibold flex items-center gap-2 shadow-sm hover:shadow-lg"
                        >
                            <ArrowRight className="w-5 h-5 rotate-90" />
                            Show More Paradises
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 p-4 sm:p-6 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-emerald-500/20 border border-stone-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-stone-100 text-stone-900 rounded-full flex items-center justify-center transition-colors border border-stone-200 drop-shadow-sm"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left Side: Image */}
                            <div className="w-full md:w-3/5 h-64 md:h-[80vh] bg-stone-100 relative">
                                <img 
                                    src={selectedImage.image} 
                                    alt={selectedImage.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = `https://picsum.photos/seed/${selectedImage.id}/1200/800`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent md:hidden" />
                            </div>

                            {/* Right Side: Content */}
                            <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col h-full overflow-y-auto custom-scrollbar">
                                <div className="mb-6 inline-block w-fit px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                                    Destination
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-stone-900 mb-6" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                                    {selectedImage.title}
                                </h3>
                                
                                <p className="text-stone-600 text-base md:text-lg mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                                    {selectedImage.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                                        <div className="text-stone-500 text-xs uppercase tracking-wider mb-1">Elevation</div>
                                        <div className="text-stone-900 font-bold">{selectedImage.elevation}</div>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                                        <div className="text-stone-500 text-xs uppercase tracking-wider mb-1">Best Time</div>
                                        <div className="text-stone-900 font-bold text-sm">{selectedImage.bestTime}</div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-stone-200">
                                    <Link 
                                        to="/pakistan-destinations" 
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 py-4 shadow-md transition-all hover:shadow-lg"
                                    >
                                        Explore Destination
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <p className="text-center text-stone-500 text-xs mt-4">
                                        Book a local guide for an authentic experience.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;
