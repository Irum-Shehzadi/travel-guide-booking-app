import React from 'react';
import { MapPin, Phone, Globe, Navigation, Star } from 'lucide-react';

const PlaceCard = ({ place }) => {
    const {
        title,
        address,
        latitude,
        longitude,
        phone_number,
        website,
        thumbnail,
        rating,
        ratingCount,
        category
    } = place;

    const handleGetDirections = () => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        window.open(mapsUrl, '_blank');
    };

    const handleCallPhone = () => {
        if (phone_number) {
            window.location.href = `tel:${phone_number}`;
        }
    };

    const handleVisitWebsite = () => {
        if (website) {
            window.open(website, '_blank');
        }
    };

    return (
        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:bg-white/10 transition-all group">
            {/* Image (if available) */}
            {thumbnail ? (
                <div className="h-40 overflow-hidden relative">
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full text-[10px] font-bold text-azure uppercase tracking-widest">{category || 'Place'}</div>
                </div>
            ) : (
                <div className="h-24 bg-gradient-to-br from-azure/10 to-transparent flex items-center justify-center">
                   <MapPin className="w-8 h-8 text-azure/30" />
                </div>
            )}

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-azure transition-colors leading-tight line-clamp-1">{title}</h3>
                    {rating && (
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-white">{rating}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-2 text-gray-500 text-xs mb-6">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <p className="line-clamp-2">{address}</p>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 mb-6">
                    {phone_number && (
                        <button
                            onClick={handleCallPhone}
                            className="flex items-center gap-2 text-azure hover:text-white text-xs font-bold transition-all group"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="truncate">{phone_number}</span>
                        </button>
                    )}
                    {website && (
                        <button
                            onClick={handleVisitWebsite}
                            className="flex items-center gap-2 text-azure hover:text-white text-xs font-bold transition-all group"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">Visit Website</span>
                        </button>
                    )}
                </div>

                {/* Actions */}
                <button
                    onClick={handleGetDirections}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-azure/10 text-azure border border-azure/20 rounded-2xl text-xs font-bold hover:bg-azure hover:text-white transition-all duration-300"
                >
                    <Navigation className="w-4 h-4" />
                    GET DIRECTIONS
                </button>
            </div>
        </div>
    );
};

export default PlaceCard;
