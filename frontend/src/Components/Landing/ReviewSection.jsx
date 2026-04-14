import { motion as fMotion } from "framer-motion";
import { Star, Quote, MapPin, UserCheck, Mountain } from "lucide-react";

// dummy data
const destinationReviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "UK",
    destination: "Hunza Valley",
    text: "Hunza is literally paradise on Earth. The autumn colors, the majestic Passu cones, and the warmth of the locals made this the best trip of my life.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: 2,
    name: "Tariq Ali",
    location: "UAE",
    destination: "Makran Coast, Balochistan",
    text: "The drive through the Makran Coastal Highway was mesmerizing. The otherworldly rock formations and the pristine blue waters of the Arabian Sea are unmatched.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=tariq"
  },
  {
    id: 3,
    name: "Ayesha Khan",
    location: "Pakistan",
    destination: "Neelum Valley",
    text: "A serene getaway from city life! The rushing river, lush green forests, and cool breeze of Kashmir were exactly what I needed.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=ayesha"
  }
];

const guideReviews = [
  {
    id: 1,
    travelerName: "Michael R.",
    guideName: "Ahmed Ali",
    guideLocation: "Gilgit",
    text: "Ahmed made our trek to Fairy Meadows incredibly safe and memorable. His knowledge of the local terrain and culture added so much value to our journey.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=michael"
  },
  {
    id: 2,
    travelerName: "Elena V.",
    guideName: "Zara Khan",
    guideLocation: "Swat",
    text: "Zara was like a friend showing us around her hometown. She took us to hidden waterfalls in Kalam that aren't on any map and organized the best local food.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elena"
  },
  {
    id: 3,
    travelerName: "Omar T.",
    guideName: "Kamran Baloch",
    guideLocation: "Gwadar",
    text: "Kamran is a fantastic guide for Balochistan. Took us to the Princess of Hope and arranged an amazing sunset view at Gwadar port. Very professional.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=omar"
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`}
        />
      ))}
    </div>
  );
};

const ReviewSection = () => {
  return (
    <section className="py-24 relative bg-aurora overflow-hidden border-t border-stone-200/50">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <fMotion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-amber-500/20 text-amber-600 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Mountain className="w-4 h-4 text-amber-500" />
            From Mountains to Valleys
          </fMotion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 mb-6" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            What Our <span className="text-gradient">Travelers Say</span>
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg" style={{ fontFamily: 'var(--font-body)' }}>
            Real experiences spanning from the rugged sands of Balochistan to the crystal sapphire rivers of Gilgit. Discover the warmth of our local guides.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
          {/* Column 1: Destination Reviews */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8 border-b border-stone-200 pb-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <MapPin className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                About Destinations
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {destinationReviews.map((review, i) => (
                <fMotion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="glass-card p-6 rounded-3xl hover:border-cyan-500/30 transition-all group relative"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-stone-100 group-hover:text-cyan-500/10 transition-colors rotate-180" />
                  <StarRating rating={review.rating} />
                  <p className="text-stone-600 mt-4 mb-6 leading-relaxed italic" style={{ fontFamily: 'var(--font-body)' }}>
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                    <div>
                      <h4 className="text-stone-900 font-bold text-sm">{review.name}</h4>
                      <div className="text-cyan-600 text-xs font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> Visited {review.destination}
                      </div>
                    </div>
                  </div>
                </fMotion.div>
              ))}
            </div>
          </div>

          {/* Column 2: Guide Reviews */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8 border-b border-stone-200 pb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <UserCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                About Local Guides
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {guideReviews.map((review, i) => (
                <fMotion.div
                  key={review.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="glass-card p-6 rounded-3xl hover:border-emerald-500/30 transition-all group relative"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-stone-100 group-hover:text-emerald-500/10 transition-colors rotate-180" />
                  <StarRating rating={review.rating} />
                  <p className="text-stone-600 mt-4 mb-6 leading-relaxed italic" style={{ fontFamily: 'var(--font-body)' }}>
                    "{review.text}"
                  </p>
                  <div className="flex items-center justify-between border-t border-stone-200/60 pt-4 mt-auto">
                    <div className="flex items-center gap-3">
                      <img src={review.avatar} alt={review.travelerName} className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                      <div>
                        <h4 className="text-stone-900 font-bold text-sm">{review.travelerName}</h4>
                        <div className="text-stone-500 text-xs">Traveler</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 block mb-0.5">Guided by</span>
                      <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        {review.guideName}
                      </span>
                    </div>
                  </div>
                </fMotion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
