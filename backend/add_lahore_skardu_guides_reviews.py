import asyncio
import os
import random
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from utils import get_password_hash

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

NAMES_LAHORE = ["Zoya Ahmed", "Bilal Qureshi", "Amina Tariq", "Faizan Ali"]
NAMES_SKARDU = ["Abbas Ali", "Zahra Hussain", "Sikandar Khan", "Maryam Zafar"]

DUMMY_PROFILE_PHOTOS = [
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
]

REVIEWS = [
    "Great experience, very knowledgeable guide!",
    "Showed us the best spots that are not usually crowded. Highly recommended.",
    "Very friendly and professional. Made our trip memorable.",
    "Excellent service, knew a lot about the local history and culture.",
    "Absolutely amazing! The guide was patient and very helpful with everything.",
    "Best tour we've ever had. Very accommodating to our needs."
]

TRAVELER_NAMES = ["Hassan", "Sara", "Ali", "Fatima", "Usman", "Sana", "Omar", "Ayesha"]

async def seed_extra():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
    db = client[DATABASE_NAME]
    
    hashed_password = get_password_hash("password123")
    
    # Process Lahore and Skardu
    targets = [
        {"city": "Lahore", "names": NAMES_LAHORE},
        {"city": "Skardu", "names": NAMES_SKARDU}
    ]
    
    total_guides = 0
    total_reviews = 0
    
    for target in targets:
        city = target["city"]
        for idx, name in enumerate(target["names"]):
            email = f"guide_{city.lower()}_extra_{idx}@example.com"
            
            # Check if exists
            existing = await db.guides.find_one({"email": email})
            if existing:
                guide_id = str(existing["_id"])
                print(f"Guide {name} already exists. Skipping insert.")
            else:
                photo = random.choice(DUMMY_PROFILE_PHOTOS)
                guide_doc = {
                    "fullName": name,
                    "email": email,
                    "phone": f"0300{random.randint(1000000, 9999999)}",
                    "city": city,
                    "experience": random.randint(3, 10),
                    "about": f"Hi! I am {name}, an expert guide in {city}. I love showing the hidden gems and rich history of my beautiful city.",
                    "languages": ["English", "Urdu", "Punjabi", "Balti"][:random.randint(2,4)],
                    "specializations": ["Historical Tours", "Food Tours", "Photography", "Nature Walks"][:random.randint(2,3)],
                    "certifications": "Professional Guide",
                    "profile_photo": photo,
                    "cnic_number": f"35201-9876543-{idx}",
                    "cnic_photo": "",
                    "is_verified": True,
                    "is_active": True,
                    "rating": 4.5 + (random.randint(0, 5) / 10.0),
                    "total_bookings": random.randint(15, 50),
                    "hashed_password": hashed_password,
                    "created_at": datetime.now(timezone.utc),
                    "report_count": 0,
                    "is_blocked": False,
                    "blocked_until": None,
                    "is_permanently_blocked": False
                }
                
                result = await db.guides.insert_one(guide_doc)
                guide_id = str(result.inserted_id)
                total_guides += 1
                print(f"Inserted guide {name} for {city}.")
            
            # Add reviews for this guide
            # Check existing reviews
            existing_reviews = await db.reviews.count_documents({"guide_id": guide_id})
            if existing_reviews < 3:
                num_reviews = random.randint(3, 5)
                for r in range(num_reviews):
                    t_name = random.choice(TRAVELER_NAMES)
                    comment = random.choice(REVIEWS)
                    rating = random.choice([4, 5, 5, 5])  # Mostly 5 stars
                    
                    review_doc = {
                        "guide_id": guide_id,
                        "traveler_email": f"{t_name.lower()}@traveler.com",
                        "traveler_name": t_name,
                        "rating": rating,
                        "comment": comment,
                        "guide_reply": "Thank you so much for your kind words! It was a pleasure showing you around." if random.random() > 0.5 else None,
                        "replied_at": datetime.now(timezone.utc) if random.random() > 0.5 else None,
                        "booking_id": None,
                        "created_at": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))
                    }
                    
                    await db.reviews.insert_one(review_doc)
                    total_reviews += 1
    
    print(f"Done! Inserted {total_guides} new guides and {total_reviews} new reviews.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_extra())
