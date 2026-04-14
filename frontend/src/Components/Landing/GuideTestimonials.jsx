import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Quote, MapPin, ChevronRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const allGuideReviews = [
  {
    id: 1,
    guideName: "Ahmed Ali",
    location: "Gilgit-Baltistan",
    specialty: "Mountain Trekking",
    text: "Ahmed made our trek to Fairy Meadows incredibly safe and memorable. His knowledge of the local terrain is unmatched.",
    traveler: "Michael from UK",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=ahmed"
  },
  {
    id: 2,
    guideName: "Zara Khan",
    location: "Swat Valley",
    specialty: "Cultural & Heritage",
    text: "Zara was like a friend showing us around Swat. She took us to hidden waterfalls that aren't on any map! Best guide ever.",
    traveler: "Elena from Germany",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=zara"
  },
  {
    id: 3,
    guideName: "Kamran Baloch",
    location: "Gwadar, Balochistan",
    specialty: "Desert & Coastline",
    text: "The Hingol National Park tour was breathtaking. Kamran is the best for off-road adventures and local hospitality.",
    traveler: "Liam from Australia",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=kamran"
  }
];

const GuideTestimonials = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase text-[10px] tracking-widest mb-4">
            <UserCheck className="w-4 h-4" /> Expert Community
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 mb-6 font-display">
            Trusted by Travelers
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGuideReviews.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 border border-stone-200 shadow-sm flex flex-col hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-0.5">
                  {[...Array(item.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-stone-100" />
              </div>
              <p className="text-stone-600 font-medium italic mb-8">"{item.text}"</p>
              <div className="flex items-center gap-4 border-t border-stone-100 pt-6">
                <img src={item.image} alt={item.guideName} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-stone-900 font-bold text-sm uppercase">{item.guideName}</h4>
                  <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuideTestimonials;
