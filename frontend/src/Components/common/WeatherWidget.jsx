import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, ThermometerSun, RefreshCw, AlertCircle } from 'lucide-react';

const WeatherWidget = ({ cityName }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        if (!cityName) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/api/weather/${encodeURIComponent(cityName)}`);

            if (!response.ok) {
                throw new Error('Weather data not available');
            }

            const data = await response.json();
            setWeather(data);
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError('Unable to load weather');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [cityName]);

    // Get weather icon component based on condition
    const getWeatherIcon = (condition) => {
        const lowerCondition = condition?.toLowerCase() || '';

        if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
            return <Sun className="w-12 h-12 text-yellow-400" />;
        } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('shower')) {
            return <CloudRain className="w-12 h-12 text-blue-400" />;
        } else if (lowerCondition.includes('snow') || lowerCondition.includes('hail')) {
            return <CloudSnow className="w-12 h-12 text-blue-200" />;
        } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
            return <Cloud className="w-12 h-12 text-gray-400" />;
        } else {
            return <ThermometerSun className="w-12 h-12 text-orange-400" />;
        }
    };

    // Get gradient based on temperature
    const getTemperatureGradient = (temp) => {
        if (temp <= 0) return 'from-blue-600 to-cyan-500';
        if (temp <= 10) return 'from-cyan-500 to-teal-500';
        if (temp <= 20) return 'from-teal-500 to-green-500';
        if (temp <= 30) return 'from-yellow-400 to-orange-500';
        return 'from-orange-500 to-red-500';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center gap-3 text-red-500">
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-sm">{error}</span>
                    <button
                        onClick={fetchWeather}
                        className="ml-auto p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className={`bg-gradient-to-r ${getTemperatureGradient(weather.temperature)} rounded-2xl p-6 shadow-lg text-white overflow-hidden relative`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-white/80 text-sm font-medium">Current Weather</p>
                        <h3 className="text-xl font-bold">{weather.city}</h3>
                    </div>
                    <button
                        onClick={fetchWeather}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        title="Refresh weather"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Weather Info */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                            {getWeatherIcon(weather.condition)}
                        </div>
                        <div>
                            <div className="text-5xl font-bold">
                                {Math.round(weather.temperature)}°C
                            </div>
                            <p className="text-white/80 text-sm">
                                Feels like {Math.round(weather.feels_like)}°C
                            </p>
                        </div>
                    </div>
                </div>

                {/* Condition */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-2xl">{weather.icon}</span>
                    <span className="text-lg font-medium">{weather.condition}</span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                        <Wind className="w-5 h-5" />
                        <div>
                            <p className="text-white/70 text-xs">Wind</p>
                            <p className="font-semibold">{weather.wind_speed} km/h</p>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                        <Droplets className="w-5 h-5" />
                        <div>
                            <p className="text-white/70 text-xs">Humidity</p>
                            <p className="font-semibold">{weather.humidity}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
