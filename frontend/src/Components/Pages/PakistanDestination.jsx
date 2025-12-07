import React, { useState } from 'react';
import { MapPin, ArrowLeft, Mountain, Building2, Palmtree, Trees, Waves, Search } from 'lucide-react';

const provincesData = {
  punjab: {
    name: 'Punjab',
    icon: Building2,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    description: 'The land of five rivers, rich culture, and historical monuments',
    cities: [
      { name: 'Lahore', desc: 'Heart of Pakistan - Badshahi Mosque, Lahore Fort' },
      { name: 'Islamabad', desc: 'Capital city - Faisal Mosque, Margalla Hills' },
      { name: 'Rawalpindi', desc: 'Twin city - Raja Bazaar, Ayub National Park' },
      { name: 'Faisalabad', desc: 'Industrial hub - Clock Tower, Jinnah Garden' },
      { name: 'Multan', desc: 'City of Saints - Sufi shrines, historic forts' },
      { name: 'Gujranwala', desc: 'Industrial city - Jinnah Stadium, parks' },
      { name: 'Sialkot', desc: 'Sports goods capital - Iqbal Manzil' },
      { name: 'Bahawalpur', desc: 'Desert beauty - Derawar Fort, palaces' }
    ]
  },
  sindh: {
    name: 'Sindh',
    icon: Waves,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    description: 'Ancient civilization meets modern coastal life',
    cities: [
      { name: 'Karachi', desc: 'City of lights - Clifton Beach, Mohatta Palace' },
      { name: 'Hyderabad', desc: 'Historic city - Pakka Qila, Rani Bagh' },
      { name: 'Sukkur', desc: 'Barrage city - Lansdowne Bridge, Seven Sisters' },
      { name: 'Larkana', desc: 'Gateway to Mohenjo-daro ruins' },
      { name: 'Mirpur Khas', desc: 'Famous for mangoes and handicrafts' },
      { name: 'Nawabshah', desc: 'Agricultural hub with rich history' },
      { name: 'Thatta', desc: 'Shah Jahan Mosque, Makli Necropolis' },
      { name: 'Jacobabad', desc: 'Historic town with unique culture' }
    ]
  },
  kpk: {
    name: 'Khyber Pakhtunkhwa',
    icon: Mountain,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    description: 'Majestic mountains, lush valleys, and ancient history',
    cities: [
      { name: 'Peshawar', desc: 'Historic city - Qissa Khwani Bazaar, Bala Hisar' },
      { name: 'Abbottabad', desc: 'Hill station - Pleasant weather, pine forests' },
      { name: 'Mardan', desc: 'Ancient Gandhara heritage site' },
      { name: 'Swat', desc: 'Switzerland of Pakistan - Kalam, Malam Jabba' },
      { name: 'Mansehra', desc: 'Gateway to northern areas' },
      { name: 'Kohat', desc: 'Historic fort city with unique culture' },
      { name: 'Bannu', desc: 'Cultural heritage and historic sites' },
      { name: 'Chitral', desc: 'Kalash valleys, Tirich Mir peak' }
    ]
  },
  balochistan: {
    name: 'Balochistan',
    icon: Palmtree,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    description: 'Vast deserts, coastal beauty, and mineral treasures',
    cities: [
      { name: 'Quetta', desc: 'Fruit garden - Hanna Lake, Ziarat' },
      { name: 'Gwadar', desc: 'Port city - Beautiful beaches, marine drive' },
      { name: 'Turbat', desc: 'Dates capital with historic sites' },
      { name: 'Khuzdar', desc: 'Archaeological sites and natural beauty' },
      { name: 'Sibi', desc: 'Historic city - Annual horse & cattle show' },
      { name: 'Zhob', desc: 'Valley town with scenic landscapes' },
      { name: 'Loralai', desc: 'Fort town with tribal culture' },
      { name: 'Chaman', desc: 'Border town - Gateway to Afghanistan' }
    ]
  },
  gilgit: {
    name: 'Gilgit-Baltistan',
    icon: Trees,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    description: 'Heaven on earth - Home to world\'s highest peaks',
    cities: [
      { name: 'Gilgit', desc: 'Gateway to mountains - Kargah Buddha' },
      { name: 'Skardu', desc: 'K2 base - Shangrila, Deosai Plains' },
      { name: 'Hunza', desc: 'Paradise valley - Attabad Lake, Altit Fort' },
      { name: 'Chilas', desc: 'Ancient rock carvings, KKH junction' },
      { name: 'Ghanche', desc: 'Khaplu Palace, scenic valleys' },
      { name: 'Khaplu', desc: 'Historic fort, apricot orchards' },
      { name: 'Nagar', desc: 'Traditional culture, Rakaposhi view' },
      { name: 'Astore', desc: 'Nanga Parbat base, fairy meadows' }
    ]
  }
};

export default function PakistanDestinations() {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProvinceClick = (provinceKey) => {
    setSelectedProvince(provinceKey);
    setSearchQuery('');
  };

  const handleBack = () => {
    setSelectedProvince(null);
    setSearchQuery('');
  };

  if (selectedProvince) {
    const province = provincesData[selectedProvince];
    const Icon = province.icon;
    
    // Filter cities based on search query
    const filteredCities = province.cities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
      <div className={`min-h-screen ${province.bgColor} p-8`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-8 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Provinces</span>
          </button>
          
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r ${province.color} text-white rounded-2xl shadow-2xl mb-4`}>
              <Icon className="w-10 h-10" />
              <h1 className="text-4xl font-bold">{province.name}</h1>
            </div>
            <p className="text-gray-700 text-lg font-medium mt-4">{province.description}</p>
            <p className="text-gray-500 text-sm mt-2">Explore amazing destinations</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCities.map((city, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 p-6 cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-linear-to-br ${province.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{city.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{city.desc}</p>
                  <div className="h-1 w-12 bg-linear-to-r from-gray-300 to-gray-100 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <p className="text-xl text-gray-600 font-semibold">No cities found</p>
              <p className="text-gray-500 mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Discover Pakistan
          </h1>
          <p className="text-xl text-gray-600">Explore the beauty of five provinces</p>
          <div className="mt-4 h-1 w-24 bg-linear-to-r from-green-500 to-green-300 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(provincesData).map(([key, province]) => {
            const Icon = province.icon;
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
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-green-600 group-hover:to-green-400 transition-all duration-300">
                      {province.name}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {province.description}
                    </p>
                    
                    <p className="text-gray-500 text-xs mb-4">
                      {province.cities.length} Cities to Explore
                    </p>
                    
                    <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Explore Now</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className={`h-2 bg-linear-to-r ${province.color}`}></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center text-gray-500">
          <p className="text-sm">Click on any province to explore its cities</p>
        </div>
      </div>
    </div>
  );
}