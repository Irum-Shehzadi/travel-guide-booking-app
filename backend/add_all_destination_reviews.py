import asyncio
import os
import random
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

DESTINATION_REVIEWS = [
    "Absolutely breathtaking place! The culture and scenery were amazing.",
    "One of the best trips of my life. I highly recommend visiting this beautiful city.",
    "The local food was fantastic and the people were incredibly hospitable.",
    "A perfect destination for nature lovers and history buffs alike.",
    "Stunning views and great weather! Can't wait to go back.",
    "An unforgettable experience. Truly a hidden gem of Pakistan.",
    "Loved exploring the local markets and historical sites. 10/10.",
    "The landscapes are surreal. A must-visit destination for anyone."
]

TRAVELER_NAMES = ["Hassan", "Sara", "Ali", "Fatima", "Usman", "Sana", "Omar", "Ayesha", "Zainab", "Bilal", "Khadija", "Hamza"]

CITIES = [
    "Lahore", "Islamabad", "Rawalpindi", "Multan", "Bahawalpur", "Faisalabad", "Sialkot", "Gujranwala",
    "Karachi", "Hyderabad", "Larkana", "Thatta", "Sukkur", "Mirpur Khas",
    "Peshawar", "Swat Valley", "Chitral", "Abbottabad", "Naran Kaghan", "Dir & Kumrat",
    "Quetta", "Gwadar", "Ziarat", "Hingol National Park",
    "Gilgit", "Hunza Valley", "Skardu", "Deosai National Park", "Fairy Meadows", "Khaplu",
    "Muzaffarabad", "Neelum Valley", "Rawalakot"
]

async def add_destination_reviews():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
    db = client[DATABASE_NAME]
    
    total_reviews_added = 0
    for city in CITIES:
        # Check if destination already has reviews
        review_count = await db.destination_reviews.count_documents({"destination_name": city})
        
        if review_count < 3:
            # Need to add reviews
            num_reviews = random.randint(3, 5)
            for _ in range(num_reviews):
                t_name = random.choice(TRAVELER_NAMES)
                comment = random.choice(DESTINATION_REVIEWS)
                rating = random.choice([4, 5, 5])
                
                review_doc = {
                    "destination_name": city,
                    "traveler_email": f"{t_name.lower()}@traveler.com",
                    "traveler_name": t_name,
                    "rating": rating,
                    "comment": comment,
                    "created_at": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 40))
                }
                
                await db.destination_reviews.insert_one(review_doc)
                total_reviews_added += 1
            
    print(f"Added {total_reviews_added} dummy reviews for destinations.")
    client.close()

if __name__ == "__main__":
    asyncio.run(add_destination_reviews())
