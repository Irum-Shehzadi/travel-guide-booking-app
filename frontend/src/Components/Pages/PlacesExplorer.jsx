import React, { useState } from 'react';
import { MapPin, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlacesSearch from '../PlacesSearch';

const PlacesExplorer = () => {
    const navigate = useNavigate();

    const handleSelectPlace = (place) => {
        // Navigate to booking form with pre-filled destination
        navigate('/guide-booking', {
            state: {
                destination: place.title,
                location: place.address
            }
        });
    };

    // Popular search suggestions for Pakistan
    const popularSearches = [
        { query: "restaurants in Lahore", location: "Lahore, Pakistan" },
        { query: "hotels in Islamabad", location: "Islamabad, Pakistan" },
        { query: "tourist attractions in Karachi", location: "Karachi, Pakistan" },
        { query: "historical places in Multan", location: "Multan, Pakistan" },
        { query: "cafes in Peshawar", location: "Peshawar, Pakistan" },
        { query: "museums in Lahore", location: "Lahore, Pakistan" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                        <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Explore Places in Pakistan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover restaurants, hotels, tourist attractions, and more across Pakistan.
                        Find the perfect places for your next adventure!
                    </p>
                </div>

                {/* Main Search Component */}
                <PlacesSearch onSelectPlace={handleSelectPlace} />

                {/* Popular Searches */}
                <div className="mt-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h2 className="text-xl font-bold text-gray-800">Popular Searches</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {popularSearches.map((search, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    // This would trigger a search - we'd need to pass this to PlacesSearch
                                    // For now, just showing the UI
                                }}
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-800 group-hover:text-blue-600">
                                            {search.query}
                                        </p>
                                        <p className="text-sm text-gray-500">{search.location}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold mb-2">10,000+</div>
                            <p className="text-blue-100">Places Available</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-2">Real-Time</div>
                            <p className="text-blue-100">Up-to-date Information</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-2">Pakistan-Wide</div>
                            <p className="text-blue-100">Coverage</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacesExplorer;
