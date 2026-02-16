import React from 'react';
import { MapPin, Phone, Globe, Navigation, ExternalLink } from 'lucide-react';

const PlaceCard = ({ place, onSelectPlace }) => {
    const {
        title,
        address,
        latitude,
        longitude,
        phone_number,
        website
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
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <p className="line-clamp-2">{address}</p>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
                {phone_number && (
                    <button
                        onClick={handleCallPhone}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm w-full group"
                    >
                        <Phone className="w-4 h-4" />
                        <span className="group-hover:underline">{phone_number}</span>
                    </button>
                )}
                {website && (
                    <button
                        onClick={handleVisitWebsite}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm w-full group"
                    >
                        <Globe className="w-4 h-4" />
                        <span className="group-hover:underline truncate">Visit Website</span>
                        <ExternalLink className="w-3 h-3 ml-auto" />
                    </button>
                )}
            </div>

            {/* Coordinates */}
            <div className="text-xs text-gray-400 mb-4">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={handleGetDirections}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                </button>
                {onSelectPlace && (
                    <button
                        onClick={() => onSelectPlace(place)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        Book Guide
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlaceCard;
