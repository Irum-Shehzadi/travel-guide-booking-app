import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Mountain, Building2, Palmtree, Trees, Waves, Search, Star, Clock, ChevronRight, Loader2, Navigation, Zap, Calendar, Compass, MessageSquare, User, AlertCircle } from 'lucide-react';
import { provincesData, getAllCities, getFeaturedDestinations, searchDestinations } from '../../data/destinations';
import WeatherWidget from '../common/WeatherWidget';
import { searchPlaces } from '../../api/places';
import PlaceCard from '../PlaceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import DestinationReviewForm from '../DestinationReviewForm';
import BookingForm from '../BookingForm';

const iconMap = {
  punjab: Building2,
  sindh: Waves,
  kpk: Mountain,
  balochistan: Palmtree,
  gilgit: Trees,
  azadKashmir: Compass
};

export default function PakistanDestinations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Auto-search from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
      setShowSearch(true);
    }
  }, [location]);

  // City Detail States
  const [activeTab, setActiveTab] = useState('overview');
  const [cityGuides, setCityGuides] = useState([]);
  const [guidesLoading, setGuidesLoading] = useState(false);
  const [cityReviews, setCityReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Nearby Places state
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState(null);
  const [nearbyCategory, setNearbyCategory] = useState('all');
  const [nearbySearchInput, setNearbySearchInput] = useState('');

  // Live results state (for main search)
  const [liveResults, setLiveResults] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);

  // Guide Booking and Reviews Modals States
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showGuideReviewsModal, setShowGuideReviewsModal] = useState(false);
  const [guideReviewsData, setGuideReviewsData] = useState([]);
  const [guideReviewsLoading, setGuideReviewsLoading] = useState(false);

  const fetchGuideReviews = async (guideId) => {
    setGuideReviewsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/review/guide/${guideId}`);
      const data = await response.json();
      setGuideReviewsData(data.reviews || []);
      setShowGuideReviewsModal(true);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setGuideReviewsLoading(false);
    }
  };

  const handleBookNow = (guide) => {
    setSelectedGuide(guide);
    setShowBookingModal(true);
  };

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
    if (selectedCity) {
      if (activeTab === 'guides') {
        fetchCityGuides(selectedCity.name);
      } else if (activeTab === 'reviews') {
        fetchCityReviews(selectedCity.name);
      }
    }
  }, [activeTab, selectedCity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSearch && searchQuery.length >= 3) {
        fetchLiveResults(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [showSearch, searchQuery]);

  const fetchCityGuides = async (cityName) => {
    setGuidesLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/guide/search/city/${cityName}`);
      const data = await response.json();
      setCityGuides(data.guides || []);
    } catch (err) {
      console.error('Error fetching guides:', err);
    } finally {
      setGuidesLoading(false);
    }
  };

  const fetchCityReviews = async (cityName) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/review/destination/${cityName}`);
      const data = await response.json();
      setCityReviews(data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

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
    setActiveTab('overview');
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setActiveTab('overview');
  };

  const handleBack = () => {
    if (selectedCity) setSelectedCity(null);
    else setSelectedProvince(null);
    setSearchQuery('');
    setNearbySearchInput('');
  };

  // Helper for safe images
  const getImageSource = (seed, width, height) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;

  // 1. SEARCH RESULTS VIEW
  if (showSearch && searchQuery) {
    const results = searchDestinations(searchQuery);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-24 p-4 sm:p-8 shrink-0 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="flex items-center gap-2 mb-8 text-emerald-600 hover:text-emerald-700 hover:translate-x-[-4px] transition-all bg-white px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
            <ArrowLeft className="w-5 h-5" /> <span className="font-bold">Back to Regions</span>
          </button>

          <div className="max-w-2xl mx-auto mb-10 px-4">
            <div className="relative shadow-md rounded-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text" placeholder="Search destinations..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-16 pr-8 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm sm:text-base shadow-sm font-medium"
              />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 px-4">Local Destinations for "{searchQuery}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 px-2 sm:px-4">
            {results.map((city, index) => (
              <motion.div
                key={index} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}
                onClick={() => { setSelectedCity(city); setSelectedProvince(city.provinceKey); setShowSearch(false); }}
                className="bg-white hover:bg-emerald-50 rounded-3xl overflow-hidden cursor-pointer group shadow-sm border border-stone-200 hover:border-emerald-200 transition-all hover:shadow-md"
              >
                <div className="h-32 bg-emerald-100 relative flex items-center justify-center overflow-hidden">
                   <img src={getImageSource(city.name, 800, 400)} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt={city.name} />
                   <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/10 transition-colors" />
                </div>
                <div className="p-6 relative bg-white">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">{city.province}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-3 group-hover:text-emerald-700 transition-colors">{city.name}</h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-2 line-clamp-2 leading-relaxed">{city.desc}</p>
                </div>
              </motion.div>
            ))}
            {results.length === 0 && <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-stone-200 shadow-sm text-stone-500 font-medium">No local cities match your search.</div>}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 px-4">Web Results (Live Places)</h2>
          {liveLoading ? (
             <div className="flex justify-center py-12"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-4">
              {liveResults.map((p, i) => <PlaceCard key={i} place={p} />)}
              {liveResults.length === 0 && !liveLoading && <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-stone-200 shadow-sm text-stone-500 font-medium">Search for a specific place name to see web results.</div>}
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 bg-stone-50 pb-10">
        {/* Hero Header */}
        <div className="relative h-[300px] sm:h-[450px] overflow-hidden rounded-b-[40px] shadow-sm">
          <img src={getImageSource(selectedCity.name, 1600, 800)} alt={selectedCity.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-900/40 z-0 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent z-0" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 pt-12">
            <div className="text-center text-white w-full">
              <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4 sm:mb-6">{province.name}</motion.p>
              <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 sm:mb-6 tracking-tighter drop-shadow-lg text-white">{selectedCity.name}</motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm sm:text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4 drop-shadow-md text-stone-100">{selectedCity.desc}</motion.p>
            </div>
          </div>
          <button onClick={handleBack} className="absolute top-6 left-6 flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white text-white hover:text-stone-900 backdrop-blur-md border border-white/30 rounded-full transition-all z-20 font-bold text-xs sm:text-sm shadow-lg shadow-black/10">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 sm:-mt-16 relative z-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-5 sm:p-6 rounded-3xl flex items-center gap-4 sm:gap-5 border border-stone-200 shadow-xl shadow-stone-200/50 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0"><Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" /></div>
              <div><p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Best Time</p><p className="font-black text-stone-900 text-base sm:text-lg">{selectedCity.bestTime || 'Year Round'}</p></div>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-5 sm:p-6 rounded-3xl flex items-center gap-4 sm:gap-5 border border-stone-200 shadow-xl shadow-stone-200/50 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-50 flex items-center justify-center border border-cyan-100 shrink-0"><Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" /></div>
              <div><p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Province</p><p className="font-black text-stone-900 text-base sm:text-lg">{province.name}</p></div>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-5 sm:p-6 rounded-3xl flex items-center gap-4 sm:gap-5 border border-stone-200 shadow-xl shadow-stone-200/50 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0"><Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" /></div>
              <div><p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Attractions</p><p className="font-black text-stone-900 text-base sm:text-lg">{selectedCity.attractions?.length || 0}+ Places</p></div>
            </motion.div>
          </div>

          {/* Custom Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10 p-1.5 sm:p-2 bg-white rounded-[20px] border border-stone-200 shadow-sm w-fit overflow-x-auto no-scrollbar max-w-full mx-auto sm:mx-0">
            {[
              { id: 'overview', label: 'Overview', icon: Compass },
              { id: 'directions', label: 'Directions', icon: Navigation },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
              { id: 'guides', label: 'Guides', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[14px] sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <WeatherWidget cityName={selectedCity.name} />

                {selectedCity.fullDescription && (
                  <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-stone-200 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-4 sm:mb-6 flex items-center gap-3">
                      <div className="w-2 h-6 sm:h-8 bg-emerald-500 rounded-full" />
                      About {selectedCity.name}
                    </h2>
                    <p className="text-stone-600 leading-relaxed text-base sm:text-lg font-medium">{selectedCity.fullDescription}</p>
                  </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Attractions */}
                  <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-stone-200 shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-6 sm:mb-8 flex items-center justify-between border-b border-stone-100 pb-4">
                      Top Attractions
                      <MapPin className="w-6 h-6 text-emerald-500 bg-emerald-50 p-1 rounded-md" />
                    </h2>
                    <div className="space-y-4">
                      {selectedCity.attractions?.map((attr, i) => (
                        <motion.div key={i} whileHover={{ x: 5 }} className="flex gap-4 p-4 sm:p-5 bg-stone-50 rounded-[20px] sm:rounded-3xl border border-stone-200 hover:border-emerald-200 transition-all hover:shadow-md">
                          <div className="w-12 h-12 rounded-[16px] bg-white flex items-center justify-center shrink-0 border border-stone-200 shadow-sm">
                             <img src={getImageSource(`${selectedCity.name} ${attr.name}`, 100, 100)} className="w-full h-full object-cover rounded-[14px]" alt={attr.name} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-stone-900 text-base sm:text-lg truncate">{attr.name} <span className="text-[10px] text-emerald-600 ml-2 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{attr.type}</span></h3>
                            <p className="text-xs text-stone-500 mt-1.5 font-medium line-clamp-2 leading-relaxed">{attr.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Explore (Live Places) */}
                  <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-stone-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 border-b border-stone-100 pb-4">
                      <h2 className="text-xl sm:text-2xl font-black text-stone-900">Explore Nearby</h2>
                      <div className="flex gap-1.5 sm:gap-2">
                        {['all', 'restaurants', 'hotels'].map(c => (
                          <button key={c} onClick={() => setNearbyCategory(c)} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${nearbyCategory === c ? 'bg-emerald-600 text-white shadow-sm' : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'}`}>{c}</button>
                        ))}
                      </div>
                    </div>

                    <div className="relative mb-6 shadow-sm rounded-2xl">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                      <input
                        type="text" placeholder={`Search around ${selectedCity.name}...`}
                        value={nearbySearchInput} onChange={(e) => { setNearbySearchInput(e.target.value); setNearbyCategory(e.target.value ? 'search' : 'all'); }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3.5 pl-12 pr-4 text-stone-900 text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {nearbyLoading ? <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div> : (
                      <div className="grid gap-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {nearbyPlaces.map((p, i) => <PlaceCard key={i} place={p} />)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Directions Tab */}
            {activeTab === 'directions' && (
              <motion.div key="directions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white overflow-hidden rounded-[32px] sm:rounded-[40px] border border-stone-200 h-[400px] sm:h-[600px] relative shadow-md">
                <iframe
                  title="Google Maps"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${selectedCity.name},Pakistan&output=embed`}
                  allowFullScreen
                ></iframe>
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl sm:rounded-3xl max-w-[200px] sm:max-w-xs border border-stone-200 shadow-xl pointer-events-none">
                  <h3 className="text-base sm:text-xl font-black text-stone-900 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-600" /> Navigation</h3>
                  <p className="text-stone-500 text-[10px] sm:text-xs font-semibold leading-relaxed">Viewing {selectedCity.name}. Use controls to explore specific routes.</p>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 sm:space-y-8">
                <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">Traveler Feedback</h2>
                    <p className="text-stone-500 text-sm font-semibold">Real stories from people who visited {selectedCity.name}</p>
                  </div>
                  <button onClick={() => setShowReviewForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-sm w-full sm:w-auto justify-center cursor-pointer pointer-events-auto z-10">
                    <MessageSquare className="w-4 h-4" /> Write Review
                  </button>
                </div>

                {reviewsLoading ? <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div> : (
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {cityReviews.length === 0 ? (
                      <div className="col-span-full py-20 sm:py-32 bg-white rounded-[32px] sm:rounded-[40px] border border-stone-200 text-center shadow-sm">
                        <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-stone-100">
                           <MessageSquare className="w-8 h-8 text-stone-300" />
                        </div>
                        <h3 className="text-xl font-black text-stone-900">No reviews yet</h3>
                        <p className="text-stone-500 mt-2 text-sm font-medium">Be the first to share your experience exploring {selectedCity.name}!</p>
                      </div>
                    ) : (
                      cityReviews.map((r, i) => (
                        <div key={i} className="bg-white p-6 sm:p-8 rounded-[32px] border border-stone-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg sm:text-xl border border-emerald-100">{r.traveler_name.charAt(0)}</div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-stone-900 text-sm sm:text-base truncate">{r.traveler_name}</h4>
                               <p className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                               {[...Array(5)].map((_, idx) => (
                                 <Star key={idx} className={`w-3 h-3 ${idx < r.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                               ))}
                            </div>
                          </div>
                          <p className="text-stone-600 leading-relaxed font-medium italic text-sm bg-stone-50 p-4 rounded-2xl">"{r.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Guides Tab */}
            {activeTab === 'guides' && (
              <motion.div key="guides" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 sm:space-y-8">
                <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-stone-200 text-center px-4 shadow-sm">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-3">Local Area Experts</h2>
                  <p className="text-stone-500 text-sm font-semibold max-w-xl mx-auto">Certified regional guides with deep, hands-on knowledge of {selectedCity.name} ready to curate your trip.</p>
                </div>

                {guidesLoading ? <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div> : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {cityGuides.length === 0 ? (
                      <div className="col-span-full py-20 sm:py-32 bg-white rounded-[32px] sm:rounded-[40px] text-center border border-stone-200 shadow-sm px-4">
                        <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-stone-100">
                           <User className="w-8 h-8 text-stone-300" />
                        </div>
                        <h3 className="text-xl font-black text-stone-900">Guides Not Found</h3>
                        <p className="text-stone-500 mt-2 text-sm font-medium">Currently no regional guides are registered exclusively for {selectedCity.name}.</p>
                        <button onClick={() => navigate('/guide-booking')} className="mt-8 text-emerald-700 bg-emerald-50 px-6 py-3 rounded-full font-bold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200">View All Available Guides</button>
                      </div>
                    ) : (
                      cityGuides.map((g, i) => (
                        <motion.div
                          key={i} whileHover={{ y: -5 }}
                          className="bg-white rounded-[32px] sm:rounded-[40px] overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group"
                        >
                          <div className="h-48 sm:h-56 bg-stone-100 relative flex items-center justify-center overflow-hidden">
                            {g.profile_photo ? (
                              <img src={g.profile_photo.startsWith('http') ? g.profile_photo : `http://localhost:8000${g.profile_photo}`} alt={g.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                              <span className="text-6xl sm:text-8xl font-black text-stone-200">{g.fullName.charAt(0)}</span>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-stone-200 shadow-sm">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="text-stone-900 text-[10px] font-black">{g.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors truncate">{g.fullName}</h3>
                            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> {g.city}</p>
                            <p className="text-[10px] sm:text-[11px] text-stone-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {g.experience} Years Exp</p>
                            <div className="space-y-4 mb-6 sm:mb-8">
                              <div className="flex flex-wrap gap-2">
                                {g.specializations?.slice(0, 3).map((s, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-stone-50 rounded-lg text-[10px] text-stone-600 font-bold border border-stone-200">{s}</span>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <button
                                onClick={() => handleBookNow(g)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 text-xs font-bold shadow-md hover:shadow-lg uppercase tracking-wider w-full"
                              >
                                Book Now <ChevronRight className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => fetchGuideReviews(g.id)}
                                className="bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider w-full"
                              >
                                Reviews <Star className="w-4 h-4 text-amber-500" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <DestinationReviewForm 
            cityName={selectedCity.name} 
            isOpen={showReviewForm} 
            onClose={() => setShowReviewForm(false)} 
            onSuccess={() => fetchCityReviews(selectedCity.name)} 
        />

        <BookingForm
          guide={selectedGuide}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => fetchCityGuides(selectedCity.name)}
        />

        <AnimatePresence>
          {showGuideReviewsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGuideReviewsModal(false)} className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[32px] sm:rounded-[40px] border border-stone-200 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <div>
                    <h3 className="text-2xl font-black text-stone-900">Guide Reviews</h3>
                    <p className="text-stone-500 text-sm font-semibold mt-1">See what other travelers say</p>
                  </div>
                  <button onClick={() => setShowGuideReviewsModal(false)} className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:bg-stone-100 shadow-sm transition-colors"><AlertCircle className="rotate-45 w-6 h-6" /></button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {guideReviewsLoading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div>
                  ) : guideReviewsData.length > 0 ? (
                    <div className="space-y-4">
                      {guideReviewsData.map((r, i) => (
                        <div key={i} className="p-6 bg-stone-50 rounded-[28px] border border-stone-200 hover:border-emerald-200 transition-colors">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-lg">{r.traveler_name.charAt(0)}</div>
                            <div>
                              <h4 className="font-bold text-stone-900 text-sm">{r.traveler_name}</h4>
                              <div className="flex gap-0.5 mt-1">
                                {[...Array(5)].map((_, idx) => (
                                  <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? "text-amber-400 fill-amber-400" : "text-stone-300"}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-stone-600 text-sm leading-relaxed italic font-medium bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">"{r.comment}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-stone-50 rounded-[32px] border border-stone-100">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200 shadow-sm">
                        <Star className="w-8 h-8 text-stone-300" />
                      </div>
                      <p className="text-stone-500 font-bold text-lg">No reviews for this guide yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }



  // 3. PROVINCE DETAIL VIEW
  if (selectedProvince) {
    const province = provincesData[selectedProvince];
    const Icon = iconMap[selectedProvince] || Mountain;
    const filteredCities = province.cities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="min-h-screen bg-stone-50 pt-20 sm:pt-24 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedProvince(null)}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-4 sm:mb-8 transition-colors bg-white hover:bg-emerald-50 px-4 py-2 border border-emerald-100 rounded-xl shadow-sm w-fit"
          ><ArrowLeft className="w-5 h-5" /> <span className="font-bold">Back to Regions</span>
          </button>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-emerald-100 text-emerald-700 rounded-3xl border border-emerald-200 mb-8 shadow-sm">
              <Icon className="w-10 h-10" />
              <h1 className="text-4xl font-extrabold">{province.name}</h1>
            </div>
            <p className="text-2xl text-stone-800 font-black mb-4 tracking-tight drop-shadow-sm">{province.tagline}</p>
            <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed font-medium">{province.description}</p>
          </div>

          <div className="max-w-2xl mx-auto mb-16 px-4">
            <div className="relative group shadow-md rounded-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors w-5 h-5" />
              <input type="text" placeholder={`Search spots in ${province.name}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-16 pr-8 text-stone-900 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all font-semibold" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCities.map((city, i) => (
              <motion.div
                key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                onClick={() => handleCityClick(city)}
                className="bg-white rounded-[32px] overflow-hidden cursor-pointer group hover:shadow-xl shadow-sm border border-stone-200 transition-all hover:-translate-y-2"
              >
                <div className="h-44 bg-emerald-100 relative flex items-center justify-center overflow-hidden">
                   {/* ADDED IMAGE HERE */}
                   <img src={getImageSource(city.name, 800, 600)} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt={city.name} />
                  <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-transparent transition-colors duration-500" />
                  
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white text-[10px] font-black text-stone-800 uppercase tracking-widest shadow-lg">{city.attractions?.length || 0} Spots</div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-stone-900 mb-2 group-hover:text-emerald-600 transition-colors">{city.name}</h3>
                  <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed">{city.desc}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                     <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{city.bestTime || 'Year Round'}</span>
                     <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">Explore <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredCities.length === 0 && <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-stone-200 shadow-sm text-stone-500 font-bold text-lg">No spots found matching your search.</div>}
          </div>
        </div>
      </div>
    );
  }

  // 4. MAIN REGIONS VIEW
  const featured = getFeaturedDestinations();
  return (
    <div className="min-h-screen pt-20 sm:pt-24 p-4 sm:p-8 relative overflow-hidden bg-stone-50">
      {/* Background Decorative Elements for Light Mode */}
      <div className="absolute top-0 right-0 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-16 sm:mb-20 pt-8 sm:pt-12">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-white text-emerald-700 text-xs font-black uppercase tracking-widest mb-4 sm:mb-6 border border-emerald-200 shadow-sm"><span className="mr-2">🌿</span> Official Travel Guide</motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-black text-stone-900 mb-6 sm:mb-8 tracking-tighter drop-shadow-sm">Discover <span className="text-emerald-600">Pakistan</span></motion.h1>
          <div className="max-w-3xl mx-auto relative group shadow-lg rounded-3xl mx-4 sm:mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 w-6 h-6 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text" placeholder="Search destinations, cities, attractions..." value={searchQuery}
              onFocus={() => setShowSearch(true)} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-transparent focus:border-emerald-400 rounded-3xl py-5 sm:py-6 pl-16 pr-8 text-stone-900 focus:outline-none transition-all text-base sm:text-lg font-bold shadow-sm"
            />
          </div>
        </header>

        {/* Featured - NOW WITH PICTURES */}
        <section className="mb-20 sm:mb-24 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-8 sm:mb-10 flex items-center gap-3 border-b border-stone-200 pb-4"><Zap className="w-6 h-6 text-amber-500 bg-amber-50 p-1 rounded-md border border-amber-100" /> Featured Spots</h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {featured.map((dest, i) => (
              <motion.div
                key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                onClick={() => {
                  const pk = Object.keys(provincesData).find(k => provincesData[k].cities.some(c => c.name === dest.name));
                  if (pk) { setSelectedProvince(pk); setSelectedCity(dest); }
                }}
                className="bg-stone-900 h-80 rounded-[32px] sm:rounded-[40px] relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                {/* SAFE PICSUM PHOTOS TO ENSURE IT ALWAYS LOADS */}
                <img src={getImageSource(dest.name, 800, 600)} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" alt={dest.name} />
                
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20">
                  <span className="inline-block w-fit px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] text-white font-black uppercase tracking-[0.2em] mb-3 border border-white/30">{dest.province}</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:translate-x-2 transition-transform drop-shadow-md">{dest.name}</h3>
                  <p className="text-sm text-stone-200 mt-2 font-medium opacity-80 group-hover:opacity-100 transition-all duration-300 drop-shadow-sm line-clamp-2">{dest.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Regions */}
        <section className="mb-24 px-2 sm:px-0">
          <h2 className="text-3xl font-black text-stone-900 mb-10 flex items-center gap-3 border-b border-stone-200 pb-4"><Compass className="w-6 h-6 text-cyan-600 bg-cyan-50 p-1 rounded-md border border-cyan-100" /> Explore by Region</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(provincesData).map(([key, p], i) => {
              const Icon = iconMap[key] || MapPin;
              return (
                <motion.div
                  key={key} initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  onClick={() => handleProvinceClick(key)}
                  className="bg-white p-8 sm:p-10 rounded-[40px] cursor-pointer group border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all text-center flex flex-col hover:-translate-y-2"
                >
                  <div className="w-20 h-20 rounded-[28px] bg-emerald-50 flex items-center justify-center mx-auto mb-8 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                    <Icon className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors drop-shadow-sm">{p.name}</h2>
                  <p className="text-emerald-600 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] mb-4 bg-emerald-50/50 py-1 rounded-md">{p.tagline}</p>
                  <p className="text-stone-500 font-medium text-sm mb-8 line-clamp-3 leading-relaxed">{p.description}</p>
                  <div className="mt-auto inline-flex items-center justify-center gap-2 text-stone-700 font-bold text-xs bg-stone-50 border border-stone-200 px-6 py-3.5 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm">Explore Region <ChevronRight className="w-4 h-4" /></div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white p-12 md:p-20 rounded-[40px] sm:rounded-[60px] text-center border border-stone-200 shadow-lg mx-2 sm:mx-0 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px]" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-50 rounded-full blur-[80px]" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
            <div><div className="text-5xl font-black mb-2 text-emerald-600 drop-shadow-sm">6</div><p className="text-stone-400 font-black uppercase text-[10px] tracking-widest">Regions</p></div>
            <div><div className="text-5xl font-black mb-2 text-emerald-600 drop-shadow-sm">50+</div><p className="text-stone-400 font-black uppercase text-[10px] tracking-widest">Cities</p></div>
            <div><div className="text-5xl font-black mb-2 text-emerald-600 drop-shadow-sm">200+</div><p className="text-stone-400 font-black uppercase text-[10px] tracking-widest">Attractions</p></div>
            <div><div className="text-5xl font-black mb-2 text-emerald-600 drop-shadow-sm">∞</div><p className="text-stone-400 font-black uppercase text-[10px] tracking-widest">Memories</p></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
