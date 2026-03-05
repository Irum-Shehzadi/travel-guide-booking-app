import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Mountain, Building2, Palmtree, Trees, Waves, Search, Star, Clock, ChevronRight, Loader2, Navigation, Zap, Calendar, Compass } from 'lucide-react';
import { provincesData, getAllCities, getFeaturedDestinations, searchDestinations } from '../../data/destinations';
import WeatherWidget from '../common/WeatherWidget';
import { searchPlaces } from '../../api/places';
import PlaceCard from '../PlaceCard';

const iconMap = {
  punjab: Building2,
  sindh: Waves,
  kpk: Mountain,
  balochistan: Palmtree,
  gilgit: Trees,
  azadKashmir: Compass
};

export default function PakistanDestinations() {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Nearby Places state
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState(null);
  const [nearbyCategory, setNearbyCategory] = useState('all');
  const [nearbySearchInput, setNearbySearchInput] = useState('');

  // Live results state (for main search)
  const [liveResults, setLiveResults] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      if (nearbySearchInput) {
        fetchNearbyPlaces(selectedCity.name, 'search', nearbySearchInput);
      } else {
        fetchNearbyPlaces(selectedCity.name, nearbyCategory);
      }
    }
  }, [selectedCity, nearbyCategory, nearbySearchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSearch && searchQuery.length >= 3) {
        fetchLiveResults(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [showSearch, searchQuery]);

  const fetchLiveResults = async (query) => {
    setLiveLoading(true);
    try {
      const result = await searchPlaces(query, 'Pakistan', 'pk', 6);
      setLiveResults(result.places || []);
    } catch (err) {
      setLiveResults([]);
    } finally {
      setLiveLoading(false);
    }
  };

  const fetchNearbyPlaces = async (cityName, category, customQuery = '') => {
    setNearbyLoading(true);
    setNearbyError(null);
    try {
      let query = '';
      if (category === 'search' && customQuery) {
        query = `${customQuery} in ${cityName}`;
      } else {
        const queryMap = {
          'all': `popular places in ${cityName}`,
          'restaurants': `restaurants in ${cityName}`,
          'hotels': `hotels in ${cityName}`,
          'tourist': `tourist attractions in ${cityName}`,
        };
        query = queryMap[category] || `places in ${cityName}`;
      }
      const result = await searchPlaces(query, 'Pakistan', 'pk', 6);
      setNearbyPlaces(result.places || []);
    } catch (err) {
      setNearbyError('Could not load nearby places');
      setNearbyPlaces([]);
    } finally {
      setNearbyLoading(false);
    }
  };

  const handleProvinceClick = (provinceKey) => {
    setSelectedProvince(provinceKey);
    setSelectedCity(null);
    setSearchQuery('');
  };

  const handleCityClick = (city) => setSelectedCity(city);

  const handleBack = () => {
    if (selectedCity) setSelectedCity(null);
    else setSelectedProvince(null);
    setSearchQuery('');
    setNearbySearchInput('');
  };

  // 1. SEARCH RESULTS VIEW
  if (showSearch && searchQuery) {
    const results = searchDestinations(searchQuery);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-aurora pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="flex items-center gap-2 mb-8 text-azure hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-5 h-5" /> <span className="font-bold">Back to Regions</span>
          </button>

          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text" placeholder="Search destinations..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-azure/30 transition-all"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Local Destinations for "{searchQuery}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {results.map((city, index) => (
              <motion.div
                key={index} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}
                onClick={() => { setSelectedCity(city); setSelectedProvince(city.provinceKey); setShowSearch(false); }}
                className="glass-card hover:bg-white/10 rounded-3xl overflow-hidden cursor-pointer group"
              >
                <div className="h-32 bg-gradient-to-br from-azure/20 to-aurora/20 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold opacity-20">{city.name.charAt(0)}</span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-azure font-bold uppercase tracking-widest">{city.province}</span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-azure transition-colors">{city.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{city.desc}</p>
                </div>
              </motion.div>
            ))}
            {results.length === 0 && <div className="col-span-full text-center py-10 glass-panel rounded-3xl text-gray-400">No local cities match your search.</div>}
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Web Results (Live Places)</h2>
          {liveLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-10 h-10 text-azure animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveResults.map((p, i) => <PlaceCard key={i} place={p} />)}
              {liveResults.length === 0 && !liveLoading && <div className="col-span-full text-center py-10 glass-panel rounded-3xl text-gray-400">Search for a specific place name to see web results.</div>}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // 2. CITY DETAIL VIEW
  if (selectedCity) {
    const province = provincesData[selectedProvince];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-aurora pt-24">
        <div className="relative h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-azure/20 to-aurora/30 z-0" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-white px-6">
              <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-azure">{province.name}</motion.p>
              <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl md:text-7xl font-extrabold mb-4">{selectedCity.name}</motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl opacity-75">{selectedCity.desc}</motion.p>
            </div>
          </div>
          <button onClick={handleBack} className="absolute top-8 left-8 flex items-center gap-2 px-6 py-2 glass-panel rounded-full text-white hover:bg-white/10 transition-all z-20">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>

        <div className="max-w-7xl mx-auto p-8 -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-azure/20"><Calendar className="w-6 h-6 text-azure" /></div>
              <div><p className="text-gray-500 text-xs font-bold uppercase">Best Time</p><p className="font-bold text-white">{selectedCity.bestTime || 'Year Round'}</p></div>
            </div>
            {selectedCity.population && (
              <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-aurora/20"><Building2 className="w-6 h-6 text-aurora" /></div>
                <div><p className="text-gray-500 text-xs font-bold uppercase">Population</p><p className="font-bold text-white">{selectedCity.population}</p></div>
              </div>
            )}
            <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-azure/20"><Star className="w-6 h-6 text-azure" /></div>
              <div><p className="text-gray-500 text-xs font-bold uppercase">Attractions</p><p className="font-bold text-white">{selectedCity.attractions?.length || 0}+ Places</p></div>
            </div>
          </div>

          <WeatherWidget cityName={selectedCity.name} />

          {selectedCity.fullDescription && (
            <div className="glass-panel p-8 rounded-3xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About {selectedCity.name}</h2>
              <p className="text-gray-400 leading-relaxed text-lg">{selectedCity.fullDescription}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="glass-panel p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-8">Top Attractions</h2>
              <div className="space-y-4">
                {selectedCity.attractions?.map((attr, i) => (
                  <motion.div key={i} whileHover={{ x: 5 }} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-azure/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-azure" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{attr.name} <span className="text-[10px] text-azure ml-2 font-normal">({attr.type})</span></h3>
                      <p className="text-xs text-gray-500 mt-1">{attr.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Explore {selectedCity.name}</h2>
                <Navigation className="w-5 h-5 text-azure" />
              </div>
              
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={`Search anything in ${selectedCity.name}...`}
                  value={nearbySearchInput}
                  onChange={(e) => {
                    setNearbySearchInput(e.target.value);
                    if (e.target.value) setNearbyCategory('search');
                    else setNearbyCategory('all');
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-azure/30"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'restaurants', 'hotels', 'tourist'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => {
                      setNearbyCategory(c);
                      setNearbySearchInput('');
                    }} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${nearbyCategory === c ? 'bg-azure text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {nearbyLoading ? <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-azure animate-spin" /></div> : (
                <div className="grid gap-4">
                  {nearbyPlaces.map((p, i) => <PlaceCard key={i} place={p} />)}
                  {nearbyPlaces.length === 0 && <p className="text-gray-500 text-center py-10 glass-panel rounded-2xl">No places found. Try a different search term.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 3. PROVINCE DETAIL VIEW
  if (selectedProvince) {
    const province = provincesData[selectedProvince];
    const Icon = iconMap[selectedProvince] || Mountain;
    const filteredCities = province.cities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-aurora pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setSelectedProvince(null)} className="flex items-center gap-2 mb-10 text-azure hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-5 h-5" /> <span className="font-bold">Back to Regions</span>
          </button>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-azure/10 text-azure rounded-3xl border border-azure/20 mb-8">
              <Icon className="w-10 h-10" />
              <h1 className="text-4xl font-extrabold text-white">{province.name}</h1>
            </div>
            <p className="text-2xl text-gradient font-bold mb-4">{province.tagline}</p>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">{province.description}</p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-azure transition-colors" />
              <input type="text" placeholder="Search cities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-azure/30 transition-all font-medium" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCities.map((city, i) => (
              <motion.div
                key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                onClick={() => handleCityClick(city)}
                className="glass-card rounded-[40px] overflow-hidden cursor-pointer group hover:bg-white/10 transition-all"
              >
                <div className="h-44 bg-gradient-to-br from-azure/20 to-aurora/20 relative flex items-center justify-center overflow-hidden">
                  <span className="text-white/10 text-9xl font-bold">{city.name.charAt(0)}</span>
                  <div className="absolute bottom-4 right-4 glass-panel px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">{city.attractions?.length || 0} Spots</div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-azure transition-colors">{city.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{city.desc}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] text-gray-600 font-bold uppercase italic">{city.bestTime || 'Year Round'}</span>
                    <span className="text-azure font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">Explore <ChevronRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // 4. MAIN REGIONS VIEW
  const featured = getFeaturedDestinations();
  return (
    <div className="bg-aurora min-h-screen pt-24 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-azure/10 blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-20">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-azure/10 text-azure text-xs font-bold uppercase tracking-widest mb-6 border border-azure/20">Official Travel Guide</motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-extrabold text-white mb-8">Discover <span className="text-gradient">Pakistan</span></motion.h1>
          <div className="max-w-3xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-azure transition-colors" />
            <input
              type="text" placeholder="Search destinations, cities, attractions..." value={searchQuery}
              onFocus={() => setShowSearch(true)} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-azure/30 transition-all shadow-2xl text-lg"
            />
          </div>
        </header>

        {/* Featured */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3"><Zap className="w-6 h-6 text-azure" /> Featured Spots</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((dest, i) => (
              <motion.div
                key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                onClick={() => {
                  const pk = Object.keys(provincesData).find(k => provincesData[k].cities.some(c => c.name === dest.name));
                  if (pk) { setSelectedProvince(pk); setSelectedCity(dest); }
                }}
                className="glass-card h-80 rounded-[40px] relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-azure/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-10 z-20">
                  <span className="text-[10px] text-azure font-bold uppercase tracking-[0.2em] mb-2">{dest.province}</span>
                  <h3 className="text-3xl font-extrabold text-white group-hover:translate-x-2 transition-transform">{dest.name}</h3>
                  <p className="text-sm text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">{dest.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Regions */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3"><Compass className="w-6 h-6 text-azure" /> Explore by Region</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(provincesData).map(([key, p], i) => {
              const Icon = iconMap[key] || MapPin;
              return (
                <motion.div
                  key={key} initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  onClick={() => handleProvinceClick(key)}
                  className="glass-card p-10 rounded-[50px] cursor-pointer group border-white/5 hover:border-azure/30 transition-all text-center"
                >
                  <div className="w-20 h-20 rounded-3xl bg-azure/10 flex items-center justify-center mx-auto mb-8 border border-azure/20 group-hover:scale-110 group-hover:bg-azure transition-all duration-500">
                    <Icon className="w-10 h-10 text-azure group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-4 group-hover:text-azure transition-colors">{p.name}</h2>
                  <p className="text-azure text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{p.tagline}</p>
                  <p className="text-gray-500 text-sm mb-8 line-clamp-2">{p.description}</p>
                  <div className="inline-flex items-center gap-2 text-white font-bold text-xs bg-white/5 px-6 py-3 rounded-2xl group-hover:bg-azure transition-all">Explore Region <ChevronRight className="w-4 h-4" /></div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="glass-panel p-12 md:p-20 rounded-[60px] text-center border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-white">
            <div><div className="text-5xl font-extrabold mb-2 text-gradient">6</div><p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Regions</p></div>
            <div><div className="text-5xl font-extrabold mb-2 text-gradient">50+</div><p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cities</p></div>
            <div><div className="text-5xl font-extrabold mb-2 text-gradient">200+</div><p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Attractions</p></div>
            <div><div className="text-5xl font-extrabold mb-2 text-gradient">∞</div><p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Memories</p></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}