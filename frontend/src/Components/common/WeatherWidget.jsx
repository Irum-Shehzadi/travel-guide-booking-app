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
            const response = await fetch(`https://travel-guide-fyp.duckdns.org/api/weather/${encodeURIComponent(cityName)}`);

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
            return <Sun className="w-12 h-12 text-amber-500" />;
        } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('shower')) {
            return <CloudRain className="w-12 h-12 text-cyan-600" />;
        } else if (lowerCondition.includes('snow') || lowerCondition.includes('hail')) {
            return <CloudSnow className="w-12 h-12 text-cyan-400" />;
        } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
            return <Cloud className="w-12 h-12 text-stone-400" />;
        } else {
            return <ThermometerSun className="w-12 h-12 text-orange-500" />;
        }
    };

    // Get gradient based on temperature
    const getTemperatureGradient = (temp) => {
        if (temp <= 0) return 'from-cyan-600 to-emerald-500';
        if (temp <= 10) return 'from-emerald-500 to-teal-500';
        if (temp <= 20) return 'from-teal-500 to-green-500';
        if (temp <= 30) return 'from-amber-400 to-orange-500';
        return 'from-orange-500 to-red-500';
    };

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-[32px] border border-stone-200 shadow-sm animate-pulse">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-stone-100 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-3 bg-stone-100 rounded-full w-1/4"></div>
                        <div className="h-6 bg-stone-100 rounded-full w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-8 rounded-[32px] border border-red-200 shadow-sm group">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-red-100">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h4 className="text-stone-900 font-black mb-1">Weather Sync Failed</h4>
                    <p className="text-stone-500 text-xs mb-4 max-w-[200px] font-medium">{error}</p>
                    <button
                        onClick={fetchWeather}
                        className="flex items-center gap-2 px-6 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition-all border border-stone-200"
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
        <div className="bg-white p-8 rounded-[40px] overflow-hidden relative group border border-stone-200 shadow-sm hover:shadow-md transition-all">
            <div className={`absolute inset-0 bg-gradient-to-br ${getTemperatureGradient(weather.temperature)} opacity-[0.05] z-0 transition-opacity duration-500 group-hover:opacity-[0.08]`} />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Live Climate</span>
                        </div>
                        <h3 className="text-3xl font-black text-stone-900">{weather.city}</h3>
                    </div>
                    <button
                        onClick={fetchWeather}
                        className="w-10 h-10 flex items-center justify-center bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-emerald-600 rounded-xl transition-all border border-stone-200 shadow-sm"
                        title="Refresh weather"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-end justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-stone-50 rounded-[28px] flex items-center justify-center text-4xl shadow-sm border border-stone-200/50">
                            {weather.icon}
                        </div>
                        <div>
                            <div className="text-6xl font-black text-stone-900 tracking-tighter drop-shadow-sm">
                                {Math.round(weather.temperature)}<span className="text-emerald-600 text-3xl font-black">°</span>
                            </div>
                            <p className="text-xs text-stone-400 font-black uppercase mt-1 tracking-widest">
                                {weather.condition}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">Human Sense</p>
                        <p className="text-2xl font-black text-stone-900 tracking-tight">{Math.round(weather.feels_like)}°C</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 flex items-center gap-4 group/item hover:bg-white hover:shadow-sm hover:border-stone-200 transition-all">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover/item:scale-110 transition-transform border border-emerald-100">
                            <Wind className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Wind Flow</p>
                            <p className="font-black text-stone-700">{weather.wind_speed}<span className="text-[10px] ml-1 text-stone-400 font-bold">KM/H</span></p>
                        </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 flex items-center gap-4 group/item hover:bg-white hover:shadow-sm hover:border-stone-200 transition-all">
                        <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover/item:scale-110 transition-transform border border-cyan-100">
                            <Droplets className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Humidity</p>
                            <p className="font-black text-stone-700">{weather.humidity}<span className="text-[10px] ml-1 text-stone-400 font-bold">%</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
