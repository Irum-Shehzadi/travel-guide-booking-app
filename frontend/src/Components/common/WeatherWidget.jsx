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
            <div className="glass-panel p-8 rounded-[32px] animate-pulse">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-3 bg-white/5 rounded-full w-1/4"></div>
                        <div className="h-6 bg-white/5 rounded-full w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel p-8 rounded-[32px] border border-red-500/20 group">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h4 className="text-white font-bold mb-1">Weather Sync Failed</h4>
                    <p className="text-gray-500 text-xs mb-4 max-w-[200px]">{error}</p>
                    <button
                        onClick={fetchWeather}
                        className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        RETRY SYNC
                    </button>
                </div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="glass-panel p-8 rounded-[40px] overflow-hidden relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${getTemperatureGradient(weather.temperature)} opacity-[0.03] z-0 transition-opacity duration-500 group-hover:opacity-[0.06]`} />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <RefreshCw className="w-3.5 h-3.5 text-azure" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Climate</span>
                        </div>
                        <h3 className="text-3xl font-black text-white">{weather.city}</h3>
                    </div>
                    <button
                        onClick={fetchWeather}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                        title="Refresh weather"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-end justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/5 rounded-[28px] flex items-center justify-center text-4xl shadow-inner border border-white/5">
                            {weather.icon}
                        </div>
                        <div>
                            <div className="text-6xl font-black text-white tracking-tighter">
                                {Math.round(weather.temperature)}<span className="text-azure text-3xl font-medium">°</span>
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                                {weather.condition}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Human Sense</p>
                        <p className="text-2xl font-bold text-white tracking-tight">{Math.round(weather.feels_like)}°C</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group/item hover:bg-white/10 transition-all">
                        <div className="w-10 h-10 bg-azure/10 rounded-xl flex items-center justify-center text-azure group-hover/item:scale-110 transition-transform">
                            <Wind className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Wind Flow</p>
                            <p className="font-bold text-white">{weather.wind_speed}<span className="text-[10px] ml-1 text-gray-500">KM/H</span></p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group/item hover:bg-white/10 transition-all">
                        <div className="w-10 h-10 bg-aurora/10 rounded-xl flex items-center justify-center text-aurora group-hover/item:scale-110 transition-transform">
                            <Droplets className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Humidity</p>
                            <p className="font-bold text-white">{weather.humidity}<span className="text-[10px] ml-1 text-gray-500">%</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
