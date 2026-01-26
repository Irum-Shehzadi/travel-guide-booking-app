from fastapi import APIRouter, HTTPException, status
import httpx
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/weather", tags=["Weather"])

# Pakistan cities coordinates - Latitude, Longitude
CITY_COORDINATES = {
    # Punjab
    "lahore": (31.5497, 74.3436),
    "islamabad": (33.6844, 73.0479),
    "rawalpindi": (33.5651, 73.0169),
    "multan": (30.1575, 71.5249),
    "bahawalpur": (29.3956, 71.6836),
    "faisalabad": (31.4504, 73.1350),
    "sialkot": (32.4945, 74.5229),
    "gujranwala": (32.1877, 74.1945),
    
    # Sindh
    "karachi": (24.8607, 67.0011),
    "hyderabad": (25.3960, 68.3578),
    "larkana": (27.5570, 68.2120),
    "thatta": (24.7461, 67.9239),
    "sukkur": (27.7052, 68.8574),
    
    # KPK
    "peshawar": (34.0151, 71.5249),
    "swat valley": (35.2227, 72.3528),
    "chitral": (35.8508, 71.7869),
    "abbottabad": (34.1688, 73.2215),
    "naran kaghan": (34.9039, 73.6502),
    "dir": (35.2074, 71.8768),
    "kumrat": (35.5361, 72.2208),
    
    # Balochistan
    "quetta": (30.1798, 66.9750),
    "gwadar": (25.1216, 62.3254),
    "ziarat": (30.3817, 67.7269),
    "hingol": (25.5088, 65.5234),
    
    # Gilgit-Baltistan
    "gilgit": (35.9208, 74.3144),
    "hunza valley": (36.3167, 74.6500),
    "skardu": (35.2971, 75.6334),
    "deosai": (34.9740, 75.4018),
    "fairy meadows": (35.4213, 74.5891),
    "khaplu": (35.1503, 76.3256),
    
    # Azad Kashmir
    "muzaffarabad": (34.3700, 73.4711),
    "neelum valley": (34.5927, 74.3414),
    "rawalakot": (33.8578, 73.7603),
}

# Weather condition codes mapping
WEATHER_CONDITIONS = {
    0: {"condition": "Clear Sky", "icon": "☀️"},
    1: {"condition": "Mainly Clear", "icon": "🌤️"},
    2: {"condition": "Partly Cloudy", "icon": "⛅"},
    3: {"condition": "Overcast", "icon": "☁️"},
    45: {"condition": "Foggy", "icon": "🌫️"},
    48: {"condition": "Depositing Rime Fog", "icon": "🌫️"},
    51: {"condition": "Light Drizzle", "icon": "🌧️"},
    53: {"condition": "Moderate Drizzle", "icon": "🌧️"},
    55: {"condition": "Dense Drizzle", "icon": "🌧️"},
    61: {"condition": "Slight Rain", "icon": "🌧️"},
    63: {"condition": "Moderate Rain", "icon": "🌧️"},
    65: {"condition": "Heavy Rain", "icon": "🌧️"},
    66: {"condition": "Light Freezing Rain", "icon": "🌨️"},
    67: {"condition": "Heavy Freezing Rain", "icon": "🌨️"},
    71: {"condition": "Slight Snow", "icon": "🌨️"},
    73: {"condition": "Moderate Snow", "icon": "🌨️"},
    75: {"condition": "Heavy Snow", "icon": "❄️"},
    77: {"condition": "Snow Grains", "icon": "❄️"},
    80: {"condition": "Slight Rain Showers", "icon": "🌦️"},
    81: {"condition": "Moderate Rain Showers", "icon": "🌦️"},
    82: {"condition": "Violent Rain Showers", "icon": "⛈️"},
    85: {"condition": "Slight Snow Showers", "icon": "🌨️"},
    86: {"condition": "Heavy Snow Showers", "icon": "🌨️"},
    95: {"condition": "Thunderstorm", "icon": "⛈️"},
    96: {"condition": "Thunderstorm with Hail", "icon": "⛈️"},
    99: {"condition": "Thunderstorm with Heavy Hail", "icon": "⛈️"},
}


class WeatherResponse(BaseModel):
    city: str
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    condition: str
    icon: str
    latitude: float
    longitude: float


@router.get("/{city}", response_model=WeatherResponse)
async def get_weather(city: str):
    """Get current weather for a Pakistan city"""
    
    city_lower = city.lower().strip()
    
    # Find city coordinates
    if city_lower not in CITY_COORDINATES:
        # Try partial match
        matching_cities = [c for c in CITY_COORDINATES.keys() if city_lower in c or c in city_lower]
        if matching_cities:
            city_lower = matching_cities[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"City '{city}' not found. Available cities: {', '.join(CITY_COORDINATES.keys())}"
            )
    
    lat, lon = CITY_COORDINATES[city_lower]
    
    # Call Open-Meteo API
    api_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
        "timezone": "Asia/Karachi"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Weather service unavailable: {str(e)}"
        )
    
    # Parse response
    current = data.get("current", {})
    weather_code = current.get("weather_code", 0)
    weather_info = WEATHER_CONDITIONS.get(weather_code, {"condition": "Unknown", "icon": "🌡️"})
    
    return WeatherResponse(
        city=city.title(),
        temperature=current.get("temperature_2m", 0),
        feels_like=current.get("apparent_temperature", 0),
        humidity=current.get("relative_humidity_2m", 0),
        wind_speed=current.get("wind_speed_10m", 0),
        condition=weather_info["condition"],
        icon=weather_info["icon"],
        latitude=lat,
        longitude=lon
    )


@router.get("/")
async def get_available_cities():
    """Get list of available cities for weather data"""
    return {
        "available_cities": list(CITY_COORDINATES.keys()),
        "total": len(CITY_COORDINATES)
    }
