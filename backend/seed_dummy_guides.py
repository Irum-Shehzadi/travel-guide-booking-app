import asyncio
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from utils import get_password_hash

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

# Cities extracted from frontend destinations.js
CITIES = [
    "Lahore", "Islamabad", "Rawalpindi", "Multan", "Bahawalpur", "Faisalabad", "Sialkot", "Gujranwala",
    "Karachi", "Hyderabad", "Larkana", "Thatta", "Sukkur", "Mirpur Khas",
    "Peshawar", "Swat Valley", "Chitral", "Abbottabad", "Naran Kaghan", "Dir & Kumrat",
    "Quetta", "Gwadar", "Ziarat", "Hingol National Park",
    "Gilgit", "Hunza Valley", "Skardu", "Deosai National Park", "Fairy Meadows", "Khaplu",
    "Muzaffarabad", "Neelum Valley", "Rawalakot"
]

DUMMY_PROFILE_PHOTOS = [
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
]

async def seed_guides():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
    db = client[DATABASE_NAME]
    
    collection = db.guides
    
    hashed_password = get_password_hash("password123")
    
    guides_inserted = 0
    
    for idx, city in enumerate(CITIES):
        # Create 1 dummy guide for each city
        email = f"guide_{city.lower().replace(' ', '_').replace('&', 'and')}@example.com"
        
        # Check if guide already exists
        existing = await collection.find_one({"email": email})
        if existing:
            print(f"Guide for {city} ({email}) already exists. Skipping.")
            continue
            
        guide_doc = {
            "fullName": f"{city} Guide {idx+1}",
            "email": email,
            "phone": "03001234567",
            "city": city,
            "experience": 5,
            "about": f"Hi, I am a professional guide for {city}. I have years of experience showing travelers the beautiful sights, rich culture, and hidden gems of {city}. Let's make your trip unforgettable!",
            "languages": ["English", "Urdu", "Punjabi", "Pashto", "Sindhi"][:3],  # Some subset
            "specializations": ["Historical Tours", "Nature Walks", "Food Tours", "Adventure"],
            "certifications": "Certified Tourism Professional",
            "profile_photo": DUMMY_PROFILE_PHOTOS[idx % len(DUMMY_PROFILE_PHOTOS)],
            "cnic_number": f"35201-1234567-{idx % 10}",
            "cnic_photo": "",
            "is_verified": True,  # verified so they show up
            "is_active": True,
            "rating": 4.5 + (idx % 5) / 10.0,
            "total_bookings": 10 + (idx % 20),
            "hashed_password": hashed_password,
            "created_at": datetime.now(timezone.utc),
            # Reporting & Blocking
            "report_count": 0,
            "is_blocked": False,
            "blocked_until": None,
            "is_permanently_blocked": False
        }
        
        await collection.insert_one(guide_doc)
        print(f"Inserted guide for {city}: {guide_doc['fullName']}")
        guides_inserted += 1
        
    print(f"Successfully inserted {guides_inserted} dummy guides.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_guides())
