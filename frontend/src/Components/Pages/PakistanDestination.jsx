import React, { useState } from 'react';
import { MapPin, ArrowLeft, Mountain, Building2, Palmtree, Trees, Waves, Search, Star, Clock, Camera, ChevronRight, X, Calendar, Compass } from 'lucide-react';
import { provincesData, getAllCities, getFeaturedDestinations, searchDestinations } from '../../data/destinations';
import WeatherWidget from '../common/WeatherWidget';

// Icon mapping for provinces
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

  const handleProvinceClick = (provinceKey) => {
    setSelectedProvince(provinceKey);
    setSelectedCity(null);
    setSearchQuery('');
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  const handleBack = () => {
    if (selectedCity) {
      setSelectedCity(null);
    } else {
      setSelectedProvince(null);
    }
    setSearchQuery('');
  };

  const handleBackToHome = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    setSearchQuery('');
    setShowSearch(false);
  };

  // Search results view
  if (showSearch && searchQuery) {
    const results = searchDestinations(searchQuery);

    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => { setShowSearch(false); setSearchQuery(''); }}
            className="flex items-center gap-2 mb-8 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Provinces</span>
          </button>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, cities, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none shadow-lg text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Found {results.length} destinations for "{searchQuery}"
          </h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((city, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCity(city);
                    setSelectedProvince(city.provinceKey);
                    setShowSearch(false);
                  }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
                >
                  <div className={`h-32 bg-linear-to-br ${city.color} flex items-center justify-center`}>
                    <span className="text-white text-4xl font-bold opacity-50">{city.name.charAt(0)}</span>
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-blue-600 font-semibold">{city.province}</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{city.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{city.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No destinations found</p>
              <p className="text-gray-500 mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // City detail view
  if (selectedCity) {
    const province = provincesData[selectedProvince];

    return (
      <div className={`min-h-screen ${province.bgColor}`}>
        {/* Hero Section */}
        <div className={`relative h-80 bg-linear-to-r ${province.color} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10">
              <p className="text-sm uppercase tracking-wider mb-2">{province.name}</p>
              <h1 className="text-5xl font-bold mb-4">{selectedCity.name}</h1>
              <p className="text-xl opacity-90">{selectedCity.desc}</p>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-20"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <div className="max-w-6xl mx-auto p-8 -mt-16 relative z-10">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-linear-to-r ${province.color}`}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Best Time to Visit</p>
                  <p className="font-bold text-gray-800">{selectedCity.bestTime || 'Year Round'}</p>
                </div>
              </div>
            </div>
            {selectedCity.population && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-linear-to-r ${province.color}`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Population</p>
                    <p className="font-bold text-gray-800">{selectedCity.population}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-linear-to-r ${province.color}`}>
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Attractions</p>
                  <p className="font-bold text-gray-800">{selectedCity.attractions?.length || 0}+ Places</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="mb-8">
            <WeatherWidget cityName={selectedCity.name} />
          </div>

          {/* Description */}
          {selectedCity.fullDescription && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About {selectedCity.name}</h2>
              <p className="text-gray-600 leading-relaxed">{selectedCity.fullDescription}</p>
            </div>
          )}

          {/* Attractions */}
          {selectedCity.attractions && selectedCity.attractions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Top Attractions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCity.attractions.map((attraction, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${province.color} flex items-center justify-center shrink-0`}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{attraction.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{attraction.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{attraction.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {selectedCity.activities && selectedCity.activities.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Things to Do</h2>
              <div className="flex flex-wrap gap-3">
                {selectedCity.activities.map((activity, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 bg-linear-to-r ${province.color} text-white rounded-full font-medium`}
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Province cities view
  if (selectedProvince) {
    const province = provincesData[selectedProvince];
    const Icon = iconMap[selectedProvince] || Mountain;

    const filteredCities = province.cities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className={`min-h-screen ${province.bgColor} p-8`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 mb-8 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Provinces</span>
          </button>

          {/* Province Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r ${province.color} text-white rounded-2xl shadow-2xl mb-4`}>
              <Icon className="w-10 h-10" />
              <h1 className="text-4xl font-bold">{province.name}</h1>
            </div>
            <p className="text-2xl text-gray-700 font-medium mt-4">{province.tagline}</p>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{province.description}</p>

            {/* Highlights */}
            {province.highlights && (
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {province.highlights.map((highlight, index) => (
                  <span key={index} className="px-4 py-2 bg-white rounded-full shadow text-gray-700 text-sm font-medium">
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-500 text-sm mt-4">
              <Clock className="w-4 h-4 inline mr-1" />
              Best Time: {province.bestTime}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none shadow-lg text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Cities Grid */}
          {filteredCities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCities.map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleCityClick(city)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 overflow-hidden cursor-pointer group"
                >
                  {/* City Image/Gradient */}
                  <div className={`h-40 bg-linear-to-br ${province.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/30 text-8xl font-bold">{city.name.charAt(0)}</span>
                    </div>
                    {city.attractions && (
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                        {city.attractions.length} Attractions
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{city.desc}</p>

                    {/* Activities Preview */}
                    {city.activities && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {city.activities.slice(0, 3).map((activity, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {activity}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {city.bestTime || 'Year Round'}
                      </span>
                      <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-600 font-semibold">No cities found</p>
              <p className="text-gray-500 mt-2">Try different keywords</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main provinces view
  const featuredDestinations = getFeaturedDestinations();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-green-600 via-blue-600 to-purple-600 text-white py-20 px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Discover Pakistan
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              From ancient civilizations to the roof of the world
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search destinations, cities, attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Featured Destinations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Destinations</h2>
          <p className="text-gray-600 mb-8">Most popular places to visit in Pakistan</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((dest, index) => (
              <div
                key={index}
                onClick={() => {
                  const provinceKey = Object.keys(provincesData).find(key =>
                    provincesData[key].cities.some(c => c.name === dest.name)
                  );
                  if (provinceKey) {
                    setSelectedProvince(provinceKey);
                    setSelectedCity(dest);
                  }
                }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-64 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <span className="text-sm uppercase tracking-wider opacity-80">{dest.province}</span>
                    <h3 className="text-2xl font-bold">{dest.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{dest.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Provinces Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore by Province</h2>
          <p className="text-gray-600 mb-8">Choose a region to discover its treasures</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(provincesData).map(([key, province]) => {
              const Icon = iconMap[key] || Mountain;
              return (
                <div
                  key={key}
                  onClick={() => handleProvinceClick(key)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105 hover:-translate-y-3">
                    <div className={`absolute inset-0 bg-linear-to-br ${province.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                    <div className="p-8">
                      <div className={`w-20 h-20 bg-linear-to-br ${province.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>

                      <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-300">
                        {province.name}
                      </h2>

                      <p className="text-blue-600 font-medium text-sm mb-3">{province.tagline}</p>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {province.description}
                      </p>

                      <p className="text-gray-500 text-xs mb-4">
                        {province.cities.length} Cities to Explore
                      </p>

                      <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                        <span>Explore Now</span>
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </div>
                    </div>

                    <div className={`h-2 bg-linear-to-r ${province.color}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-linear-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">6</div>
              <div className="text-green-100">Regions</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-green-100">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold">200+</div>
              <div className="text-green-100">Attractions</div>
            </div>
            <div>
              <div className="text-4xl font-bold">∞</div>
              <div className="text-green-100">Memories</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p className="text-sm">Click on any province to explore its cities and attractions</p>
        </div>
      </div>
    </div>
  );
}