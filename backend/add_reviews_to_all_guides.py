import asyncio
import os
import random
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

REVIEWS = [
    "Great experience, very knowledgeable guide!",
    "Showed us the best spots that are not usually crowded. Highly recommended.",
    "Very friendly and professional. Made our trip memorable.",
    "Excellent service, knew a lot about the local history and culture.",
    "Absolutely amazing! The guide was patient and very helpful with everything.",
    "Best tour we've ever had. Very accommodating to our needs."
]

TRAVELER_NAMES = ["Hassan", "Sara", "Ali", "Fatima", "Usman", "Sana", "Omar", "Ayesha"]

async def add_all_reviews():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
    db = client[DATABASE_NAME]
    
    # Get all guides
    guides = await db.guides.find().to_list(length=1000)
    
    total_reviews_added = 0
    for guide in guides:
        guide_id = str(guide["_id"])
        
        # Check if guide already has reviews
        review_count = await db.guide_reviews.count_documents({"guide_id": guide_id})
        
        if review_count < 3:
            num_reviews = random.randint(3, 5)
            for _ in range(num_reviews):
                t_name = random.choice(TRAVELER_NAMES)
                comment = random.choice(REVIEWS)
                rating = random.choice([4, 5, 5, 5])
                
                review_doc = {
                    "guide_id": guide_id,
                    "traveler_email": f"{t_name.lower()}@traveler.com",
                    "traveler_name": t_name,
                    "rating": rating,
                    "comment": comment,
                    "guide_reply": "Thank you!" if random.random() > 0.5 else None,
                    "replied_at": datetime.now(timezone.utc) if random.random() > 0.5 else None,
                    "booking_id": None,
                    "created_at": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))
                }
                
                await db.guide_reviews.insert_one(review_doc)
                total_reviews_added += 1
            
            # Update guide rating
            all_revs = await db.guide_reviews.find({"guide_id": guide_id}).to_list(length=100)
            avg_rating = sum(r["rating"] for r in all_revs) / len(all_revs)
            
            await db.guides.update_one(
                {"_id": guide["_id"]},
                {"$set": {"rating": round(avg_rating, 1)}}
            )
            
    print(f"Added {total_reviews_added} reviews to all guides.")
    client.close()

if __name__ == "__main__":
    asyncio.run(add_all_reviews())
