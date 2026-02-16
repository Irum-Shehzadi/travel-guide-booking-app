import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, MapPin, X } from 'lucide-react';
import { searchPlaces } from '../api/places';
import PlaceCard from './PlaceCard';

const PlacesSearch = ({ defaultQuery = "", defaultLocation = "Pakistan", onSelectPlace }) => {
    const [query, setQuery] = useState(defaultQuery);
    const [location, setLocation] = useState(defaultLocation);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Debounce search
    useEffect(() => {
        if (defaultQuery && !hasSearched) {
            handleSearch();
        }
    }, [defaultQuery]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        if (!query.trim()) {
            setError("Please enter a search query");
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const result = await searchPlaces(query, location, "pk", 10);
            setPlaces(result.places || []);

            if (result.places?.length === 0) {
                setError("No places found. Try a different search.");
            }
        } catch (err) {
            setError(err.message || "Failed to search places");
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setQuery("");
        setPlaces([]);
        setError(null);
        setHasSearched(false);
    };

    return (
        <div className="w-full">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Search Query Input */}
                        <div className="md:col-span-6 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What are you looking for?
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., restaurants, hotels, tourist spots..."
                                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="md:col-span-4 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="City or region"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-2 flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Results */}
            {hasSearched && !loading && places.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            Found {places.length} {places.length === 1 ? 'place' : 'places'}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map((place, index) => (
                            <PlaceCard
                                key={`${place.cid || index}`}
                                place={place}
                                onSelectPlace={onSelectPlace}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Searching for places...</p>
                </div>
            )}

            {/* Empty State */}
            {hasSearched && !loading && places.length === 0 && !error && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No places found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms</p>
                </div>
            )}
        </div>
    );
};

export default PlacesSearch;
